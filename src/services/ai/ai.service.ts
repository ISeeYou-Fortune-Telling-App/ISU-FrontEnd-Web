// src/services/ai/ai.service.ts
export interface ChatEvent {
  type: 'text' | 'chart' | 'dataframe' | 'task' | 'status' | 'other';
  content?: string;
  data?: any;
}

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

  const res = await fetch('http://localhost:8000/api/vanna/v2/chat_sse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const reader = res.body?.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let doneReceived = false;

  while (true) {
    const { value, done } = await reader!.read();

    // ⛔️ Không break vội, chỉ thoát khi đã gặp [DONE]
    if (value) {
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');

      for (const part of parts.slice(0, -1)) {
        if (!part.startsWith('data:')) continue;
        const raw = part.replace(/^data:\s*/, '').trim();

        if (raw === '[DONE]') {
          doneReceived = true;
          continue;
        }

        try {
          const json = JSON.parse(raw);
          if (json.conversation_id) localStorage.setItem('conversation_id', json.conversation_id);
          if (json.request_id) localStorage.setItem('request_id', json.request_id);

          const rich = json.rich || {};
          const type = rich.type || json.type || 'other';
          const data = rich.data || json.data || {};

          const event: ChatEvent = { type: 'other', data };
          if (type === 'text') (event.type = 'text'), (event.content = data.content || '');
          else if (type === 'dataframe') event.type = 'dataframe';
          else if (type === 'chart') event.type = 'chart';
          else if (type === 'status_bar_update') event.type = 'status';
          else if (type === 'task_tracker_update') event.type = 'task';

          onEvent(event);
        } catch (e) {
          console.warn('❌ Parse chunk lỗi:', part);
        }
      }
      buffer = parts[parts.length - 1];
    }

    if (done) {
      // 💡 Thêm chờ 200ms để backend gửi kịp chunk [DONE]
      await new Promise((r) => setTimeout(r, 200));
      if (doneReceived) break;
    }
  }

  onDone?.();
}
