import { apiFetch } from '@/services/api';
import {
  ChatQueryStreamRequest,
  ImageAnalysisResponse,
  AnalysisType,
} from '../../types/ai/ai.type';

import { SingleResponse } from '@/types/response.type';

export const AIService = {
  chatQueryStream: async (
    payload: ChatQueryStreamRequest,
    onChunk: (text: string) => void,
    onComplete?: (finalAnswer: string) => void,
    onError?: (error: Error) => void,
  ) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai-chat/query-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let typingTimer: NodeJS.Timeout | null = null;
      let fullAnswer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const text = line.replace('data:', '').trim();

          if (text === '[DONE]') {
            onComplete?.(fullAnswer.trim());
            return;
          }

          fullAnswer += text + ' ';
          onChunk(text);
        }
      }

      onComplete?.(fullAnswer.trim());
    } catch (err) {
      console.error('[AIService.chatQueryStream] Error:', err);
      onError?.(err as Error);
    }
  },

  analyzePalm: async (file: File): Promise<ImageAnalysisResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiFetch<ImageAnalysisResponse>('/ai-chat/analyze-palm', {
      method: 'POST',
      data: formData,
      headers: {},
    });

    return response;
  },

  analyzeFace: async (file: File): Promise<ImageAnalysisResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiFetch<ImageAnalysisResponse>('/ai-chat/analyze-face', {
      method: 'POST',
      data: formData,
    });

    return response;
  },
};
