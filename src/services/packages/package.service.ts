import { apiFetch } from '@/services/api';
import { GetPackagesParams, GetPackagesResponse, PackageInteractionRequest, PackageInteractionResponse, ServiceCategoryEnum } from '../../types/packages/package.type';

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

  getByCategory: async (
    category: ServiceCategoryEnum,
    params?: GetPackagesParams
  ): Promise<GetPackagesResponse> => {
    const res = await apiFetch<GetPackagesResponse>(
      `/service-packages/by-category/${category}`,
      {
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 15,
          sortType: params?.sortType ?? 'desc',
          sortBy: params?.sortBy ?? 'createdAt',
          minPrice: params?.minPrice,
          maxPrice: params?.maxPrice,
        },
      }
    );
    return res;
  },

  interact: async (
    packageId: string,
    data: PackageInteractionRequest
  ): Promise<PackageInteractionResponse> => {
    const res = await apiFetch<PackageInteractionResponse>(
      `/service-packages/${packageId}/interact`,
      {
        method: 'POST',
        data,
      }
    );
    return res;
  },

  getInteractions: async (packageId: string): Promise<PackageInteractionResponse> => {
    const res = await apiFetch<PackageInteractionResponse>(
      `/service-packages/${packageId}/interactions`,
      {
        method: 'GET',
      }
    );
    return res;
  },
};
