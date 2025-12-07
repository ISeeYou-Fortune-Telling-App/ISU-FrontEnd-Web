import { SingleResponse, ListResponse, SimpleResponse } from '../response.type';
import { PagingParams } from '../paging.type';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'COMPLETED' | 'CANCELED';
export type PaymentMethod = 'VNPAY' | 'MOMO' | 'PAYPAL';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface BookingResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: BookingStatus;
  seer: SeerInfo;
  customer: CustomerInfo;
  servicePackage: ServicePackageInfo;
  scheduledTime: string;
  additionalNote: string;
  bookingPaymentInfos: BookingPaymentInfo[];
  redirectUrl: string | null;
}

export interface SeerInfo {
  fullName: string;
  avatarUrl: string;
  avgRating: number;
}

export interface CustomerInfo {
  fullName: string;
  avatarUrl: string;
}

export interface ServicePackageInfo {
  packageTitle: string;
  packageContent: string;
  price: number;
  durationMinutes: number;
  categories: string[];
}

export interface BookingPaymentInfo {
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTime: string;
  approvalUrl: string | null;
  failureReason: string | null;
}

export interface BookingParams extends PagingParams {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  name?: string;
}

export interface PaymentParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortType?: 'asc' | 'desc';
  seerId?: string;
  userId?: string;
  paymentStatus?: string;
  paymentMethod?: string;
}

export interface BookingStats {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  canceledBookings: number;
}
