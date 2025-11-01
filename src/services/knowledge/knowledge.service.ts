import { apiFetch } from '@/services/api';
import { PagingParams } from '@/types/paging.type';

import {
  ListResponse,
  isSingleResponse,
  isListResponse,
  isSimpleResponse,
} from '@/types/response.type';

import {
  GetKnowledgeCategoriesResponse,
  GetKnowledgeItemResponse,
  GetKnowledgeItemListResponse,
  KnowledgeItemSearchParams,
  KnowledgeCategory,
  KnowledgeItem,
} from '../../types/knowledge/knowledge.type';

type ListKnowledgeCategoryResponse = ListResponse<KnowledgeCategory>;
type ListKnowledgeItemResponse = ListResponse<KnowledgeItem>;
type SingleKnowledgeItemResponse = KnowledgeItem;

export const KnowledgeService = {
  getCategories: async (params: PagingParams): Promise<ListKnowledgeCategoryResponse> => {
    const response = await apiFetch<GetKnowledgeCategoriesResponse>('/knowledge-categories', {
      method: 'GET',
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 15,
        sortType: params.sortType ?? 'asc',
        sortBy: params.sortBy ?? 'createdAt',
      },
    });

    if (isListResponse<KnowledgeCategory>(response)) {
      return response;
    }

    if (isSimpleResponse(response)) {
      throw new Error(response.message || 'Lỗi khi tải danh mục tri thức.');
    }

    throw new Error('Định dạng phản hồi danh mục tri thức không hợp lệ.');
  },

  getKnowledges: async (params: PagingParams): Promise<ListKnowledgeItemResponse> => {
    const response = await apiFetch<GetKnowledgeItemListResponse>('/knowledge-items', {
      method: 'GET',
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        sortType: params.sortType ?? 'desc',
        sortBy: params.sortBy ?? 'createdAt',
      },
    });

    if (isListResponse<KnowledgeItem>(response)) {
      return response;
    }

    if (isSimpleResponse(response)) {
      throw new Error(response.message || 'Lỗi khi tải danh sách tri thức.');
    }

    throw new Error('Định dạng phản hồi danh sách tri thức không hợp lệ.');
  },

  getKnowledgeById: async (id: string): Promise<SingleKnowledgeItemResponse> => {
    const response = await apiFetch<GetKnowledgeItemResponse>(`/knowledge-items/${id}`, {
      method: 'GET',
    });

    if (isSingleResponse<KnowledgeItem>(response)) {
      return response.data;
    }

    if (isSimpleResponse(response) && response.message) {
      throw new Error(response.message);
    }

    throw new Error('Không nhận được dữ liệu tri thức chi tiết hợp lệ.');
  },

  searchKnowledgeItem: async (
    params: KnowledgeItemSearchParams,
  ): Promise<ListKnowledgeItemResponse> => {
    const query: Record<string, any> = {
      page: params.page ?? 1,
      limit: params.limit ?? 15,
      sortType: params.sortType ?? 'desc',
      sortBy: params.sortBy ?? 'createdAt',
    };

    if (params.title) query.title = params.title;
    if (params.categoryIds?.length) query.categoryIds = params.categoryIds;
    if (params.status) query.status = params.status;

    const response = await apiFetch<GetKnowledgeItemListResponse>('/knowledge-items/search', {
      method: 'GET',
      params: query,
    });

    if (isListResponse<KnowledgeItem>(response)) {
      return response;
    }

    if (isSimpleResponse(response)) {
      throw new Error(response.message || 'Lỗi khi tìm kiếm tri thức.');
    }

    throw new Error('Định dạng phản hồi tìm kiếm tri thức không hợp lệ.');
  },
};
