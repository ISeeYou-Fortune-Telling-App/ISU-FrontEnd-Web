import { Paging, PagingParams } from '../paging.type';

export interface SeerInfo {
  id: string;
  fullName: string;
  avatarUrl: string;
  avgRating: number;
  totalRates: number;
}

export interface ServicePackage {
  id: string;
  seer: SeerInfo;
  packageTitle: string;
  packageContent: string;
  imageUrl: string;
  durationMinutes: number;
  price: number;
  category?: string | null;
  status: string;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetPackagesResponse {
  statusCode: number;
  message: string;
  data: ServicePackage[];
  paging: Paging;
}

export interface GetPackagesParams extends PagingParams {
  minPrice: number;
  maxPrice: number;
}
