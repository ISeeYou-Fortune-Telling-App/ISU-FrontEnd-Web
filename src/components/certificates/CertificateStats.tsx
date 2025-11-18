'use client';

import React, { useState, useEffect } from 'react';
import { CertificateService } from '@/services/certificates/certificates.service';
import type { CertificateStats as CertificateStatsInterface } from '@/types/certificates/certificates.type';

interface StatCardProps {
  value: number;
  label: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, colorClass }) => {
  const displayValue: string = value.toLocaleString('vi-VN');

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

const mapStatsToCards = (stats: CertificateStatsInterface): StatItem[] => {
  return [
    {
      label: 'Tổng số chứng chỉ',
      value: stats.totalCertificates,
      colorClass: 'text-blue-600',
    },
    {
      label: 'Đã duyệt',
      value: stats.approvedCertificates,
      colorClass: 'text-green-600',
    },
    {
      label: 'Chờ duyệt',
      value: stats.pendingCertificates,
      colorClass: 'text-yellow-600',
    },
    {
      label: 'Đã từ chối',
      value: stats.rejectedCertificates,
      colorClass: 'text-red-600',
    },
  ];
};

export const CertificateStats: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await CertificateService.getCertificateStats();
        const mappedStats = mapStatsToCards(response.data);
        setStats(mappedStats);
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê chứng chỉ.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

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
