import { apiFetch } from '@/services/api-core';
import { isListResponse, isSingleResponse } from '@/types/response.type';
import {
  GetChatHistoryStatsResponse,
  ChatHistoryStats,
  GetConversationsParams,
  GetConversationsResponse,
  Conversation,
} from '@/types/chatHistory/chatHistory.type';

export const ChatHistoryService = {
  getChatHistoryStats: async (): Promise<ChatHistoryStats> => {
    const response = await apiFetch<GetChatHistoryStatsResponse>('/admin/conversations/statistics');

    if (isSingleResponse<ChatHistoryStats>(response)) {
      return response.data;
    }

    throw new Error('Không nhận được dữ liệu thống kê hợp lệ.');
  },

  getConversations: async (params: GetConversationsParams) => {
    const response = await apiFetch<GetConversationsResponse>('/admin/conversations/search', {
      method: 'GET',
      params,
    });

    if (isListResponse<Conversation>(response)) {
      return {
        data: response.data,
        paging: response.paging,
      };
    }

    throw new Error('Không nhận được dữ liệu hội thoại hợp lệ.');
  },
};
