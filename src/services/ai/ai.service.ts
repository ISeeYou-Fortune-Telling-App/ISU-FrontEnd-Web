import { apiFetch } from '@/services/api';
import {
  ChatRequest,
  ChatResponse,
  ImageAnalysisResponse,
  SingleResponse,
  AnalysisType,
} from './ai.type';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export const AIService = {
  // 🌊 Chat — streaming version (luôn dùng stream)
  chat: async (
    payload: ChatRequest,
    onChunk: (chunk: string) => void,
    onDone?: () => void,
    onError?: (err: unknown) => void
  ): Promise<void> => {
    const body = {
      question: payload.question,
      topK: payload.topK ?? 5,
      forceReindex: payload.forceReindex ?? false,
    };

    console.log('🚀 Streaming to:', `${API_BASE}/ai-chat/query-stream`);
    console.log('📦 Payload:', body);

    try {
      const res = await fetch(`${API_BASE}/ai-chat/query-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`❌ Streaming error: ${res.status} - ${text}`);
      }

      if (!res.body) throw new Error('Không có dữ liệu stream trả về.');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        // Gửi từng chunk ra ngoài (component nhận để cập nhật UI)
        onChunk(chunk);
      }

      onDone?.();
    } catch (err) {
      console.error('❌ Streaming failed:', err);
      onError?.(err);
    }
  },

  // 📷 Upload ảnh (palm / face)
  analyzeImage: async (
    file: File,
    type: AnalysisType
  ): Promise<ImageAnalysisResponse> => {
    const form = new FormData();
    form.append('file', file);

    const url =
      type === 'palm' ? '/ai-chat/analyze-palm' : '/ai-chat/analyze-face';

    const res = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      body: form,
    });

    if (!res.ok) throw new Error(await res.text());
    const json = (await res.json()) as SingleResponse<ImageAnalysisResponse>;
    return json.data;
  },

  analyzePalm: (file: File) => AIService.analyzeImage(file, 'palm'),
  analyzeFace: (file: File) => AIService.analyzeImage(file, 'face'),
};
