'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Users, MessageSquare, CreditCard, Award } from 'lucide-react';

import StatCardDashboard from '../../../components/dashboard/StatCardDashboard';

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
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Bảng Điều Khiển</h1>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Tổng quan hệ thống I See You
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardDashboard
          title="Tổng doanh thu"
          value="72.5M"
          trend="+12.5% so với tháng trước"
          icon={CreditCard}
        />
        <StatCardDashboard
          title="Người dùng hoạt động"
          value="2,817"
          trend="+8.2% trong 30 ngày qua"
          icon={Users}
        />
        <StatCardDashboard
          title="Phiên tư vấn"
          value="1,354"
          trend="+0.5% tháng này"
          icon={MessageSquare}
        />
        <StatCardDashboard
          title="Tỷ lệ hài lòng"
          value="76.8%"
          trend="-2.1% đánh giá trung bình"
          icon={Award}
        />
      </div>

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

      <Suspense
        fallback={
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700 h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        }
      >
        <RecentActivityCard />
      </Suspense>
    </div>
  );
}
