import { Role, Status } from '../types/account/account.type';

export const ROLE_LABELS: Partial<Record<Role, string>> = {
  ADMIN: 'Quản trị viên',
  CUSTOMER: 'Khách hàng',
  SEER: 'Nhà tiên tri',
  UNVERIFIED_SEER: 'Nhà tiên tri (chưa xác minh)',
};

export const STATUS_LABELS: Record<Status, string> = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Ngừng hoạt động',
  VERIFIED: 'Đã duyệt',
  UNVERIFIED: 'Chờ duyệt',
  BLOCKED: 'Đã khóa',
};

export const CHINESE_ZODIAC_ICONS: Record<string, string> = {
  Tý: '🐀',
  Sửu: '🐂',
  Dần: '🐅',
  Mão: '🐇',
  Thìn: '🐉',
  Tỵ: '🐍',
  Ngọ: '🐎',
  Mùi: '🐐',
  Thân: '🐒',
  Dậu: '🐓',
  Tuất: '🐕',
  Hợi: '🐖',
};

export const WESTERN_ZODIAC_ICONS: Record<string, string> = {
  'Bạch Dương': '♈',
  'Kim Ngưu': '♉',
  'Song Tử': '♊',
  'Cự Giải': '♋',
  'Sư Tử': '♌',
  'Xử Nữ': '♍',
  'Thiên Bình': '♎',
  'Bọ Cạp': '♏',
  'Nhân Mã': '♐',
  'Ma Kết': '♑',
  'Bảo Bình': '♒',
  'Song Ngư': '♓',
};
