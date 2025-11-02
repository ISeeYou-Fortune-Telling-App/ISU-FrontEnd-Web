import { apiFetch } from '@/services/api';
import { PagingParams } from '@/types/paging.type';
import {
  SingleResponse,
  ListResponse,
  SimpleResponse,
  isListResponse,
  isSingleResponse,
  isSimpleResponse,
} from '@/types/response.type';
import { BookingResponse, BookingStatus, BookingParams } from '@/types/booking/booking.type';

// ==== TYPE RESPONSE TỔNG HỢP ====

export type GetBookingsResponse = ListResponse<BookingResponse> | SimpleResponse;
export type GetBookingByIdResponse = SingleResponse<BookingResponse> | SimpleResponse;

// ==== SERVICE ====
export const BookingService = {
  getBookings: async (params: BookingParams): Promise<ListResponse<BookingResponse>> => {
    const response = await apiFetch<GetBookingsResponse>('/bookings', {
      method: 'GET',
      params,
    });

    if (isListResponse<BookingResponse>(response)) return response;

    if (isSimpleResponse(response)) {
      throw new Error(response.message || 'Lỗi khi tải danh sách bookings.');
    }

    throw new Error('Định dạng phản hồi danh sách bookings không hợp lệ.');
  },

  /**
   * 🔍 Get booking detail by ID
   * Endpoint: GET /bookings/{id}
   */
  getBookingById: async (id: string): Promise<BookingResponse> => {
    const response = await apiFetch<GetBookingByIdResponse>(`/bookings/${id}`, {
      method: 'GET',
    });

    if (isSingleResponse<BookingResponse>(response)) return response.data;

    if (isSimpleResponse(response) && response.message) {
      throw new Error(response.message);
    }

    throw new Error('Không nhận được dữ liệu booking chi tiết hợp lệ.');
  },
};
