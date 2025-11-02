'use client';
import React, { useState, useEffect } from 'react';
// Thay đổi: Import MessagesService thay vì AccountService
import { MessagesService } from '@/services/messages/messages.service';
// Thay đổi: Import MessagesStats thay vì AccountStatsInterface
import type { MessagesStats as MessagesStatsInterface } from '@/types/messages/messages.type';

interface StatCardProps {
  // Đổi tên component nội bộ cho hợp lý hơn
  value: number | string; // Cho phép hiển thị số và chuỗi (ví dụ: phần trăm)
  label: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, colorClass }) => {
  // Thay đổi: Nếu là số thì định dạng, nếu là chuỗi (như phần trăm) thì giữ nguyên
  let displayValue: string = typeof value === 'number' ? value.toLocaleString('vi-VN') : value;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-700">
      <p className={`text-2xl font-semibold ${colorClass}`}>{displayValue}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
};

interface StatItem {
  label: string;
  value: number | string;
  colorClass: string;
}

// Thay đổi: Hàm mapping mới cho MessagesStats
const mapStatsToCards = (stats: MessagesStatsInterface): StatItem[] => {
  // Định dạng readPercent thành chuỗi "%"
  const readPercentDisplay = `${stats.readPercent.toFixed(2)}%`;

  return [
    {
      label: 'Tổng người dùng đã nhắn',
      value: stats.totalUsers,
      colorClass: 'text-blue-600',
    },
    {
      label: 'Tổng người dùng hoạt động',
      value: stats.totalActives,
      colorClass: 'text-green-600',
    },
    {
      label: 'Tổng tin nhắn đã gửi',
      value: stats.totalSentMessages,
      colorClass: 'text-yellow-600',
    },
    {
      label: 'Tỷ lệ đọc tin nhắn',
      value: readPercentDisplay, // Hiển thị chuỗi phần trăm
      colorClass: 'text-indigo-600',
    },
  ];
};

// Thay đổi: Đổi tên component từ AccountStats thành MessagesStats
export const MessagesStats: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Thay đổi: Gọi service mới
        const response = await MessagesService.getMessagesStats();
        const mappedStats = mapStatsToCards(response);
        setStats(mappedStats);
      } catch (err) {
        // Thay đổi thông báo lỗi
        setError('Không thể tải dữ liệu thống kê tin nhắn.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // --- RENDER LOGIC ---

  if (isLoading) {
    // Giữ nguyên logic loading skeleton
    return (
      <>
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-700 h-24 rounded-xl animate-pulse"
            ></div>
          ))}
      </>
    );
  }

  if (error) {
    // Giữ nguyên logic lỗi
    return (
      <div className="lg:col-span-4 p-4 text-center text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <>
      {stats.map((stat, index) => (
        <StatCard key={index} value={stat.value} label={stat.label} colorClass={stat.colorClass} />
      ))}
    </>
  );
};
