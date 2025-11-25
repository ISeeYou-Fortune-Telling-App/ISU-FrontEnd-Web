import { Paging, PagingParams } from '../paging.type';

// Enums
export enum PackageStatusEnum {
  AVAILABLE = 'AVAILABLE',
  CLOSED = 'CLOSED',
  HAVE_REPORT = 'HAVE_REPORT',
  HIDDEN = 'HIDDEN',
}

// Removed - Categories are now fetched from API
// export enum ServiceCategoryEnum {
//   TAROT = 'TAROT',
//   PALM_READING = 'PALM_READING',
//   CONSULTATION = 'CONSULTATION',
//   PHYSIOGNOMY = 'PHYSIOGNOMY',
// }

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

export interface UserInfo {
  id: string;
  fullName: string;
  avatarUrl: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
}

// Report Info
export interface ReportInfo {
  id: string;
  createdAt: string;
  updatedAt: string;
  reportType: string;
  reportDescription: string;
  targetReportType: string;
  reportStatus: string;
  actionType: string;
  note: string | null;
  reporter: {
    id: string;
    username: string;
    avatarUrl: string;
  };
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
  categories: CategoryInfo[];
  status: string;
  rejectionReason: string | null;
  likeCount: number;
  dislikeCount: number;
  isLike: boolean;
  isDislike: boolean;
  avgRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  reports?: ReportInfo[];
}

// REVIEWS
export interface ServiceReview {
  reviewId: string;
  user: UserInfo;
  packageId: string;
  comment: string;
  parentReviewId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== REQUEST DTOs ====================

// PackageInteractionRequest từ backend
export interface PackageInteractionRequest {
  interactionType: InteractionTypeEnum; // Backend validate: "LIKE|DISLIKE"
}

export interface ServiceReviewRequest {
  comment: string;
  parentReviewId?: string | null; // null = top-level review, có giá trị = reply
}

export interface DeletePackageRequest {
  id: string;
}

// Admin Confirm/Reject Request
export interface AdminConfirmPackageRequest {
  status: PackageStatusEnum;
  rejectionReason?: string;
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

export interface ServicePackageResponse {
  statusCode: number;
  message: string;
  data: ServicePackage;
}

export interface DeletePackageResponse {
  statusCode: number;
  message: string;
  data: string;
}

// Reviews Responses
export interface GetReviewsResponse {
  statusCode: number;
  message: string;
  data: ServiceReview[];
  paging: Paging;
}

export interface ServiceReviewResponse {
  statusCode: number;
  message: string;
  data: ServiceReview;
}

// ==================== PARAMS ====================
export interface GetPackagesParams extends PagingParams {
  searchText?: string; // Search text for package title
  minPrice?: number;
  maxPrice?: number;
  packageCategoryIds?: string[]; // Package category IDs filter (multiple values supported)
  seerSpecialityIds?: string[]; // Seer speciality IDs filter (multiple values supported)
  minTime?: number; // Minimum duration in minutes
  maxTime?: number; // Maximum duration in minutes
  seerId?: string; // Seer Id to filter packages by a specific seer
  status?: string; // Package status filter (AVAILABLE, REJECTED, HAVE_REPORT, HIDDEN)
  onlyAvailable?: boolean; // Filter only packages available RIGHT NOW (true: only show packages that are open at current time and day of week)
}

// Dữ liệu thống kê
export interface PackageStats {
  totalPackages: number;
  reportedPackages: number;
  hiddenPackages: number;
  totalInteractions: number;
}

// Response từ stat
export interface PackageStatsResponse {
  statusCode: number;
  message: string;
  data: PackageStats;
}
