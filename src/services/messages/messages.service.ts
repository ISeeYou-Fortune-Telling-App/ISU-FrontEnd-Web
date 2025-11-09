import { apiFetch } from '@/services/api';
import { isSingleResponse, isListResponse } from '@/types/response.type';
import {
  GetMessagesStatsResponse,
  MessagesStats,
  GetSearchConversationsResponse,
  GetMessagesByConversationResponse,
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

  getMessagesByConversation: async (
    conversationId: string,
    page = 1,
    limit = 50,
  ): Promise<GetMessagesByConversationResponse> => {
    const response = await apiFetch<GetMessagesByConversationResponse>(
      `/chat/conversations/${conversationId}/messages`,
      {
        method: 'GET',
        params: { page, limit, sortType: 'desc', sortBy: 'createdAt' },
      },
    );

    if (response?.data) return response;
    throw new Error('Không nhận được dữ liệu tin nhắn hợp lệ.');
  },
};
