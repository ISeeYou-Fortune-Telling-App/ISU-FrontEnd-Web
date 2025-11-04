import { ServiceCategoryEnum, PackageStatusEnum } from '@/types/packages/package.type';

// Map category từ backend sang display text
export const getCategoryDisplay = (category?: ServiceCategoryEnum | null): string => {
  if (!category) return '—';
  
  const categoryMap: Record<ServiceCategoryEnum, string> = {
    [ServiceCategoryEnum.TAROT]: 'Tarot',
    [ServiceCategoryEnum.PALM_READING]: 'Xem chỉ tay',
    [ServiceCategoryEnum.CONSULTATION]: 'Tư vấn',
    [ServiceCategoryEnum.PHYSIOGNOMY]: 'Xem tướng',
  };
  
  return categoryMap[category] || category;
};

// Map category sang color class
export const getCategoryColorClass = (category?: ServiceCategoryEnum | null): string => {
  if (!category) return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700';
  
  const colorMap: Record<ServiceCategoryEnum, string> = {
    [ServiceCategoryEnum.TAROT]: 'text-[#CA8A04] bg-[#FEF9C3]',
    [ServiceCategoryEnum.PALM_READING]: 'text-[#16A34A] bg-[#DCFCE7]',
    [ServiceCategoryEnum.CONSULTATION]: 'text-[#7C3AED] bg-[#F3E8FF]',
    [ServiceCategoryEnum.PHYSIOGNOMY]: 'text-[#DC2626] bg-[#FEE2E2]',
  };
  
  return colorMap[category] || 'text-gray-600 bg-gray-100';
};

// Map status từ backend sang filter
export const getStatusFilterValue = (status: PackageStatusEnum): StatusFilterType => {
  if (status === PackageStatusEnum.CLOSED) return 'DISABLED';
  if (status === PackageStatusEnum.HAVE_REPORT) return 'DISABLED'; 
  return status as StatusFilterType;
};

export type StatusFilterType = 'Tất cả' | 'AVAILABLE' | 'DISABLED' | 'HIDDEN';