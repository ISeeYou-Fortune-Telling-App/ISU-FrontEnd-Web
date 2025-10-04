import React from 'react';

import { StatCardAccount } from '../../../components/common/StatCardAccount';
import { PostTable } from '../../../components/posts/PostTable';

const userStats = [
    { label: 'Tổng số bài viết', value: 1983, colorClass: 'text-blue-500'},
    { label: 'Có báo cáo', value: 24, colorClass: 'text-yellow-500'},
    { label: 'Đã ẩn', value: 12, colorClass: 'text-red-500'},
    { label: 'Lượt tương tác', value: 341423, colorClass: 'text-green-500'},
];

export default function PostsPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Quản lý bài viết</h1>
                <p className="text-base font-light text-gray-500 dark:text-gray-400">
                    Xem và quản lý tất cả bài viết trong hệ thống
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {userStats.map((stat, index) => (
                    <StatCardAccount 
                        key={index} 
                        value={stat.value} 
                        label={stat.label} 
                        colorClass={stat.colorClass} 
                    />
                ))}
            </div>
            
            {/* 3. User Management Table Section */}
            {/* UserTable đã được cập nhật Dark Mode trong các div và text class. */}
            <PostTable />
            
        </div>
    );
}