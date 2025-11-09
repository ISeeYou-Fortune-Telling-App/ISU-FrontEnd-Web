/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/vannaService.ts
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface VannaResponse {
  rich?: {
    id: string;
    type: string;
    lifecycle: string;
    data?: {
      content?: string;
    };
  };
  conversation_id?: string;
  request_id?: string;
}

const API_URL = 'http://localhost:8000/api/vanna/v2/chat_sse';

export async function sendVannaMessageV2(
  message: string,
  onEvent: (event: any) => void,
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

  while (true) {
    const { value, done } = await reader!.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');

    for (const part of parts.slice(0, -1)) {
      if (part.startsWith('data:')) {
        try {
          const json = JSON.parse(part.replace(/^data:\s*/, ''));
          if (json.conversation_id) localStorage.setItem('conversation_id', json.conversation_id);
          if (json.request_id) localStorage.setItem('request_id', json.request_id);
          if (json.rich) onEvent(json.rich);
        } catch {
          // ignore malformed chunk
        }
      }
    }
    buffer = parts[parts.length - 1];
  }
}
