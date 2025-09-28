// src/app/admin/dashboard/page.tsx

import React from 'react';
import { Mail, Users, MessageSquare, CreditCard } from 'lucide-react'; 
// IMPORT COMPONENT RIÊNG VÀO ĐÂY
import StatCard from '../../../components/feature/StatCard1'

/**
 * Trang Bảng điều khiển (Dashboard) - Trang cho route /admin/dashboard
 */
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Bảng Điều Khiển
        </h1>
        <h1 className="text-base font-light text-gray-900 dark:text-white">
          Tổng quan hệ thống I See You
        </h1>
      </div>
      
      {/* Thống kê - Dùng component StatCard đã import */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng doanh thu" 
          value="72.5M VND" 
          trend="+12.5% so với tháng trước" 
          icon={CreditCard}
        />
        <StatCard 
          title="Người dùng hoạt động" 
          value="2,817" 
          trend="+8.2% trong 30 ngày qua" 
          icon={Users}
        />
        <StatCard 
          title="Phiên tư vấn" 
          value="1,354" 
          trend="+0.5% tháng này" 
          icon={MessageSquare}
        />
        <StatCard 
          title="Tỷ lệ hài lòng" 
          value="76.8%" 
          trend="-2.1% đánh giá trung bình" 
          icon={Mail}
        />
      </div>

      {/* --------------------------------------------------------
        2. KHU VỰC BIỂU ĐỒ & XẾP HẠNG
        --------------------------------------------------------
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Biểu đồ Doanh thu theo thời gian */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Doanh thu theo thời gian</h2>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            [Placeholder: Biểu đồ doanh thu 6 tháng]
          </div>
        </div>
        
        {/* Top Seer hiệu suất cao */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Top Seer hiệu suất cao</h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li>Thầy Minh Tuệ - 13.500.000 VND</li>
            <li>Cô Thanh Lan - 12.750.000 VND</li>
            <li>Anh Hoàng Sơn - 10.200.000 VND</li>
          </ul>
        </div>
      </div>

      {/* --------------------------------------------------------
        3. KHU VỰC HOẠT ĐỘNG GẦN ĐÂY 
        --------------------------------------------------------
      */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Hoạt động gần đây</h2>
        <p className="text-gray-500 dark:text-gray-400">Không có hoạt động mới trong 24 giờ qua.</p>
      </div>

    </div>
  );
}