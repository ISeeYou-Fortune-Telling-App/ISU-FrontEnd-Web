import { apiFetch, SingleResponse } from '@/services/api';

import { 
  GetAccountsParams, 
  GetAccountsResponse, 
  GetAccountByIdResponse, 
  GetStatsResponse, 
  UserAccount 
} from './account.type';

export const AccountService = {

  getAccounts: async (params: GetAccountsParams): Promise<GetAccountsResponse> => {
    return await apiFetch<GetAccountsResponse>('/account', {
      method: 'GET',
      params: {
        ...params,
        page: params.page ?? 1,
        limit: params.limit ?? 15,
        sortType: params.sortType ?? 'desc',
        sortBy: params.sortBy ?? 'createdAt',
      },
    });
  },

  getCurrentUser: async () => {
    try {
      const res = await apiFetch<SingleResponse<any>>('/account/me', {
        method: 'GET',
      });
      console.log('✅ Current user:', res.data);
      return res.data;
    } catch (err) {
      console.error('❌ Lỗi khi gọi /account/me:', err);
      throw err;
    }
  },

  searchAccounts: async (params: {
    keyword?: string;
    page?: number;
    limit?: number;
    sortType?: 'asc' | 'desc';
    sortBy?: string;
  }): Promise<GetAccountsResponse> => {
    return await apiFetch<GetAccountsResponse>('/account/search', {
      method: 'GET',
      params: {
        keyword: params.keyword ?? '',
        page: params.page ?? 1,
        limit: params.limit ?? 15,
        sortType: params.sortType ?? 'desc',
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
};
