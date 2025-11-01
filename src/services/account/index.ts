import { AccountService } from './account.service';

export const {
  getAccounts,
  getCurrentUser,
  searchAccounts,
  getAccountById,
  getAccountStats,
  updateProfile,
  updateUserRole,
  updateUserStatus,
  uploadAvatar,
  uploadCover,
  deleteAccount,
} = AccountService;

export { AccountService };
