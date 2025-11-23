import { PagingParams } from '../paging.type';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'VNPAY' | 'MOMO' | 'PAYPAL' | 'CASH';

export interface BookingPayment {
  id: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  bookingId: string;
  paymentStatus: PaymentStatus;
  customer: {
    fullName: string;
    avatarUrl: string;
  };
  seer: {
    fullName: string;
    avatarUrl: string;
  };
  transactionId: string;
  packageTitle: string;
  paymentMethod: PaymentMethod;
  amount: number;
  failureReason: string | null;
}

export interface PaymentParams extends PagingParams {
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  searchName?: string;
  userId?: string;
  seerId?: string;
  role?: string;
}
