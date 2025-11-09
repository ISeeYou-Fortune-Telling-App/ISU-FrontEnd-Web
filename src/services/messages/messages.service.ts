import { apiFetch } from '@/services/api';
import { isSingleResponse, isListResponse } from '@/types/response.type';
import {
  GetMessagesStatsResponse,
  MessagesStats,
  GetSearchConversationsResponse,
  ConversationSession,
  ConversationParams,
} from '@/types/messages/messages.type';

export const MessagesService = {
  getMessagesStats: async (): Promise<MessagesStats> => {
    const response = await apiFetch<GetMessagesStatsResponse>(
      '/admin/conversations/messages/statistics',
    );

    if (isSingleResponse<MessagesStats>(response)) {
      return response.data;
    }

    throw new Error('Không nhận được dữ liệu thống kê hợp lệ.');
  },

  getSearchConversations: async (params: ConversationParams): Promise<ConversationSession[]> => {
    const response = await apiFetch<GetSearchConversationsResponse>('/admin/conversations/search', {
      method: 'GET',
      params: {
        ...params,
        sortBy: 'sessionStartTime',
        type: 'ADMIN_CHAT',
      },
    });

    if (isListResponse<ConversationSession>(response)) {
      return response.data;
    }

    throw new Error('Không nhận được dữ liệu hội thoại hợp lệ.');
  },
};
