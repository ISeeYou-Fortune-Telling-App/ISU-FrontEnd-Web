// src/components/common/ExpertiseBadge.tsx

import React from 'react';

interface ExpertiseBadgeProps {
    expertise: string; // Ví dụ: "Cung Hoàng Đạo", "Ngũ Hành", "Tarot"
}

// Hàm logic để trả về màu/style Tailwind CSS dựa trên tên chuyên môn
const getBadgeStyle = (expertise: string): string => {
    const key = expertise;
    switch (key) {
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
            console.log('Unmatched expertise:', expertise, 'normalized:', key);
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'; // Màu mặc định
    }
};

/**
 * Component hiển thị Badge cho chuyên môn của Nhà tiên tri.
 */
export const ExpertiseBadge: React.FC<ExpertiseBadgeProps> = ({ expertise }) => {
    const style = getBadgeStyle(expertise);
    
    return (
        <span 
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${style}`}
        >
            {expertise}
        </span>
    );
};