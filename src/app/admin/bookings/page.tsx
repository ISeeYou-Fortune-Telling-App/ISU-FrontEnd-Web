'use client';
import React, { useEffect, useState } from 'react';
import { BookingTable } from '@/components/booking/AppointmentTable';
import { BookingService } from '@/services/booking/booking.service';
import { BookingStats } from '@/types/booking/booking.type';
import { StatCardAccount } from '../../../components/common/StatCardAccount';

export default function BookingsPage() {
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const apiStats = await BookingService.getStats();
        setStats(apiStats);
      } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const bookingStats = [
    {
      label: 'Tổng lịch hẹn',
      value: loading ? '...' : stats?.totalBookings.toLocaleString() ?? 0,
      colorClass: 'text-blue-600',
    },
    {
      label: 'Hoàn thành',
      value: loading ? '...' : stats?.completedBookings.toLocaleString() ?? 0,
      colorClass: 'text-green-500',
    },
    {
      label: 'Chờ xác nhận',
      value: loading ? '...' : stats?.pendingBookings.toLocaleString() ?? 0,
      colorClass: 'text-yellow-500',
    },
    {
      label: 'Bị hủy',
      value: loading ? '...' : stats?.canceledBookings.toLocaleString() ?? 0,
      colorClass: 'text-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Quản lý lịch hẹn</h1>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Theo dõi và quản lý tất cả lịch hẹn giữa khách hàng và Seer
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {bookingStats.map((stat, index) => (
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
