'use client';
import React, { useState, useEffect } from 'react';

import { AccountService } from '../../services/account/account.service';
import type { AccountStats as AccountStatsInterface } from '../../types/account/account.type';

interface StatCardAccountProps {
  value: number;
  label: string;
  colorClass: string;
}

const StatCardAccount: React.FC<StatCardAccountProps> = ({ value, label, colorClass }) => {
  let displayValue: string = value.toLocaleString('vi-VN');

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

const mapStatsToCards = (stats: AccountStatsInterface): StatItem[] => {
  return [
    {
      label: 'Tài khoản Khách hàng',
      value: stats.customerAccounts,
      colorClass: 'text-blue-600',
    },
    {
      label: 'Tài khoản Nhà tiên tri',
      value: stats.seerAccounts,
      colorClass: 'text-green-600',
    },
    {
      label: 'Tài khoản chờ duyệt',
      value: stats.pendingAccounts,
      colorClass: 'text-yellow-600',
    },
    {
      label: 'Tài khoản bị khóa',
      value: stats.blockedAccounts,
      colorClass: 'text-red-600',
    },
  ];
};

export const AccountStats: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await AccountService.getAccountStats();
        const mappedStats = mapStatsToCards(response.data);
        setStats(mappedStats);
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê tài khoản.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // --- RENDER LOGIC ---

  if (isLoading) {
    // Hiển thị skeleton loading
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
    // Chiếm toàn bộ không gian 4 cột nếu có lỗi
    return (
      <div className="lg:col-span-4 p-4 text-center text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <>
      {stats.map((stat, index) => (
        <StatCardAccount
          key={index}
          value={stat.value}
          label={stat.label}
          colorClass={stat.colorClass}
        />
      ))}
    </>
  );
};
