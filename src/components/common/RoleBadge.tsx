// src/components/common/RoleBadge.tsx
import React from 'react';

interface RoleBadgeProps {
    role: 'Nhà tiên tri' | 'Khách hàng' | string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
    let classes = 'px-3 py-1 text-xs font-semibold rounded-lg inline-block';

    switch (role) {
        case 'Nhà tiên tri': classes += ' bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100'; break;
        case 'Khách hàng': classes += ' bg-gray-600 text-white'; break;
        default: classes += ' bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
    }

    return <span className={classes}>{role}</span>;
};