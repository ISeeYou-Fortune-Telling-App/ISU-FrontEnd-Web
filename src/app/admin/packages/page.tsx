'use client'; // Bắt buộc phải có vì dùng hooks
import React, { useState, useEffect } from 'react'; // Import hooks
import { StatCardAccount } from '../../../components/common/StatCardAccount';
import { PackageTable } from '../../../components/packages/PackageTable';
import { PackageService } from '@/services/packages/package.service'; // Import service
import { PackageStats } from '@/types/packages/package.type'; // Import type


export default function PackagesPage() {
  const [stats, setStats] = useState<PackageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await PackageService.getStats();
        setStats(res.data);
      } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Tổng số bài viết', 
      value: loading ? '...' : stats?.totalPackages ?? 0, 
      colorClass: 'text-blue-500' 
    },
    { 
      label: 'Có báo cáo', 
      value: loading ? '...' : stats?.reportedPackages ?? 0, 
      colorClass: 'text-yellow-500' 
    },
    { 
      label: 'Đã ẩn', 
      value: loading ? '...' : stats?.hiddenPackages ?? 0, 
      colorClass: 'text-red-500' 
    },
    { 
      label: 'Lượt tương tác', 
      value: loading ? '...' : stats?.totalInteractions ?? 0, 
      colorClass: 'text-green-500' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Quản lý bài viết</h1>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Xem và quản lý tất cả bài viết trong hệ thống
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dùng mảng statCards đã được map */}
        {statCards.map((stat, index) => (
          <StatCardAccount 
            key={index} 
            value={stat.value} 
            label={stat.label} 
            colorClass={stat.colorClass} 
          />
        ))}
      </div>
      
      <PackageTable />
    </div>
  );
}
