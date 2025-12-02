/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ChatEvent {
  type: 'text' | 'dataframe' | 'chart' | 'status' | 'html' | 'image' | 'error' | 'unknown';
  content?: string;
  data?: any;
}

const API_URL = process.env.NEXT_PUBLIC_GATEWAY_DEPLOY + '/ai-analysis/api/vanna/v2/chat_sse';

export async function sendVannaMessageV2(
  message: string,
  onEvent: (event: ChatEvent) => void,
  onDone?: () => void,
): Promise<void> {
  const conversationId = localStorage.getItem('conversation_id') || '';
  const requestId = localStorage.getItem('request_id') || '';

  const payload: Record<string, string> = { message };
  if (conversationId && requestId) {
    payload.conversation_id = conversationId;
    payload.request_id = requestId;
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const reader = res.body?.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { value, done } = await reader!.read();
    if (done) {
      onDone?.();
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');

    for (const part of parts.slice(0, -1)) {
      if (!part.startsWith('data:')) continue;

      try {
        const json = JSON.parse(part.replace(/^data:\s*/, ''));

        if (json.conversation_id) localStorage.setItem('conversation_id', json.conversation_id);
        if (json.request_id) localStorage.setItem('request_id', json.request_id);

        if (json.rich) {
          const rich = json.rich;
          const event: ChatEvent = {
            type:
              rich.type === 'text'
                ? 'text'
                : rich.type === 'dataframe'
                ? 'dataframe'
                : rich.type === 'chart'
                ? 'chart'
                : rich.type === 'status_bar_update'
                ? 'status'
                : rich.type === 'html'
                ? 'html'
                : rich.type === 'image'
                ? 'image'
                : rich.type === 'error'
                ? 'error'
                : 'unknown',
            content: rich.data?.content ?? '',
            data: rich.data ?? null,
          };

          onEvent(event);
        }
      } catch {
        // ignore malformed chunks
      }
    }

    buffer = parts[parts.length - 1];
  }
}
