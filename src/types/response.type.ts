import { Paging } from './paging.type';

export interface SimpleResponse {
  statusCode: number;
  message: string;
}

export interface ValidationErrorResponse extends SimpleResponse {
  items?: Record<string, string>;
}

export interface SingleResponse<T> {
  items: any;
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

export const isSingleResponse = <T>(
  response: SingleResponse<T> | SimpleResponse,
): response is SingleResponse<T> => {
  return (response as SingleResponse<T>).data !== undefined;
};

export const isListResponse = <T>(
  response: ListResponse<T> | SimpleResponse,
): response is ListResponse<T> => {
  return (
    (response as ListResponse<T>).data !== undefined &&
    Array.isArray((response as ListResponse<T>).data)
  );
};

export const isSimpleResponse = (
  response: SimpleResponse | ValidationErrorResponse,
): response is SimpleResponse => {
  return (response as ValidationErrorResponse).items === undefined;
};
