import { SingleResponse, ListResponse, SimpleResponse } from '../response.type';
import { PagingParams } from '../paging.type';

export type ConversationStatus = 'ACTIVE' | 'CANCELLED' | 'ENDED' | 'WAITING';
export type ConversationCanceler = 'SEER' | 'CUSTOMER' | 'BOTH' | null;
export type ConversationType = 'ADMIN_CHAT';

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

export interface Message {
  id: string;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  seerId: string;
  seerName: string;
  seerAvatar: string;
  textContent: string;
  imageUrl: string | null;
  videoUrl: string | null;
  messageType: 'USER' | 'SYSTEM';
  status: 'READ' | 'UNREAD';
  deletedBy: string | null;
  senderId: string;
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
export type GetMessagesByConversationResponse = ListResponse<Message>;
