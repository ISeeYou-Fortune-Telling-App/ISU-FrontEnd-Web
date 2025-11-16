'use client';

import React from 'react';
import {
  Clock,
  ShieldAlert,
  ShieldCheck,
  CircleX,
  RefreshCcw,
  UserCog,
  User,
  UserCheck,
  UserMinus,
  CheckCircle2,
  Play,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type BadgeType =
  | 'status'
  | 'AccountStatus'
  | 'AccountRole'
  | 'expertise'
  | 'post'
  | 'payment';
export type BadgeAccountStatus =
  | 'Đang hoạt động'
  | 'Ngừng hoạt động'
  | 'Đã duyệt'
  | 'Chờ duyệt'
  | 'Đã khóa'
  | 'Đã hoàn tiền'
  | 'Bị hủy'
  | 'Đã xác nhận'
  | 'Chờ xác nhận'
  | 'Hoàn thành'
  | 'Đang diễn ra'
  | string;

export type BadgeAccountRole =
  | 'Nhà tiên tri'
  | 'Nhà tiên tri (chưa xác minh)'
  | 'Khách hàng'
  | 'Quản trị viên'
  | 'Khách vãng lai'
  | string;

/* 🎨 Style cho trạng thái tiếng Việt */
const getStatusStyle = (status: BadgeAccountStatus) => {
  let Icon: LucideIcon | null = null;
  let classes = 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';

  switch (status) {
    case 'Hoàn thành':
      classes = 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100';
      Icon = CheckCircle2;
      break;
    case 'Chờ xác nhận':
      classes = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100';
      Icon = Clock;
      break;
    case 'Đang diễn ra':
      classes = 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100';
      Icon = Play;
      break;
    case 'Bị hủy':
      classes = 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100';
      Icon = CircleX;
      break;
    case 'Đã xác nhận':
      classes = 'bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-100';
      Icon = ShieldCheck;
      break;
    case 'Đang hoạt động':
      classes = 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100';
      Icon = ShieldCheck;
      break;
    case 'Ngừng hoạt động':
      classes = 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      Icon = ShieldAlert;
      break;
    case 'Đã duyệt':
      classes = 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100';
      Icon = ShieldCheck;
      break;
    case 'Chờ duyệt':
      classes = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100';
      Icon = Clock;
      break;
    case 'Đã khóa':
      classes = 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100';
      Icon = ShieldAlert;
      break;
    case 'Đã hoàn tiền':
      classes = 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100';
      Icon = RefreshCcw;
      break;
    default:
      classes = 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
  }

  return { classes, Icon };
};

/* 👑 Style cho vai trò tiếng Việt */
const getRoleStyle = (role: BadgeAccountRole) => {
  let Icon: LucideIcon | null = null;
  let classes = 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';

  switch (role) {
    case 'Quản trị viên':
      classes = 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100';
      Icon = UserCog;
      break;
    case 'Nhà tiên tri':
      classes = 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100';
      Icon = UserCheck;
      break;
    case 'Nhà tiên tri (chưa xác minh)':
      classes = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100';
      Icon = Clock;
      break;
    case 'Khách hàng':
      classes = 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      Icon = User;
      break;
    case 'Khách vãng lai':
      classes = 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
      Icon = UserMinus;
      break;
    default:
      classes = 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
  }

  return { classes, Icon };
};

/* 🎯 Component chính */
export const Badge: React.FC<{ type: BadgeType; value: string }> = ({ type, value }) => {
  const base =
    'px-3 py-1 text-xs font-semibold rounded-lg inline-flex items-center space-x-1 border border-current';
  let Icon: LucideIcon | null = null;
  let classes = '';

  if (type === 'AccountStatus') {
    const style = getStatusStyle(value as BadgeAccountStatus);
    Icon = style.Icon;
    classes = style.classes;
  } else if (type === 'AccountRole') {
    const style = getRoleStyle(value as BadgeAccountRole);
    Icon = style.Icon;
    classes = style.classes;
  } else {
    classes = 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
  }

  if (type === 'status') {
    switch (value) {
      case 'COMPLETED':
        classes = 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100';
        Icon = CheckCircle2;
        value = 'Hoàn thành';
        break;
      case 'CONFIRMED':
        classes = 'bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-100';
        Icon = ShieldCheck;
        value = 'Đã xác nhận';
        break;
      case 'PENDING':
        classes = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100';
        Icon = Clock;
        value = 'Chờ xác nhận';
        break;
      case 'FAILED':
        classes = 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100';
        Icon = ShieldAlert;
        value = 'Thất bại';
        break;
      case 'CANCELLED':
        classes = 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100';
        Icon = CircleX;
        value = 'Đã hủy';
        break;
    }
  }

  if (type === 'payment') {
    switch (value) {
      case 'COMPLETED':
        classes = 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100';
        Icon = ShieldCheck;
        value = 'Đã thanh toán';
        break;
      case 'PENDING':
        classes = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100';
        Icon = Clock;
        value = 'Đang xử lý';
        break;
      case 'REFUNDED':
        classes = 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100';
        Icon = RefreshCcw;
        value = 'Đã hoàn tiền';
        break;
      case 'FAILED':
        classes = 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100';
        Icon = CircleX;
        value = 'Thanh toán thất bại';
        break;
    }
  }

  return (
    <span className={`${base} ${classes}`}>
      {Icon && <Icon className="w-3.5 h-3.5 mr-1" />}
      <span>{value}</span>
    </span>
  );
};