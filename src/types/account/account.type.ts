import { SingleResponse, ListResponse, SimpleResponse } from '../response.type';
import { PagingParams } from '../paging.type';

export type Role = 'GUEST' | 'CUSTOMER' | 'SEER' | 'UNVERIFIED_SEER' | 'ADMIN';

export type Status = 'ACTIVE' | 'INACTIVE' | 'VERIFIED' | 'UNVERIFIED' | 'BLOCKED';

export interface UserDetailProfile {
  zodiacSign?: string;
  chineseZodiac?: string;
  fiveElements?: string;
}

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
  profile: UserDetailProfile;
}

export interface UpdateProfileRequest {
  email?: string;
  phone?: string;
  gender?: string;
  fullName?: string;
  birthDate?: string;
  profileDescription?: string;
}

export interface AccountStats {
  totalAccounts: number;
  customerAccounts: number;
  seerAccounts: number;
  adminAccounts: number;
  pendingAccounts: number;
  blockedAccounts: number;
}

export type GetStatsResponse = SingleResponse<AccountStats>;
export type GetAccountByIdResponse = SingleResponse<UserAccount>;
export type GetAccountsResponse = ListResponse<UserAccount>;

export type UploadAvatarResponse = SingleResponse<Record<string, never>> | SimpleResponse;
export type UploadCoverResponse = SingleResponse<Record<string, never>> | SimpleResponse;

export interface GetAccountsParams extends PagingParams {
  role?: Role;
  status?: Status;
}
