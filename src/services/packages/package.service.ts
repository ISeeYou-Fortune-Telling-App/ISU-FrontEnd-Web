import { apiFetch } from '@/services/api';
import {
  DeletePackageResponse,
  GetPackagesParams,
  GetPackagesResponse,
  GetReviewsResponse,
  PackageInteractionRequest,
  PackageInteractionResponse,
  PackageStatsResponse,
  ServiceCategoryEnum,
  ServicePackageResponse,
  ServiceReviewRequest,
  ServiceReviewResponse,
} from '../../types/packages/package.type';
import { PagingParams } from '@/types/paging.type';

const defaultParams = {
  page: 1,
  limit: 10,
  sortType: 'desc',
  sortBy: 'createdAt',
};

export const PackageService = {
  getAll: async (params?: GetPackagesParams): Promise<GetPackagesResponse> => {
    const res = await apiFetch<GetPackagesResponse>('/service-packages/admin', {
      method: 'GET',
      params: {
        ...defaultParams,
        ...params,
      },
    });
    return res;
  },

  getByCategory: async (
    category: ServiceCategoryEnum,
    params?: GetPackagesParams,
  ): Promise<GetPackagesResponse> => {
    const res = await apiFetch<GetPackagesResponse>(`/service-packages/by-category/${category}`, {
      method: 'GET',
      params: {
        ...defaultParams,
        ...params,
      },
    });
    return res;
  },

  delete: async (packageId: string): Promise<DeletePackageResponse> => {
    const res = await apiFetch<DeletePackageResponse>(`/service-packages/${packageId}`, {
      method: 'DELETE',
    });
    return res;
  },

  adminConfirm: async (
    packageId: string,
    status: string,
    rejectionReason?: string,
  ): Promise<ServicePackageResponse> => {
    const res = await apiFetch<ServicePackageResponse>(`/service-packages/${packageId}/confirm`, {
      method: 'PUT',
      data: {
        status,
        rejectionReason,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res;
  },

  // ==================== INTERACTIONS ====================
  interact: async (
    packageId: string,
    data: PackageInteractionRequest,
  ): Promise<PackageInteractionResponse> => {
    const res = await apiFetch<PackageInteractionResponse>(
      `/service-packages/${packageId}/interact`,
      {
        method: 'POST',
        data,
      },
    );
    return res;
  },

  getInteractions: async (packageId: string): Promise<PackageInteractionResponse> => {
    const res = await apiFetch<PackageInteractionResponse>(
      `/service-packages/${packageId}/interactions`,
      {
        method: 'GET',
      },
    );
    return res;
  },

  // ==================== REVIEWS ====================
  getReviews: async (packageId: string, params?: PagingParams): Promise<GetReviewsResponse> => {
    const res = await apiFetch<GetReviewsResponse>(`/service-packages/${packageId}/reviews`, {
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

  getReviewById: async (reviewId: string): Promise<ServiceReviewResponse> => {
    const res = await apiFetch<ServiceReviewResponse>(`/service-packages/reviews/${reviewId}`, {
      method: 'GET',
    });
    return res;
  },

  getReviewReplies: async (
    reviewId: string,
    params?: PagingParams,
  ): Promise<GetReviewsResponse> => {
    const res = await apiFetch<GetReviewsResponse>(
      `/service-packages/reviews/${reviewId}/replies`,
      {
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          sortType: params?.sortType ?? 'asc',
          sortBy: params?.sortBy ?? 'createdAt',
        },
      },
    );
    return res;
  },

  getStats: async (): Promise<PackageStatsResponse> => {
    const res = await apiFetch<PackageStatsResponse>('/service-packages/stat', {
      method: 'GET',
    });
    return res;
  },

  createReview: async (
    packageId: string,
    data: ServiceReviewRequest,
  ): Promise<ServiceReviewResponse> => {
    const res = await apiFetch<ServiceReviewResponse>(`/service-packages/${packageId}/reviews`, {
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res;
  },

  updateReview: async (
    reviewId: string,
    data: ServiceReviewRequest,
  ): Promise<ServiceReviewResponse> => {
    const res = await apiFetch<ServiceReviewResponse>(`/service-packages/reviews/${reviewId}`, {
      method: 'PUT',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res;
  },

  deleteReview: async (reviewId: string): Promise<ServiceReviewResponse> => {
    const res = await apiFetch<ServiceReviewResponse>(`/service-packages/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    return res;
  },
};


