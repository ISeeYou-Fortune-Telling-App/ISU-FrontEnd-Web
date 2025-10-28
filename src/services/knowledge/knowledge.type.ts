// ----------------- ENUM -----------------
export type SortType = 'asc' | 'desc';

// ----------------- CATEGORY -----------------
export interface KnowledgeCategory {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
}

export interface Paging {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PagedResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
  paging: Paging;
}

// ----------------- KNOWLEDGE -----------------
export type KnowledgeStatus =
  | 'Đã xuất bản'
  | 'Bản nháp'
  | 'Đã ẩn'
  | 'Đã lưu trữ';

export interface Knowledge {
  id: number | string;
  title: string;
  excerpt: string;
  categories: string[];
  views: number;
  status: KnowledgeStatus;
  publishedDate: string;
  updatedDate: string;
}
