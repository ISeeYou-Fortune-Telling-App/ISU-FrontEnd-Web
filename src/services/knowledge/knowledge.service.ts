/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiFetch } from '@/services/api-client';
import { ListResponse, SimpleResponse, SingleResponse } from '@/types/response.type';
import {
  KnowledgeCategory,
  KnowledgeItem,
  KnowledgeItemSearchParams,
  KnowledgeItemStats,
  KnowledgeStatus,
  CreateKnowledgeItemRequest,
  UpdateKnowledgeItemRequest,
} from '@/types/knowledge/knowledge.type';
import { PagingParams } from '@/types/paging.type';

export const KnowledgeService = {
  // Lấy danh mục tri thức
  getCategories: (params: PagingParams) =>
    apiFetch<ListResponse<KnowledgeCategory>>('/knowledge-categories', {
      method: 'GET',
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        sortType: params.sortType ?? 'asc',
        sortBy: params.sortBy ?? 'createdAt',
      },
    }),

  // Lấy danh sách tri thức
  getKnowledges: (params: PagingParams) =>
    apiFetch<ListResponse<KnowledgeItem>>('/knowledge-items', {
      method: 'GET',
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        sortType: params.sortType ?? 'desc',
        sortBy: params.sortBy ?? 'createdAt',
      },
    }),

  // Lấy thống kê tri thức
  getKnowledgeStats: async (): Promise<KnowledgeItemStats> => {
    const res = await apiFetch<SingleResponse<KnowledgeItemStats>>('/knowledge-items/stat', {
      method: 'GET',
    });
    return res.data;
  },

  // Lấy chi tiết tri thức
  getKnowledgeItem: async (id: string): Promise<KnowledgeItem> => {
    const res = await apiFetch<SingleResponse<KnowledgeItem>>(`/knowledge-items/${id}`, {
      method: 'GET',
    });
    return res.data;
  },

  // Alias for backward compatibility
  getKnowledgeById: async (id: string): Promise<KnowledgeItem> => {
    const res = await apiFetch<SingleResponse<KnowledgeItem>>(`/knowledge-items/${id}`, {
      method: 'GET',
    });
    return res.data;
  },

  // Tìm kiếm tri thức
  searchKnowledgeItem: (params: KnowledgeItemSearchParams) => {
    const query: Record<string, any> = {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      sortType: params.sortType ?? 'desc',
      sortBy: params.sortBy ?? 'createdAt',
    };

    if (params.title) query.title = params.title;
    if (params.categoryIds?.length) query.categoryIds = params.categoryIds;
    if (params.status) query.status = params.status;

    return apiFetch<ListResponse<KnowledgeItem>>('/knowledge-items/search', {
      method: 'GET',
      params: query,
    });
  },

  // Lấy tri thức theo trạng thái
  getKnowledgesByStatus: (status: KnowledgeStatus, params: PagingParams) =>
    apiFetch<ListResponse<KnowledgeItem>>(`/knowledge-items/by-status/${status}`, {
      method: 'GET',
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        sortType: params.sortType ?? 'desc',
        sortBy: params.sortBy ?? 'createdAt',
      },
    }),

  // Lấy danh mục theo tên
  getCategoryByName: async (name: string): Promise<KnowledgeCategory> => {
    const res = await apiFetch<SingleResponse<KnowledgeCategory>>('/knowledge-categories/by-name', {
      method: 'GET',
      params: { name },
    });
    return res.data;
  },

  // Tạo danh mục mới (Admin only)
  createCategory: async (data: CreateKnowledgeItemRequest): Promise<KnowledgeCategory> => {
    const res = await apiFetch<SingleResponse<KnowledgeCategory>>('/knowledge-categories', {
      method: 'POST',
      data: JSON.stringify(data),
    });
    return res.data;
  },

  // Cập nhật danh mục (Admin only)
  updateCategory: async (
    id: string,
    data: UpdateKnowledgeItemRequest,
  ): Promise<KnowledgeCategory> => {
    const res = await apiFetch<SingleResponse<KnowledgeCategory>>(`/knowledge-categories/${id}`, {
      method: 'PATCH',
      data: JSON.stringify(data),
    });
    return res.data;
  },

  // Xóa danh mục (Admin only)
  deleteCategory: async (id: string): Promise<void> => {
    await apiFetch<SimpleResponse>(`/knowledge-categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Xóa tri thức (Admin only)
  deleteKnowledgeItem: async (id: string): Promise<void> => {
    await apiFetch<SimpleResponse>(`/knowledge-items/${id}`, {
      method: 'DELETE',
    });
  },

  // Cập nhật tri thức (Admin only)
  updateKnowledgeItem: async (id: string, data: FormData): Promise<KnowledgeItem> => {
    const res = await apiFetch<SingleResponse<KnowledgeItem>>(`/knowledge-items/${id}`, {
      method: 'PATCH',
      data,
      headers: {
        // Let browser set Content-Type for FormData
      },
    });
    return res.data;
  },

  // Tạo tri thức mới (Admin only)
  createKnowledgeItem: async (data: FormData): Promise<KnowledgeItem> => {
    const res = await apiFetch<SingleResponse<KnowledgeItem>>('/knowledge-items', {
      method: 'POST',
      data,
      headers: {
        // Let browser set Content-Type for FormData
      },
    });
    return res.data;
  },
};
