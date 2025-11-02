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
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-700 w-full h-full text-center">
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
      label: 'Tổng Cuộc trò chuyện Booking',
      value: stats.bookingConversations,
      colorClass: 'text-blue-600',
    },
    {
      label: 'Tổng Cuộc trò chuyện Hỗ trợ',
      value: stats.supportConversations,
      colorClass: 'text-green-600',
    },
    {
      label: 'Tổng Cuộc trò chuyện Admin',
      value: stats.adminConversations,
      colorClass: 'text-yellow-600',
    },
    {
      label: 'Tổng người dùng hoạt động',
      value: stats.totalActives,
      colorClass: 'text-purple-600',
    },
    {
      label: 'Tổng tin nhắn đã gửi',
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
      <div className="flex gap-4 justify-between">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-700 h-24 rounded-xl flex-1 animate-pulse"
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
    <div className="flex gap-4 justify-between">
      {stats.map((stat, index) => (
        <div key={index} className="flex-1">
          <StatCard value={stat.value} label={stat.label} colorClass={stat.colorClass} />
        </div>
      ))}
    </div>
  );
};
