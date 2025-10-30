import { apiFetch } from '@/services/api';
import { GetPackagesParams, GetPackagesResponse } from '../../types/packages/package.type';

export const PackageService = {
  getAll: async (params?: GetPackagesParams): Promise<GetPackagesResponse> => {
    const res = await apiFetch<GetPackagesResponse>('/service-packages', {
      method: 'GET',
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 15,
        sortType: params?.sortType ?? 'desc',
        sortBy: params?.sortBy ?? 'createdAt',
      },
    });
    return res;
  },

  getById: async (id: string) => {
    const res = await apiFetch(`/service-packages/${id}`, {
      method: 'GET',
    });
    return res;
  },
};
