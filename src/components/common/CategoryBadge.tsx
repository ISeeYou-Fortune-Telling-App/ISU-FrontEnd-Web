// src/components/common/CategoryBadge.tsx
import React from 'react';
import { Star } from 'lucide-react';

interface CategoryBadgeProps {
    category: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
    // Dùng màu tím (purple) như trong ảnh chi tiết chứng chỉ.
    // Thêm logic đơn giản để tạo màu sắc khác nhau dựa trên danh mục (tùy chọn)
    let classes = 'px-3 py-1 text-xs font-medium rounded-full inline-block';

    switch (category) {
        case 'Tarot': classes += ' bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100'; break;
        case 'Ngũ Hành': classes += ' bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100'; break;
        case 'Cung Hoàng Đạo': 
        default: 
            classes += ' bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-100'; 
            break;
    }
    
    return (
        <span className={classes}>
            {category}
        </span>
    );
};