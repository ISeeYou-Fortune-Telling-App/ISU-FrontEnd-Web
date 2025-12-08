export enum TargetType {
  CONVERSATION = 'CONVERSATION',
  BOOKING = 'BOOKING',
  PAYMENT = 'PAYMENT',
  REPORT = 'REPORT',
  ACCOUNT = 'ACCOUNT',
  SERVICE_PACKAGES = 'SERVICE_PACKAGES',
  SERVICE_REVIEWS = 'SERVICE_REVIEWS',
}

export interface Notification {
  id: string;
  fcmToken: string;
  notificationTitle: string;
  notificationBody: string;
  targetType: TargetType;
  targetId: string;
  recipientId: string;
  imageUrl?: string;
  metaData?: Record<string, string>;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCreateRequest {
  fcmToken: string;
  notificationTitle?: string;
  notificationBody?: string;
  targetType?: TargetType;
  targetId?: string;
  recipientId?: string;
  imageUrl?: string;
  metaData?: Record<string, string>;
}

export interface NotificationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortType?: 'asc' | 'desc';
  recipientId?: string;
}
