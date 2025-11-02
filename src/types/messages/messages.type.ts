import { SingleResponse, ListResponse, SimpleResponse } from '../response.type';
import { PagingParams } from '../paging.type';

export type ConversationStatus = 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
export type ConversationCanceler = 'SEER' | 'CUSTOMER' | 'BOTH' | null;
export type ConversationType = 'BOOKING_SESSION' | 'ADMIN_CHAT';

export interface ConversationSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
  seerId: string;
  seerName: string;
  seerAvatarUrl: string;
  customerId: string;
  customerName: string;
  customerAvatarUrl: string;
  sessionStartTime: string;
  sessionEndTime: string | null;
  sessionDurationMinutes: number | null;
  seerUnreadCount: number;
  customerUnreadCount: number;
  lastMessageContent: string;
  lastMessageTime: string;
  status: ConversationStatus;
  sessionCanceledBy: ConversationCanceler;
  sessionCanceledTime: string | null;
}

export interface ConversationParams extends PagingParams {
  sortBy: string;
  participantName?: string;
  type?: ConversationType;
  status?: ConversationStatus;
}

export interface MessagesStats {
  totalUsers: number;
  totalActives: number;
  totalSentMessages: number;
  readPercent: number;
}

export type GetMessagesStatsResponse = SingleResponse<MessagesStats> | SimpleResponse;
export type GetSearchConversationsResponse = ListResponse<ConversationSession>;
