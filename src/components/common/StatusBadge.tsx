// src/components/common/StatusBadge.tsx
import React from 'react';
import { Check, Clock, Lock, Ban } from 'lucide-react';

interface StatusBadgeProps {
    status: 'Đã duyệt' | 'Chờ duyệt' | 'Đã khóa' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    let classes = 'px-3 py-1 text-xs font-semibold rounded-lg inline-flex items-center space-x-1';
    let Icon = null;

    switch (status) {
        case 'Đã duyệt': 
            classes += ' bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100'; 
            Icon = Check;
            break;
        case 'Chờ duyệt': 
            classes += ' bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100'; 
            Icon = Clock;
            break;
        case 'Đã khóa': 
            classes += ' bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100'; 
            Icon = Lock;
            break;
        case 'Đã từ chối': 
            classes += ' bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100'; 
            Icon = Ban;
            break;
        default: 
            classes += ' bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
    }
    
    return (
        <span className={classes}>
            {Icon && <Icon className="w-3 h-3" />}
            <span>{status}</span>
        </span>
    );
};