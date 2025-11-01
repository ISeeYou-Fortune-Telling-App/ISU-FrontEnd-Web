export type ConversationStatus = 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
export type ConversationCanceler = 'SEER' | 'CUSTOMER' | 'BOTH' | null;

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
