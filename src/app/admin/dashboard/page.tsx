'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Users, MessageSquare, CreditCard, Award } from 'lucide-react';

import { FinanceStats } from '../../../components/dashboard/StatCardDashboard';

// Lazy load các components nặng
const ServiceDistributionCard = dynamic(
  () => import('../../../components/dashboard/ServiceDistributionCard'),
  {
    loading: () => (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700 h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    ),
    ssr: false,
  },
);

const RecentActivityCard = dynamic(
  () => import('../../../components/dashboard/RecentActivityCard'),
  {
    loading: () => (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700 h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    ),
    ssr: false,
  },
);

const MonthlyUsersChart = dynamic(() => import('../../../components/dashboard/MonthlyUsersChart'), {
  loading: () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700 h-80 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>
  ),
  ssr: false,
});

const TopSeerPerformanceChart = dynamic(
  () => import('../../../components/dashboard/TopSeerPerformanceChart'),
  {
    loading: () => (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700 h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    ),
    ssr: false,
  },
);

export default function AdminDashboardPage() {
  const [totalRevenue, setTotalRevenue] = React.useState<number | null>(null);
  const [activeUsers, setActiveUsers] = React.useState<number | null>(null);
  const [loadingStats, setLoadingStats] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);

        // Fetch tổng doanh thu từ finance API
        const financeRes = await fetch(
          `${process.env.NEXT_PUBLIC_REPORT_API_URL}/finance-statistic`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        );
        const financeData = await financeRes.json();
        setTotalRevenue(financeData.data?.totalRevenue || 0);

        // Fetch người dùng hoạt động từ monthly users API
        const currentYear = new Date().getFullYear();
        const usersRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_HEHE}/statistics/users/monthly?year=${currentYear}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        );
        const usersData = await usersRes.json();

        // Tính tổng người dùng trong năm
        const monthlyData = usersData.data || {};
        const totalUsers = Object.values(monthlyData).reduce(
          (sum: number, count) => sum + (count as number),
          0,
        );
        setActiveUsers(totalUsers);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Bảng Điều Khiển</h1>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Tổng quan hệ thống I See You
        </p>
      </div>

      <FinanceStats />

      <Suspense
        fallback={
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700 h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        }
      >
        <MonthlyUsersChart />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense
          fallback={
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700 h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          }
        >
          <TopSeerPerformanceChart />
        </Suspense>
        <Suspense
          fallback={
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700 h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          }
        >
          <ServiceDistributionCard />
        </Suspense>
      </div>
    </div>
  );
}
