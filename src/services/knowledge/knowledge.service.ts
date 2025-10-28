import { apiFetch } from '@/services/api';
import {
  PagedResponse,
  KnowledgeCategory,
  SortType,
} from './knowledge.type';

interface GetCategoriesParams {
  page?: number;
  limit?: number;
  sortType?: SortType;
  sortBy?: string;
}

export const KnowledgeService = {
  // 🧠 Lấy danh mục tri thức
  getCategories: async (
    params: GetCategoriesParams = { page: 1, limit: 15, sortType: 'asc', sortBy: 'name' }
  ): Promise<PagedResponse<KnowledgeCategory>> => {
    const query = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 15),
      sortType: params.sortType ?? 'asc',
      sortBy: params.sortBy ?? 'name',
    });

    return await apiFetch<PagedResponse<KnowledgeCategory>>(
      `/knowledge-categories?${query.toString()}`
    );
  },
};
