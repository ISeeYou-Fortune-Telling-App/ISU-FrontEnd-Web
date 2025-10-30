export interface Paging {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PagingParams {
  page?: number;         
  limit?: number;         
  sortBy?: string;       
  sortType?: 'asc' | 'desc';
  keyword?: string;       
}
