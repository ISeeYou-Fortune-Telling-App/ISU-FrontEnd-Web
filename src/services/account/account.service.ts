import { apiFetch } from '@/services/api';
import { PagingParams } from '@/types/paging.type';
import { SingleResponse } from '@/types/response.type';

import {
  GetAccountsParams,
  GetAccountsResponse,
  GetAccountByIdResponse,
  GetStatsResponse,
  UserAccount,
  UpdateProfileRequest,
  UploadAvatarResponse,
  UploadCoverResponse,
} from '../../types/account/account.type';

export const AccountService = {
  getAccounts: async (params: GetAccountsParams): Promise<GetAccountsResponse> => {
    return await apiFetch<GetAccountsResponse>('/account', {
      method: 'GET',
      params: {
        ...params,
        page: params.page ?? 1,
        limit: params.limit ?? 15,
        sortType: params.sortType ?? 'asc',
        sortBy: params.sortBy ?? 'createdAt',
      },
    });
  },

  getCurrentUser: async () => {
    try {
      const res = await apiFetch<SingleResponse<any>>('/account/me', {
        method: 'GET',
      });
      console.log('Current user:', res.data);
      return res.data;
    } catch (err) {
      console.error('Lỗi khi gọi /account/me:', err);
      throw err;
    }
  },

  searchAccounts: async (params: PagingParams): Promise<GetAccountsResponse> => {
    return await apiFetch<GetAccountsResponse>('/account/search', {
      method: 'GET',
      params: {
        keyword: params.keyword ?? '',
        page: params.page ?? 1,
        limit: params.limit ?? 15,
        sortType: params.sortType ?? 'asc',
        sortBy: params.sortBy ?? 'createdAt',
      },
    });
  },

  getAccountById: async (id: string): Promise<UserAccount> => {
    const response = await apiFetch<GetAccountByIdResponse>(`/account/${id}`);
    return response.data;
  },

  getAccountStats: async (): Promise<GetStatsResponse> => {
    return await apiFetch<GetStatsResponse>('/account/stats');
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserAccount> => {
    return await apiFetch<UserAccount>('/account/me', {
      method: 'PUT',
      data,
    });
  },

  updateRole: async (id: string, role: string): Promise<UserAccount> => {
    return await apiFetch<UserAccount>(`/account/${id}/role`, {
      method: 'PATCH',
      data: {
        role: role,
      },
    });
  },

  updateStatus: async (id: string, status: string): Promise<UserAccount> => {
    return await apiFetch<UserAccount>(`/account/${id}/status`, {
      method: 'PATCH',
      params: { status },
    });
  },

  uploadAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiFetch<UploadAvatarResponse>('/account/me/avatar', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  },

  uploadCover: async (file: File): Promise<UploadCoverResponse> => {
    const formData = new FormData();
    formData.append('cover', file);

    const response = await apiFetch<UploadCoverResponse>('/account/me/cover', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  },
};
