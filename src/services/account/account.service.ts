import { apiFetch } from '@/services/api';
import { PagingParams } from '@/types/paging.type';

import {
  ListResponse,
  isSingleResponse,
  isListResponse,
  isSimpleResponse,
} from '@/types/response.type';

import {
  GetAccountsParams,
  GetAccountsResponse,
  GetAccountByIdResponse,
  GetStatsResponse,
  UserAccount,
  UpdateProfileRequest,
  UploadAvatarResponse,
  UploadCoverResponse,
  DeleteAccountResponse,
  UpdateUserRoleRequest,
  AccountStats,
} from '../../types/account/account.type';

type ListUserAccountResponse = ListResponse<UserAccount>;
type SingleUserAccountResponse = UserAccount;
type SingleAccountStatsResponse = AccountStats;
type SimpleResponseSuccess = Record<string, never>;

export const AccountService = {
  getAccounts: async (params: GetAccountsParams): Promise<ListUserAccountResponse> => {
    const response = await apiFetch<GetAccountsResponse>('/account', {
      method: 'GET',
      params: {
        ...params,
        page: params.page ?? 1,
        limit: params.limit ?? 15,
        sortType: params.sortType ?? 'asc',
        sortBy: params.sortBy ?? 'createdAt',
      },
    });

    if (isListResponse<UserAccount>(response)) {
      return response;
    }

    if (isSimpleResponse(response)) {
      throw new Error(response.message || 'Lỗi khi tải danh sách tài khoản.');
    }

    throw new Error('Định dạng phản hồi danh sách tài khoản không hợp lệ.');
  },

  getCurrentUser: async (): Promise<SingleUserAccountResponse> => {
    const res = await apiFetch<GetAccountByIdResponse>('/account/me', {
      method: 'GET',
    });

    if (isSingleResponse<UserAccount>(res)) {
      return res.data;
    }

    if (isSimpleResponse(res)) {
      throw new Error(res.message || 'Lỗi khi tải thông tin người dùng hiện tại.');
    }

    throw new Error('Không nhận được dữ liệu người dùng hiện tại hợp lệ.');
  },

  getAccountById: async (id: string): Promise<SingleUserAccountResponse> => {
    const response = await apiFetch<GetAccountByIdResponse>(`/account/${id}`);
    if (isSingleResponse<UserAccount>(response)) {
      return response.data;
    }

    if (isSimpleResponse(response) && response.message) {
      throw new Error(response.message);
    }

    throw new Error('Không nhận được dữ liệu tài khoản hợp lệ.');
  },

  getAccountStats: async (): Promise<SingleAccountStatsResponse> => {
    const response = await apiFetch<GetStatsResponse>('/account/stats');

    if (isSingleResponse<AccountStats>(response)) {
      return response.data;
    }

    if (isSimpleResponse(response)) {
      throw new Error(response.message || 'Lỗi khi tải thống kê tài khoản.');
    }

    throw new Error('Không nhận được dữ liệu thống kê hợp lệ.');
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<SingleUserAccountResponse> => {
    const response = await apiFetch<GetAccountByIdResponse>('/account/me', {
      method: 'PUT',
      data,
    });

    if (isSingleResponse<UserAccount>(response)) {
      return response.data;
    }

    if (isSimpleResponse(response)) {
      throw new Error(response.message || 'Lỗi khi cập nhật hồ sơ.');
    }

    throw new Error('Không nhận được dữ liệu hồ sơ sau khi cập nhật hợp lệ.');
  },

  updateUserRole: async (
    id: string,
    data: UpdateUserRoleRequest,
  ): Promise<SingleUserAccountResponse> => {
    const response = await apiFetch<GetAccountByIdResponse>(`/account/${id}/role`, {
      method: 'PATCH',
      data,
    });

    if (isSingleResponse<UserAccount>(response)) {
      return response.data;
    }

    if (isSimpleResponse(response)) {
      throw new Error(response.message || 'Lỗi khi cập nhật vai trò người dùng.');
    }

    throw new Error('Không nhận được dữ liệu người dùng sau khi cập nhật vai trò hợp lệ.');
  },

  updateUserStatus: async (id: string, status: string): Promise<SingleUserAccountResponse> => {
    const response = await apiFetch<GetAccountByIdResponse>(`/account/${id}/status`, {
      method: 'PATCH',
      params: { status },
    });

    if (isSingleResponse<UserAccount>(response)) {
      return response.data;
    }

    if (isSimpleResponse(response)) {
      throw new Error(response.message || 'Lỗi khi cập nhật trạng thái người dùng.');
    }

    throw new Error('Không nhận được dữ liệu người dùng sau khi cập nhật trạng thái hợp lệ.');
  },

  uploadAvatar: async (file: File): Promise<SimpleResponseSuccess> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiFetch<UploadAvatarResponse>('/account/me/avatar', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (isSimpleResponse(response)) {
      if (response.statusCode < 400) {
        return {};
      }
      throw new Error(response.message || 'Lỗi khi tải ảnh đại diện.');
    }

    if (isSingleResponse<Record<string, never>>(response)) {
      return {};
    }

    throw new Error('Lỗi không xác định khi tải ảnh đại diện.');
  },

  uploadCover: async (file: File): Promise<SimpleResponseSuccess> => {
    const formData = new FormData();
    formData.append('cover', file);

    const response = await apiFetch<UploadCoverResponse>('/account/me/cover', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (isSimpleResponse(response)) {
      if (response.statusCode < 400) {
        return {};
      }
      throw new Error(response.message || 'Lỗi khi tải ảnh bìa.');
    }

    if (isSingleResponse<Record<string, never>>(response)) {
      return {};
    }

    throw new Error('Lỗi không xác định khi tải ảnh bìa.');
  },

  deleteAccount: async (id: string): Promise<SimpleResponseSuccess> => {
    const response = await apiFetch<DeleteAccountResponse>(`/account/${id}`, {
      method: 'DELETE',
    });

    if (isSimpleResponse(response)) {
      if (response.statusCode < 400) {
        return {};
      }
      throw new Error(response.message || 'Lỗi khi xóa tài khoản.');
    }

    if (isSingleResponse<Record<string, never>>(response)) {
      return {};
    }

    throw new Error('Lỗi không xác định khi xóa tài khoản.');
  },
};
