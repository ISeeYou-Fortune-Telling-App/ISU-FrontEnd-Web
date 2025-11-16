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

export interface KnowledgeItemStats {
  publishedItems: number;
  draftItems: number;
  hiddenItems: number;
  totalViewCount: number;
}

export interface KnowledgeItemSearchParams extends PagingParams {
  title?: string;
  categoryIds?: string[];
  status?: KnowledgeStatus;
}

export interface CreateKnowledgeItemRequest {
  title: string;
  content: string;
  source?: string;
  categoryIds?: string[];
  status: KnowledgeStatus;
  imageFile?: File;
}

export interface UpdateKnowledgeItemRequest {
  id?: string;
  title?: string;
  content?: string;
  source?: string;
  categoryIds?: string[];
  status?: KnowledgeStatus;
  imageFile?: File;
}

export type GetKnowledgeCategoriesResponse = ListResponse<KnowledgeCategory> | SimpleResponse;
export type GetKnowledgeCategoryResponse = SingleResponse<KnowledgeCategory> | SimpleResponse;
export type CreateKnowledgeCategoryResponse = SingleResponse<KnowledgeCategory> | SimpleResponse;
export type UpdateKnowledgeCategoryResponse = SingleResponse<KnowledgeCategory> | SimpleResponse;
export type DeleteKnowledgeCategoryResponse = SimpleResponse;

export type GetKnowledgeItemListResponse = ListResponse<KnowledgeItem> | SimpleResponse;
export type GetKnowledgeItemResponse = SingleResponse<KnowledgeItem> | SimpleResponse;
export type GetKnowledgeItemStatsResponse = SingleResponse<KnowledgeItemStats> | SimpleResponse;
export type CreateKnowledgeItemResponse = SingleResponse<KnowledgeItem> | SimpleResponse;
export type UpdateKnowledgeItemResponse = SingleResponse<KnowledgeItem> | SimpleResponse;
export type DeleteKnowledgeItemResponse = SimpleResponse;
export type IncrementViewCountResponse = SimpleResponse;
