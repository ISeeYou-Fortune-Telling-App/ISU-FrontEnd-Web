import { apiFetch } from '@/services/api';
import {
  ListResponse,
  SingleResponse,
  SimpleResponse,
  isListResponse,
  isSingleResponse,
  isSimpleResponse,
} from '@/types/response.type';
import type { BookingPayment, PaymentParams } from '@/types/payments/payments.type';

// ==== TYPE RESPONSE TỔNG HỢP ====
export type GetPaymentsResponse = ListResponse<BookingPayment> | SimpleResponse;
export type GetPaymentByIdResponse = SingleResponse<BookingPayment> | SimpleResponse;

// ==== SERVICE ====
export const BookingPaymentService = {
  /**
   * 📜 Lấy danh sách các thanh toán (Booking Payments)
   * Endpoint: GET /bookings/payments
   */
  getPayments: async (params: PaymentParams): Promise<ListResponse<BookingPayment>> => {
    const response = await apiFetch<GetPaymentsResponse>('/bookings/payments', {
      method: 'GET',
      params,
    });

    if (isListResponse<BookingPayment>(response)) return response;

    if (isSimpleResponse(response)) {
      throw new Error(response.message || 'Lỗi khi tải danh sách thanh toán.');
    }

    throw new Error('Định dạng phản hồi danh sách thanh toán không hợp lệ.');
  },

  /**
   * 🔍 Lấy chi tiết thanh toán theo ID
   * Endpoint: GET /bookings/payments/{paymentId}
   */
  getPaymentById: async (paymentId: string): Promise<BookingPayment> => {
    const response = await apiFetch<GetPaymentByIdResponse>(`/bookings/payments/${paymentId}`, {
      method: 'GET',
    });

    if (isSingleResponse<BookingPayment>(response)) return response.data;

    if (isSimpleResponse(response) && response.message) {
      throw new Error(response.message);
    }

    throw new Error('Không nhận được dữ liệu chi tiết thanh toán hợp lệ.');
  },
};
