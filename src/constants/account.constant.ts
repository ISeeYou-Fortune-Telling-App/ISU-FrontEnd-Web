import { Role, Status } from '../types/account/account.type';

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Quản trị viên',
  CUSTOMER: 'Khách hàng',
  SEER: 'Nhà tiên tri',
  UNVERIFIED_SEER: 'Nhà tiên tri (chưa xác minh)',
  GUEST: 'Khách vãng lai',
};

export const STATUS_LABELS: Record<Status, string> = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Ngừng hoạt động',
  VERIFIED: 'Đã duyệt',
  UNVERIFIED: 'Chờ duyệt',
  BLOCKED: 'Đã khóa',
};
