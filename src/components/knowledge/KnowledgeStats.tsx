'use client';
import React, { useState, useEffect } from 'react';

import { KnowledgeService } from '@/services/knowledge/knowledge.service';
import type { KnowledgeItemStats } from '@/types/knowledge/knowledge.type';

interface StatCardProps {
  value: number;
  label: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, colorClass }) => {
  const displayValue = value.toLocaleString('vi-VN');

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-700">
      <p className={`text-2xl font-semibold ${colorClass}`}>{displayValue}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
};

interface StatItem {
  label: string;
  value: number;
  colorClass: string;
}

const mapKnowledgeStatsToCards = (stats: KnowledgeItemStats): StatItem[] => {
  return [
    {
      label: 'Bài viết đã xuất bản',
      value: stats.publishedItems,
      colorClass: 'text-green-600',
    },
    {
      label: 'Bài viết nháp',
      value: stats.draftItems,
      colorClass: 'text-yellow-600',
    },
    {
      label: 'Bài viết ẩn',
      value: stats.hiddenItems,
      colorClass: 'text-red-600',
    },
    {
      label: 'Tổng lượt xem',
      value: stats.totalViewCount,
      colorClass: 'text-blue-600',
    },
  ];
};

export const KnowledgeStats: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await KnowledgeService.getKnowledgeStats();
        const mappedStats = mapKnowledgeStatsToCards(data);
        setStats(mappedStats);
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê tri thức.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ----- RENDER -----

  if (isLoading) {
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
