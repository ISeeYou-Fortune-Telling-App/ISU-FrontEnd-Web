import { apiFetch } from '@/services/api';
import { PagingParams } from '@/types/paging.type';

import {
  ListResponse,
  isSingleResponse,
  isListResponse,
  isSimpleResponse,
} from '@/types/response.type';

import {
  GetChatHistoryStatsResponse,
  ChatHistoryStats,
  GetConversationsParams,
  GetConversationsResponse,
  Conversation,
} from '@/types/chatHistory/chatHistory.type';

type SingleHistorysStatsResponse = ChatHistoryStats;
type ListConversationsResponse = ListResponse<Conversation>;

export const ChatHistoryService = {
  getChatHistoryStats: async (): Promise<SingleHistorysStatsResponse> => {
    const response = await apiFetch<GetChatHistoryStatsResponse>('/admin/conversations/statistics');

    if (isSingleResponse<ChatHistoryStats>(response)) {
      return response.data;
    }

    if (isSimpleResponse(response)) {
      throw new Error(response.message || 'Lỗi khi tải thống kê lịch sử trò chuyện.');
    }

    throw new Error('Không nhận được dữ liệu thống kê hợp lệ.');
  },

  getConversations: async (params: GetConversationsParams): Promise<ListConversationsResponse> => {
    const response = await apiFetch<GetConversationsResponse>('/admin/conversations/search', {
      method: 'GET',
      params,
    });

    if (isListResponse<Conversation>(response)) {
      return response;
    }

    if (isSimpleResponse(response)) {
      throw new Error(response.message || 'Lỗi khi tải danh sách hội thoại.');
    }

    throw new Error('Không nhận được dữ liệu hợp lệ từ máy chủ.');
  },
};
