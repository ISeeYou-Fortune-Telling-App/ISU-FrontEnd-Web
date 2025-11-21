import { apiFetch } from '@/services/api-core';
import { ListResponse, SingleResponse } from '@/types/response.type';
import { BookingResponse, BookingParams, BookingStats } from '@/types/booking/booking.type';

export const BookingService = {
  getBookings: (params: BookingParams) =>
    apiFetch<ListResponse<BookingResponse>>('/bookings', {
      method: 'GET',
      params,
    }),

  getBookingById: async (id: string): Promise<BookingResponse> => {
    const res = await apiFetch<SingleResponse<BookingResponse>>(`/bookings/${id}`, {
      method: 'GET',
    });
    return res.data;
  },

  getStats: async (): Promise<BookingStats> => {
    const res = await apiFetch<SingleResponse<BookingStats>>('/bookings/stat', {
      method: 'GET',
    });
    return res.data;
  },

  deleteBooking: async (id: string): Promise<string> => {
    const res = await apiFetch<SingleResponse<string>>(`/bookings/${id}`, {
      method: 'DELETE',
    });
    // Trả về message (data) từ SingleResponse<string>
    return res.data;
  },
};
