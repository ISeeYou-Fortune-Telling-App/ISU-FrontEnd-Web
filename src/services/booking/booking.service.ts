import { apiFetch } from '@/services/api';
import { ListResponse, SingleResponse } from '@/types/response.type';
import { BookingResponse, BookingParams } from '@/types/booking/booking.type';

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
};
