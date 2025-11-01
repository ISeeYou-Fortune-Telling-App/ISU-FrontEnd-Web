import { ListResponse, SimpleResponse, SingleResponse } from '../response.type';
import { PagingParams } from '../paging.type';

export type KnowledgeStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export interface KnowledgeCategory {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
}

export type KnowledgeCategoryName = KnowledgeCategory['name'];

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

export interface KnowledgeItemSearchParams extends PagingParams {
  title?: string;
  categoryIds?: string[];
  status?: KnowledgeStatus;
}

export type GetKnowledgeCategoriesResponse = ListResponse<KnowledgeCategory> | SimpleResponse;
export type GetKnowledgeItemListResponse = ListResponse<KnowledgeItem> | SimpleResponse;
export type GetKnowledgeItemResponse = SingleResponse<KnowledgeItem> | SimpleResponse;
export type UpdateKnowledgeItemResponse = SingleResponse<KnowledgeItem> | SimpleResponse;
export type UpdateKnowledgeCategoryResponse = SingleResponse<KnowledgeCategory> | SimpleResponse;
export type DeleteKnowledgeResponse = SingleResponse<Record<string, never>> | SimpleResponse;
