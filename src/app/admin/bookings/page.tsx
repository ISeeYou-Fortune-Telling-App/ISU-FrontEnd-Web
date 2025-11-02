import React from 'react';

import { StatCardAccount } from '../../../components/common/StatCardAccount';
import { BookingTable } from '../../../components/booking/BookingTable';

const userStats = [
  { label: 'Tổng lịch hẹn', value: 1983, colorClass: 'text-blue-500' },
  { label: 'Đã hoàn thành', value: 24, colorClass: 'text-green-500' },
  { label: 'Chờ xác nhận', value: 12, colorClass: 'text-yellow-500' },
  { label: 'Bị hủy', value: 5, colorClass: 'text-red-500' },
];

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Quản lý lịch hẹn</h1>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Theo dõi và quản lý tất cả lịch hẹn giữa khách hàng và Seer
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
      <BookingTable />
    </div>
  );
}
