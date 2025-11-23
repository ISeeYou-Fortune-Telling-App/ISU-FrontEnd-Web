// notification.service.ts

import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { SimpleResponse } from '@/types/response.type';
import { apiFetch } from '../api-push-noti';
import { NotificationCreateRequest, NotificationParams } from '@/types/notification/notification.type';
import { SingleResponse } from '@/types/response.type';
import { PageResponse } from '@/types/paging.type';

export const notificationService = {
  /**
   * Tạo notification mới
   */
  createNotification: async (
    data: NotificationCreateRequest,
  ): Promise<SingleResponse<Notification>> => {
    const res = await apiFetch<SingleResponse<Notification>>('', {
      method: 'POST',
      data,
    });
    return res;
  },

  /**
   * Lấy danh sách notification theo recipientId (có phân trang)
   */
  getNotificationsByRecipientId: async (
    params: NotificationParams,
  ): Promise<PageResponse<Notification>> => {
    if (!params.recipientId) {
      throw new Error('recipientId is required');
    }

    const res = await apiFetch<PageResponse<Notification>>('', {
      method: 'GET',
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 15,
        sortBy: params.sortBy ?? 'createdAt',
        sortType: params.sortType ?? 'desc',
        recipientId: params.recipientId,
      },
    });
    return res;
  },

  /**
   * Lấy tất cả notification của user hiện tại 
   */
  getMyNotifications: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }): Promise<PageResponse<Notification>> => {
    const res = await apiFetch<PageResponse<Notification>>('/me', {
      method: 'GET',
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 15,
        sortBy: params?.sortBy ?? 'createdAt',
        sortType: params?.sortType ?? 'desc',
      },
    });
    return res;
  },

  /**
   * Đánh dấu notification đã đọc
   */
  markAsRead: async (notificationId: string): Promise<SingleResponse<Notification>> => {
    const res = await apiFetch<SingleResponse<Notification>>(
      `/${notificationId}/read`,
      {
        method: 'PATCH',
      },
    );
    return res;
  },

  /**
   * Xóa notification
   */
  deleteNotification: async (notificationId: string): Promise<SimpleResponse> => {
    const res = await apiFetch<SimpleResponse>(`/${notificationId}`, {
      method: 'DELETE',
    });
    return res;
  },
};