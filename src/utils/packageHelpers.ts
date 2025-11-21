import { PackageStatusEnum } from '@/types/packages/package.type';

// Categories are now fetched from API, these helpers are deprecated
// Use Badge component with type="expertise" instead

// Map status từ backend sang filter
export const getStatusFilterValue = (status: PackageStatusEnum): StatusFilterType => {
  if (status === PackageStatusEnum.CLOSED) return 'DISABLED';
  if (status === PackageStatusEnum.HAVE_REPORT) return 'DISABLED';
  return status as StatusFilterType;
};

export type StatusFilterType =
  | 'Tất cả'
  | 'AVAILABLE'
  | 'DISABLED'
  | 'HIDDEN'
  | 'REJECTED'
  | 'HAVE_REPORT';
