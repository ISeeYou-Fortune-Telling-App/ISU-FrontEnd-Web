import { apiFetch } from '@/services/api';
import {
  KnowledgeCategoriesResponse,
  KnowledgeItemResponse,
  KnowledgeItemListResponse,
  KnowledgeItemSearchParams,
} from '../../types/knowledge/knowledge.type';
import { PagingParams } from '@/types/paging.type';

export const KnowledgeService = {
  getCategories: async (params: PagingParams): Promise<KnowledgeCategoriesResponse> => {
    return await apiFetch<KnowledgeCategoriesResponse>('/knowledge-categories', {
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

  getKnowledges: async (params: PagingParams): Promise<KnowledgeItemListResponse> => {
    return await apiFetch<KnowledgeItemListResponse>('/knowledge-items', {
      method: 'GET',
      params: {
        ...params,
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        sortType: params.sortType ?? 'desc',
        sortBy: params.sortBy ?? 'createdAt',
      },
    });
  },

  getKnowledgeById: async (id: string): Promise<KnowledgeItemResponse> => {
    return await apiFetch<KnowledgeItemResponse>(`/knowledge-items/${id}`, {
      method: 'GET',
    });
  },

  searchKnowledgeItem: async (
    params: KnowledgeItemSearchParams,
  ): Promise<KnowledgeItemListResponse> => {
    return await apiFetch<KnowledgeItemListResponse>('/knowledge-items/search', {
      method: 'GET',
      params: {
        title: params.title ?? '',
        categoryIds: params.categoryIds ?? '',
        status: params.status ?? '',
        page: params.page ?? 1,
        limit: params.limit ?? 15,
        sortType: params.sortType ?? 'asc',
        sortBy: params.sortBy ?? 'createdAt',
      },
    });
  },
};
