'use client';

import React from 'react';
import { Users, MessageSquare, CreditCard, Award, Maximize } from 'lucide-react';

import StatCardDashboard from '../../../components/dashboard/StatCardDashboard';
import TopSeerRankCard from '../../../components/dashboard/TopSeerRankCard';
import ServiceDistributionCard from '../../../components/dashboard/ServiceDistributionCard';
import RecentActivityCard from '../../../components/dashboard/RecentActivityCard';

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

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
              <Maximize className="w-5 h-5 text-indigo-500" />
              <span>Doanh thu theo thời gian</span>
            </h2>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-1">
              Biểu đồ doanh thu và số phiên tư vấn 6 tháng gần nhất
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              defaultValue="Tháng 8"
              className="p-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Tháng 8">Tháng 8</option>
              <option value="Tháng 9">Tháng 9</option>
              <option value="Tháng 10">Tháng 10</option>
            </select>

            <select
              defaultValue="Năm 2025"
              className="p-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Năm 2025">Năm 2025</option>
              <option value="Năm 2024">Năm 2024</option>
              <option value="Năm 2023">Năm 2023</option>
            </select>
          </div>
        </div>
        <div className="h-64 mt-4 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700">
          [Placeholder: Biểu đồ doanh thu 6 tháng]
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopSeerRankCard />
        <ServiceDistributionCard />
      </div>
      <RecentActivityCard />
    </div>
  );
}
