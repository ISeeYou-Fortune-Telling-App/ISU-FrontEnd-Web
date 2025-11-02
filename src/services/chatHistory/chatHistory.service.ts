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
} from '@/types/chatHistory/chatHistory.type';

type SingleHistorysStatsResponse = ChatHistoryStats;

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
};
