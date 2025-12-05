'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

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
