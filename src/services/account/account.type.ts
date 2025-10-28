export type Role =
  | 'GUEST'
  | 'CUSTOMER'
  | 'SEER'
  | 'UNVERIFIED_SEER'
  | 'ADMIN';

export type Status =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'VERIFIED'
  | 'UNVERIFIED'
  | 'BLOCKED';

/**
 * Hồ sơ tổng quan của người dùng.
 * Backend hiện tại trả: zodiacSign, chineseZodiac, fiveElements
 * Trong tương lai có thể thêm: totalBookings, totalRevenue, avgRating...
 */
export interface OverallUserProfile {
  zodiacSign?: string;        // Cung Hoàng Đạo
  chineseZodiac?: string;     // Con Giáp
  fiveElements?: string;      // Ngũ Hành
  avgRating?: number;         // (tùy chọn, cho SEER)
  totalRates?: number;        // (tùy chọn)
  paymentInfo?: string;       // (tùy chọn)
  totalBookings?: number;     // (tùy chọn)
  completedBookings?: number; // (tùy chọn)
  totalRevenue?: number;      // (tùy chọn)
}

/**
 * Thông tin tài khoản người dùng
 */
export interface UserAccount {
  id: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
  email: string;
  phone: string;
  gender: string;
  fullName: string;
  avatarUrl: string;
  coverUrl: string;
  profileDescription: string;
  birthDate: string;
  status: Status;
  profile: OverallUserProfile;
}

export interface UpdateProfileRequest {
  email?: string;
  phone?: string;
  gender?: string;
  fullName?: string;
  birthDate?: string; // ISO format string
  profileDescription?: string;
}

/**
 * Thông tin phân trang
 */
export interface Paging {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Tham số truy vấn danh sách tài khoản
 */
export interface GetAccountsParams {
  role?: Role;
  status?: Status;
  page?: number;
  limit?: number;
  sortType?: 'asc' | 'desc'; // Cho phép cả asc/desc
  sortBy?: string;           // Linh hoạt hơn (vd: email, createdAt)
  keyword?: string;          // Cho phép tìm kiếm theo từ khóa
}

/**
 * Phản hồi danh sách tài khoản
 */
export interface GetAccountsResponse {
  statusCode: number;
  message: string;
  data: UserAccount[];
  paging: Paging;
}

/**
 * Phản hồi chi tiết tài khoản
 */
export interface GetAccountByIdResponse {
  statusCode: number;
  message: string;
  data: UserAccount;
}

/**
 * Thống kê tài khoản
 */
export interface AccountStats {
  totalAccounts: number;
  customerAccounts: number;
  seerAccounts: number;
  adminAccounts: number;
  pendingAccounts: number;
  blockedAccounts: number;
}

/**
 * Phản hồi thống kê tài khoản
 */
export interface GetStatsResponse {
  statusCode: number;
  message: string;
  data: AccountStats;
}
