import { SingleResponse, ListResponse, SimpleResponse } from '../response.type';
import { PagingParams } from '../paging.type';

export interface ChatHistoryStats {
  bookingConversations: number;
  supportConversations: number;
  adminConversations: number;
  totalActives: number;
  totalMessages: number;
}

export type GetChatHistoryStatsResponse = SingleResponse<ChatHistoryStats> | SimpleResponse;
