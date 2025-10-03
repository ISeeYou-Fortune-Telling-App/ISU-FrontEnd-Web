import React from 'react';

import { StatCardAccount } from '../../../components/common/StatCardAccount';
import { AppointmentTable } from '../../../components/booking/AppointmentTable';


const userStats = [
    { label: 'Tổng số chứng chỉ', value: 1983, colorClass: 'text-blue-500'},
    { label: 'Đã duyệt', value: 24, colorClass: 'text-green-500'},
    { label: 'Chờ duyệt', value: 12, colorClass: 'text-yellow-500'},
    { label: 'Đã từ chối', value: 5, colorClass: 'text-red-500'},
];

export default function AccountsPage() {
    return (
        <div className="space-y-6">
            
            {/* 1. Page Title */}
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Duyệt chứng chỉ</h1>
                <p className="text-base font-light text-gray-500 dark:text-gray-400">
                    Xem và duyệt chứng chỉ của các Nhà tiên tri
                </p>
            </div>
            
            {/* 2. Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {userStats.map((stat, index) => (
                    // Chỉ truyền props mà component StatsCard yêu cầu (value, label, colorClass)
                    // Icon không được StatsCard sử dụng, nên bỏ qua.
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
            <AppointmentTable />
            
        </div>
    );
}