import { apiFetch } from '@/services/api';
import { PagingParams } from '@/types/paging.type';

import {
  ListResponse,
  isSingleResponse,
  isListResponse,
  isSimpleResponse,
} from '@/types/response.type';

import {
  GetMessagesStatsResponse,
  MessagesStats,
  GetSearchConversationsResponse,
  ConversationSession,
  ConversationParams,
} from '@/types/messages/messages.type';

type SingleMessagesStatsResponse = MessagesStats;

export const MessagesService = {
  getMessagesStats: async (): Promise<SingleMessagesStatsResponse> => {
    const response = await apiFetch<GetMessagesStatsResponse>(
      '/admin/conversations/messages/statistics',
    );

    if (isSingleResponse<MessagesStats>(response)) {
      return response.data;
    }

    if (isSimpleResponse(response)) {
      throw new Error(response.message || 'Lỗi khi tải thống kê tin nhắn.');
    }

    throw new Error('Không nhận được dữ liệu thống kê hợp lệ.');
  },

  getSearchConversations: async (
    params: ConversationParams,
  ): Promise<GetSearchConversationsResponse> => {
    const response = await apiFetch<GetSearchConversationsResponse>('/admin/conversations/search', {
      method: 'GET',
      params: {
        ...params,
        sortBy: 'sessionStartTime',
        ConversationType: 'ADMIN_CHAT',
      },
    });

    if (isListResponse<ConversationSession>(response)) {
      return response;
    }

    throw new Error('Không nhận được dữ liệu hội thoại hợp lệ.');
  },
};
