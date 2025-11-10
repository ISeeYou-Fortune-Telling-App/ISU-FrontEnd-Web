import { SingleResponse, ListResponse, SimpleResponse } from '../response.type';
import { PagingParams } from '../paging.type';

export type ConversationStatus = 'ACTIVE' | 'CANCELLED' | 'ENDED' | 'WAITING';
export type ConversationCanceler = 'SEER' | 'CUSTOMER' | 'BOTH' | null;
export type ConversationType = 'ADMIN_CHAT';

export interface SimpleUserInfo {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: string;
}

export interface ConversationSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
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
  adminUnreadCount: number;
  unreadForAdmin?: boolean;
  lastMessageContent: string | null;
  lastMessageTime: string | null;
  status: ConversationStatus;
  sessionCanceledBy: ConversationCanceler;
  sessionCanceledTime: string | null;
  lastMessageSenderId?: string; // ✅ chỉ để FE dùng
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

export interface CreateAdminConversationRequest {
  targetUserId: string;
  initialMessage: string;
}

export interface ConversationData {
  id: string;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
  conversationType: 'ADMIN_CHAT' | 'BOOKING_SESSION';
  seerId: string | null;
  seerName: string | null;
  seerAvatarUrl: string | null;
  customerId: string | null;
  customerName: string | null;
  customerAvatarUrl: string | null;
  sessionStartTime: string;
  sessionEndTime: string | null;
  sessionDurationMinutes: number | null;
  seerUnreadCount: number;
  customerUnreadCount: number;
  adminUnreadCount: number;
  lastMessageContent: string | null;
  lastMessageTime: string | null;
  status: 'WAITING' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
  sessionCanceledBy: 'SEER' | 'CUSTOMER' | 'BOTH' | null;
  sessionCanceledTime: string | null;
}

export type CreateAdminConversationResponse = SingleResponse<ConversationData>;
