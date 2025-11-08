import { apiFetch } from '@/services/api';
import { ListResponse, SingleResponse } from '@/types/response.type';
import {
  KnowledgeCategory,
  KnowledgeItem,
  KnowledgeItemSearchParams,
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

  // Lấy chi tiết tri thức
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
};
