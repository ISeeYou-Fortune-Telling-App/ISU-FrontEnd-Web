'use client'
import React from 'react';
import { Clock, ShieldAlert, ShieldCheck, CircleX, ClosedCaption, Flag, CircleCheck, RefreshCcw } from 'lucide-react'; 
import { LucideIcon } from 'lucide-react';

export type BadgeType = 'status' | 'expertise' | 'role' | 'post' | 'payment';
export type BadgeStatus = 'Đã duyệt' | 'Chờ duyệt' | 'Đã khóa' | 'Đã từ chối' | 'Hoàn thành' | 'Bị hủy' | 'Đã xác nhận' | 'Chờ xác nhận' | 'Đang diễn ra' | string;
export type BadgeExpertise = 'Cung Hoàng Đạo' | 'Ngũ Hành' | 'Tarot' | 'Nhân Tướng Học' | 'Chỉ Tay' | string;
export type BadgeRole = 'Nhà tiên tri' | 'Khách hàng' | string;
export type BadgePayment = 'Đã thanh toán' | 'Đã hoàn tiền' | string;

interface CommonBadgeProps {
  type: BadgeType;
  value: BadgeStatus | BadgeExpertise | BadgeRole | BadgePayment;
}

const getStatusStyle = (status: BadgeStatus): { classes: string; Icon: LucideIcon | null } => {
  let classes = 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
  let Icon: LucideIcon | null = null;

  switch (status) {
    case 'Hoàn thành':
      classes = 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100';
      break;
    case 'Thành công':
      classes = 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100';
      Icon = CircleCheck;
      break;
    case 'Đã duyệt':
    case 'Đang hoạt động':
      classes = 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100';
      Icon = ShieldCheck;
      break;
    case 'Chờ xác nhận':
      classes = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100';
      break;
    case 'Chờ duyệt':
      case '2 báo cáo':
      classes = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100';
      Icon = Flag;
      break;
    case '2 báo cáo':
      classes = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100';
      Icon = Clock;
      break;
    case 'Đã xác nhận':
      classes = 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      break;
    case 'Đã khóa':
      classes = 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100';
      Icon = ShieldAlert;
      break;
    case 'Bị hủy':
      classes = 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100';
      break;
    case 'Đã từ chối':
    case 'Đã ẩn':
    case 'Thất bại':
      classes = 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100';
      Icon = CircleX;
      break;
    case 'Đang diễn ra':
      classes = 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100';
      break;
    case 'Ngưng hoạt động':
      classes = 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
      Icon = ClosedCaption;
      break;
    case 'Đã hoàn tiền':
      classes = 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100';
      Icon = RefreshCcw;
      break;
    default:
      classes = 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
      Icon = null;
  }
  return { classes, Icon };
};

const getPaymentStyle = (paymentStatus: BadgePayment): { classes: string } => {
  let classes = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100';

  switch (paymentStatus) {
    case 'Đã thanh toán':
      classes = 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100';
      break;
    case 'Đã hoàn tiền':
      classes = 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100';
      break;
    default:
      classes = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100';
  }
  return { classes };
};

const getExpertiseStyle = (expertise: BadgeExpertise): string => {
  switch (expertise) {
    case 'Cung Hoàng Đạo':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'Tarot':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Ngũ Hành':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Nhân Tướng Học':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Chỉ Tay':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getRoleStyle = (role: BadgeRole): string => {
  switch (role) {
    case 'Nhà tiên tri':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100';
    case 'Khách hàng':
      return 'bg-gray-600 text-white border-white dark:bg-gray-300 dark:text-gray-900 dark:border-gray-700';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
  }
};

export const Badge: React.FC<CommonBadgeProps> = ({ type, value }) => {
  let classes = 'px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap ';
  let Icon: LucideIcon | null = null;
  let displayValue = value;
  let hasIcon = true;

  if (type === 'status') {
    const style = getStatusStyle(value as BadgeStatus);
    classes += ' inline-flex items-center space-x-1 ' + style.classes;
    Icon = style.Icon;
  } else if (type === 'payment') {
    const style = getPaymentStyle(value as BadgePayment);
    classes += ' inline-flex items-center space-x-1 ' + style.classes;
  } else if (type === 'expertise') {
    classes += ' inline-block ' + getExpertiseStyle(value as BadgeExpertise);
    hasIcon = false;
  } else if (type === 'role') {
    classes += ' inline-block ' + getRoleStyle(value as BadgeRole);
    hasIcon = false;
  } else {
    classes += ' inline-block bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
    hasIcon = false;
  }

  if (!hasIcon) {
    classes = classes.replace('inline-flex items-center space-x-1', 'inline-block');
  }

  const finalClasses = `border border-current ${classes}`.trim();

  return (
    <span className={finalClasses}>
      {Icon && <Icon className="w-3 h-3" />}
      <span>{displayValue}</span>
    </span>
  );
};
