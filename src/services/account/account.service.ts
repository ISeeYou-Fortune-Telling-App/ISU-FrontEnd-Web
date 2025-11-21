import { apiFetch } from '@/services/api-core';
import { ListResponse, SingleResponse, SimpleResponse } from '@/types/response.type';
import {
  GetAccountsParams,
  UserAccount,
  AccountStats,
  UpdateProfileRequest,
  UpdateUserRoleRequest,
  ApproveSeerRequest,
} from '../../types/account/account.type';

export const AccountService = {
  async getAccounts(params: GetAccountsParams): Promise<ListResponse<UserAccount>> {
    return await apiFetch(`/account`, {
      method: 'GET',
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 15,
        sortType: params.sortType ?? 'asc',
        sortBy: params.sortBy ?? 'createdAt',
        keyword: params.keyword ?? undefined,
        role: params.role ?? undefined,
        status: params.status ?? undefined,
      },
    });
  },
  async approveSeer(id: string): Promise<SingleResponse<UserAccount>> {
    return await apiFetch(`/account/${id}/approve-seer`, { method: 'PATCH' });
  },

  async getCurrentUser(): Promise<SingleResponse<UserAccount>> {
    return await apiFetch(`/account/me`, { method: 'GET' });
  },

  async getAccountById(id: string): Promise<SingleResponse<UserAccount>> {
    return await apiFetch(`/account/${id}`, { method: 'GET' });
  },

  async getAccountStats(): Promise<SingleResponse<AccountStats>> {
    return await apiFetch(`/account/stats`, { method: 'GET' });
  },

  async updateProfile(data: UpdateProfileRequest): Promise<SingleResponse<UserAccount>> {
    return await apiFetch(`/account/me`, { method: 'PUT', data });
  },

  async updateUserRole(
    id: string,
    data: UpdateUserRoleRequest,
  ): Promise<SingleResponse<UserAccount>> {
    return await apiFetch(`/account/${id}/role`, { method: 'PATCH', data });
  },

  async updateUserStatus(id: string, status: string): Promise<SimpleResponse> {
    return await apiFetch(`/account/${id}/status`, {
      method: 'PATCH',
      params: { status },
    });
  },

  async uploadAvatar(file: File): Promise<SimpleResponse> {
    const formData = new FormData();
    formData.append('avatar', file);
    return await apiFetch(`/account/me/avatar`, {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async uploadCover(file: File): Promise<SimpleResponse> {
    const formData = new FormData();
    formData.append('cover', file);
    return await apiFetch(`/account/me/cover`, {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async deleteAccount(id: string): Promise<SimpleResponse> {
    return await apiFetch(`/account/${id}`, { method: 'DELETE' });
  },
};
