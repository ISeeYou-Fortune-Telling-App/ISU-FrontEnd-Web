import { Paging, PagingParams } from '../paging.type';

// Enums
export enum PackageStatusEnum {
  AVAILABLE = 'AVAILABLE',
  CLOSED = 'CLOSED',
  HAVE_REPORT = 'HAVE_REPORT',
  HIDDEN = 'HIDDEN',
}

export enum ServiceCategoryEnum {
  TAROT = 'TAROT',
  PALM_READING = 'PALM_READING',
  CONSULTATION = 'CONSULTATION',
  PHYSIOGNOMY = 'PHYSIOGNOMY',
}

export enum InteractionTypeEnum {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

// Seer Info
export interface SeerInfo {
  id: string;
  fullName: string;
  avatarUrl: string;
  avgRating: number;
  totalRates: number;
}

// Service Package
export interface ServicePackage {
  id: string;
  seer: SeerInfo;
  packageTitle: string;
  packageContent: string;
  imageUrl: string;
  durationMinutes: number;
  price: number;
  category?: ServiceCategoryEnum | null;
  status: string;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== REQUEST DTOs ====================

// PackageInteractionRequest từ backend
export interface PackageInteractionRequest {
  interactionType: InteractionTypeEnum  // Backend validate: "LIKE|DISLIKE"
}

// ==================== RESPONSE DTOs ====================

// Response DTOs
export interface GetPackagesResponse {
  statusCode: number;
  message: string;
  data: ServicePackage[];
  paging: Paging;
}

export interface PackageInteractionResponse {
  statusCode: number;
  message: string;
  data: ServicePackage;
}

export interface GetPackagesParams extends PagingParams {
  minPrice: number;
  maxPrice: number;
  category?: ServiceCategoryEnum;
  status?: PackageStatusEnum;
  seerId?: string;
}
