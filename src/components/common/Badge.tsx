'use client'
import React from 'react';
import { Check, Clock, Lock, Ban, DollarSign } from 'lucide-react'; 
import { LucideIcon } from 'lucide-react';

// Định nghĩa các loại Badge và thuộc tính
export type BadgeType = 'status' | 'expertise' | 'role' | 'payment'; // Đã thêm 'payment'
export type BadgeStatus = 'Đã duyệt' | 'Chờ duyệt' | 'Đã khóa' | 'Đã từ chối' | 'Hoàn thành' | 'Bị hủy' | string;
export type BadgeExpertise = 'Cung Hoàng Đạo' | 'Ngũ Hành' | 'Tarot' | 'Nhân Tướng Học' | 'Chỉ Tay' | string;
export type BadgeRole = 'Nhà tiên tri' | 'Khách hàng' | string;
export type BadgePayment = 'Đã thanh toán' | 'Chờ thanh toán' | 'Đã hoàn tiền' | string; // Type mới

interface CommonBadgeProps {
    type: BadgeType;
    value: BadgeStatus | BadgeExpertise | BadgeRole | BadgePayment;
}

// ---------------------------------------------------
// 1. LOGIC CHO TYPE: STATUS (Trạng thái chung)
// ---------------------------------------------------
const getStatusStyle = (status: BadgeStatus): { classes: string, Icon: LucideIcon | null } => {
    let classes = 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
    let Icon: LucideIcon | null = null;

    switch (status) {
        case 'Đã duyệt': 
        case 'Hoàn thành':
            classes = 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100'; 
            Icon = Check;
            break;
        case 'Chờ duyệt': 
        case 'Chờ xác nhận':
            classes = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100'; 
            Icon = Clock;
            break;
        case 'Đã khóa': 
        case 'Bị hủy':
        case 'Đã từ chối': 
            classes = 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100'; 
            Icon = Ban;
            break;
        default:
             classes = 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100'; 
             Icon = null;
    }
    return { classes, Icon };
};

// ---------------------------------------------------
// 2. LOGIC CHO TYPE: PAYMENT (Trạng thái thanh toán)
// ---------------------------------------------------
const getPaymentStyle = (paymentStatus: BadgePayment): { classes: string, Icon: LucideIcon } => {
    let classes = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100';
    
    switch (paymentStatus) {
        case 'Đã thanh toán': 
            classes = 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100'; 
            break;
        case 'Đã hoàn tiền':
            classes = 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100';
            break;
        case 'Chờ thanh toán': 
        default:
            classes = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100'; 
    }
    // Dùng DollarSign cố định cho loại Payment
    return { classes, Icon: DollarSign };
};

// ---------------------------------------------------
// 3. LOGIC CHO TYPE: EXPERTISE (Chuyên môn)
// ---------------------------------------------------
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

// ---------------------------------------------------
// 4. LOGIC CHO TYPE: ROLE (Vai trò)
// ---------------------------------------------------
const getRoleStyle = (role: BadgeRole): string => {
    switch (role) {
        case 'Nhà tiên tri': 
            return 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100';
        case 'Khách hàng': 
            return 'bg-gray-600 text-white dark:bg-gray-300 dark:text-gray-900'; 
        default: 
            return 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
    }
};

/**
 * Component Badge chung, xử lý Status (Icon), Payment (Icon), Expertise và Role.
 */
export const Badge: React.FC<CommonBadgeProps> = ({ type, value }) => {
    let classes = 'px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap ';
    let Icon: LucideIcon | null = null;
    let displayValue = value;
    let hasIcon = true; // Mặc định có icon

    if (type === 'status') {
        const style = getStatusStyle(value as BadgeStatus);
        classes += ' inline-flex items-center space-x-1 ' + style.classes;
        Icon = style.Icon;
    } else if (type === 'payment') {
        const style = getPaymentStyle(value as BadgePayment);
        classes += ' inline-flex items-center space-x-1 ' + style.classes;
        Icon = style.Icon;
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
    
    // Nếu không có icon, ta loại bỏ space-x-1
    if (!hasIcon) {
        classes = classes.replace('inline-flex items-center space-x-1', 'inline-block');
    }

    return (
        <span className={classes}>
            {Icon && <Icon className="w-3 h-3" />}
            <span>{displayValue}</span>
        </span>
    );
};