import { SingleResponse, ListResponse, SimpleResponse } from '../response.type';
import { PagingParams } from '../paging.type';

export type ConversationType = 'BOOKING_SESSION' | 'ADMIN_CHAT' | 'SUPPORT';
export type ConversationStatus = 'WAITING' | 'ACTIVE' | 'ENDED' | 'CANCELLED';

export interface ChatHistoryStats {
  bookingConversations: number;
  supportConversations: number;
  adminConversations: number;
  totalActives: number;
  totalMessages: number;
}

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;

  conversationId: string;
  conversationType: ConversationType;

  seerId: string | null;
  seerName: string | null;
  seerAvatarUrl: string | null;

  customerId: string | null;
  customerName: string | null;
  customerAvatarUrl: string | null;

  sessionStartTime: string | null;
  sessionEndTime: string | null;
  sessionDurationMinutes: number | null;

  seerUnreadCount: number;
  customerUnreadCount: number;
  adminUnreadCount: number | null;

  lastMessageContent: string | null;
  lastMessageTime: string | null;

  status: ConversationStatus;

  sessionCanceledBy: string | null;
  sessionCanceledTime: string | null;
}

export interface GetConversationsParams extends PagingParams {
  sortBy?: 'sessionStartTime';
  participantName?: string;
  type?: ConversationType;
  status?: ConversationStatus;
}

export type GetConversationsResponse = ListResponse<Conversation> | SimpleResponse;
export type GetChatHistoryStatsResponse = SingleResponse<ChatHistoryStats> | SimpleResponse;
