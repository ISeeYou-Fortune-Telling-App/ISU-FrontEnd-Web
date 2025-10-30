import { SingleResponse, ListResponse } from '@/types/response.type';
import { PagingParams } from '@/types/paging.type';

export type KnowledgeStatus = 'DRAFT' | 'PUBLISH' | 'HIDDEN';

export interface KnowledgeCategory {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
}

export interface KnowledgeItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  categories: string[];
  status: KnowledgeStatus;
  imageUrl: string;
  viewCount: number;
}

export type KnowledgeCategoriesResponse = ListResponse<KnowledgeCategory>;
export type KnowledgeItemResponse = SingleResponse<KnowledgeItem>;
export type KnowledgeItemListResponse = ListResponse<KnowledgeItem>;

export interface KnowledgeItemSearchParams extends PagingParams {
  title?: string;
  categoryIds?: string[];
  status?: KnowledgeStatus;
}
