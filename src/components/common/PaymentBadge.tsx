// src/components/common/PaymentBadge.tsx
import React from 'react';
import { DollarSign, RefreshCw, XCircle, Clock } from 'lucide-react';

interface PaymentBadgeProps {
    status: 'Đã thanh toán' | 'Đã hoàn tiền' | 'Chờ thanh toán' | string;
}

export const PaymentBadge: React.FC<PaymentBadgeProps> = ({ status }) => {
    let classes = 'px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center space-x-1';
    let Icon = null;

    switch (status) {
        case 'Đã thanh toán':
            classes += ' bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100';
            Icon = DollarSign;
            break;
        case 'Đã hoàn tiền':
            classes += ' bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100';
            Icon = RefreshCw;
            break;
        case 'Chờ thanh toán':
            classes += ' bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100';
            Icon = Clock; // Giả định dùng Clock hoặc icon phù hợp
            break;
        default:
            classes += ' bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
            Icon = XCircle;
    }

    return (
        <span className={classes}>
            {Icon && <Icon className="w-3 h-3" />}
            <span>{status}</span>
        </span>
    );
};