// src/components/admin/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
    value: number;
    label: string;
    colorClass: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ value, label, colorClass }) => {
    return (
        // Thêm dark:bg-gray-800 và dark:border-gray-700
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <p className={`text-2xl font-semibold ${colorClass}`}>
                {value.toLocaleString('vi-VN')}
            </p>
            {/* Thêm dark:text-gray-400 */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
        </div>
    );
};