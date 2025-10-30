import { Paging } from './paging.type';

export interface SimpleResponse {
  statusCode: number;
  message: string;
}

export interface ValidationErrorResponse extends SimpleResponse {
  items?: Record<string, string>;
}

export interface SingleResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface ListResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
  paging?: Paging;
}
