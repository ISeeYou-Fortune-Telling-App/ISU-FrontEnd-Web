'use client';
import React, { useState, useEffect } from 'react';
import { ChatHistoryService } from '@/services/chatHistory/chatHistory.service';
import type { ChatHistoryStats as ChatHistoryStatsInterface } from '@/types/chatHistory/chatHistory.type';

// ---------- Component hiển thị từng ô ----------
interface StatCardProps {
  value: number;
  label: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, colorClass }) => {
  const displayValue: string = value.toLocaleString('vi-VN');

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-700 w-full h-full text-left">
      <p className={`text-2xl font-semibold ${colorClass}`}>{displayValue}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
};

// ---------- Mapping dữ liệu ----------
interface StatItem {
  label: string;
  value: number;
  colorClass: string;
}

const mapStatsToCards = (stats: ChatHistoryStatsInterface): StatItem[] => {
  return [
    {
      label: 'Nhà tiên tri - Khách hàng',
      value: stats.bookingConversations,
      colorClass: 'text-blue-600',
    },
    {
      label: 'AI hỗ trợ - Khách hàng',
      value: stats.supportConversations,
      colorClass: 'text-green-600',
    },
    {
      label: 'Cuộc trò chuyện Admin',
      value: stats.adminConversations,
      colorClass: 'text-yellow-600',
    },
    {
      label: 'Đang hoạt động',
      value: stats.totalActives,
      colorClass: 'text-purple-600',
    },
    {
      label: 'Tổng số tin nhắn',
      value: stats.totalMessages,
      colorClass: 'text-red-600',
    },
  ];
};

// ---------- Component chính ----------
export const ChatHistoryStats: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await ChatHistoryService.getChatHistoryStats();
        const mappedStats = mapStatsToCards(response);
        setStats(mappedStats);
      } catch (err) {
        console.error(err);
        setError('Không thể tải dữ liệu thống kê lịch sử trò chuyện.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // --- LOADING ---
  if (isLoading) {
    return (
      <div className="grid grid-cols-5 gap-4">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-700 h-24 rounded-xl animate-pulse"
            ></div>
          ))}
      </div>
    );
  }

  // --- ERROR ---
  if (error) {
    return (
      <div className="w-full p-4 text-center text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900 rounded-lg">
        {error}
      </div>
    );
  }

  // --- HIỂN THỊ 5 Ô CÙNG 1 HÀNG ---
  return (
    <div className="grid grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} value={stat.value} label={stat.label} colorClass={stat.colorClass} />
      ))}
    </div>
  );
};
