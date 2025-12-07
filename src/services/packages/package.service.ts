import { apiFetch } from '@/services/api-client';
import {
  DeletePackageResponse,
  GetPackagesParams,
  GetPackagesResponse,
  GetReviewsResponse,
  PackageInteractionRequest,
  PackageInteractionResponse,
  PackageStatsResponse,
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
    // Clean up params - remove undefined values
    const cleanParams: any = { ...defaultParams };

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          cleanParams[key] = value;
        }
      });
    }

    const res = await apiFetch<GetPackagesResponse>('/service-packages/admin', {
      method: 'GET',
      params: cleanParams,
    });
    return res;
  },

  getByCategory: async (
    category: string,
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
    action: 'APPROVED' | 'REJECTED',
    rejectionReason?: string,
  ): Promise<ServicePackageResponse> => {
    const data: any = { action };
    if (action === 'REJECTED' && rejectionReason) {
      data.rejectionReason = rejectionReason;
    }

    const res = await apiFetch<ServicePackageResponse>(`/service-packages/${packageId}/confirm`, {
      method: 'PUT',
      data,
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

  // Update package status (for hiding/showing packages)
  updatePackageStatus: async (
    packageId: string,
    status: string,
    packageData: {
      packageTitle: string;
      packageContent: string;
      price: number;
      durationMinutes: number;
      categoryIds: string[];
      imageUrl?: string;
    },
  ): Promise<ServicePackageResponse> => {
    const formData = new FormData();
    formData.append('packageTitle', packageData.packageTitle);
    formData.append('packageContent', packageData.packageContent);
    formData.append('price', packageData.price.toString());
    formData.append('durationMinutes', packageData.durationMinutes.toString());
    formData.append('status', status);

    // Add categoryIds
    if (packageData.categoryIds && packageData.categoryIds.length > 0) {
      packageData.categoryIds.forEach((id) => formData.append('categoryIds', id));
    }

    // Keep existing image URL if no new image
    if (packageData.imageUrl) {
      formData.append('imageUrl', packageData.imageUrl);
    }

    const res = await apiFetch<ServicePackageResponse>(`/service-packages?id=${packageId}`, {
      method: 'PUT',
      data: formData,
    });
    return res;
  },

  // Update package content
  updatePackage: async (
    packageId: string,
    data: {
      packageTitle?: string;
      packageContent?: string;
      price?: number;
      durationMinutes?: number;
      categoryIds?: string[];
      status?: string;
      image?: File;
    },
  ): Promise<ServicePackageResponse> => {
    const formData = new FormData();

    if (data.packageTitle) formData.append('packageTitle', data.packageTitle);
    if (data.packageContent) formData.append('packageContent', data.packageContent);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.durationMinutes !== undefined)
      formData.append('durationMinutes', data.durationMinutes.toString());
    if (data.status) formData.append('status', data.status);
    if (data.image) formData.append('image', data.image);
    if (data.categoryIds && data.categoryIds.length > 0) {
      data.categoryIds.forEach((id) => formData.append('categoryIds', id));
    }

    const res = await apiFetch<ServicePackageResponse>(`/service-packages?id=${packageId}`, {
      method: 'PUT',
      data: formData,
    });
    return res;
  },
};
