'use client';
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Users,
  MessageSquare,
  Star // Icon cho Đánh giá
} from 'lucide-react';

import { ReportService } from '@/services/finance/financeHistory.service';
import { dashboardService } from '@/services/dashboard/dashboard.service';
import { AccountService } from '@/services/account/account.service';
import type { FinanceStatistic } from '@/types/finance/finance.types';

// ==========================================
// 1. UI Component: StatCardDashboard
// ==========================================

interface StatCardDashboardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  trendValue: number;
  trendType: 'percent' | 'amount' | 'rating'; // Thêm type rating để format số lẻ
  isCurrency?: boolean;
  forceTrendUp?: boolean;
  trendLabel?: string;
}

const StatCardDashboard: React.FC<StatCardDashboardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  trendValue, 
  trendType = 'percent',
  isCurrency = true,
  forceTrendUp = false,
  trendLabel
}) => {
  // Format Value chính
  let displayValue = '';
  if (isCurrency) {
    displayValue = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  } else if (trendType === 'rating') {
    // Nếu là rating thì luôn hiển thị 1 số thập phân (vd: 4.0, 4.5)
    displayValue = value.toFixed(1);
  } else {
    displayValue = new Intl.NumberFormat('vi-VN').format(value);
  }

  const isPositive = trendValue >= 0;
  const showGreen = forceTrendUp || isPositive;
  
  const TrendIcon = showGreen ? TrendingUp : TrendingDown;
  const trendColor = showGreen ? 'text-green-500' : 'text-red-500';
  
  // Format trend text
  let trendText = '';
  if (trendType === 'percent') {
    trendText = `${isPositive ? '+' : ''}${trendValue.toFixed(1)}%`;
  } else if (trendType === 'rating') {
    // Format trend cho rating (vd: +0.2)
    trendText = `${isPositive ? '+' : ''}${trendValue.toFixed(1)}`;
  } else {
    // Amount thường
    trendText = `${trendValue >= 0 ? '+' : ''}${new Intl.NumberFormat('vi-VN').format(trendValue)}`;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-700 h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <Icon className="w-5 h-5 text-indigo-500" />
      </div>

      <div className="flex flex-col items-start mt-3">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayValue}</p>
        
        <div className="flex items-center space-x-1 mt-2">
          <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
          <span className={`text-xs font-semibold ${trendColor}`}>
            {trendText} {trendLabel || 'so với kỳ trước'}
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. Logic & Container: FinanceStats
// ==========================================

interface StatItem {
  label: string;
  value: number;
  icon: React.ElementType;
  trendValue: number;
  trendType: 'percent' | 'amount' | 'rating';
  isCurrency: boolean;
  forceTrendUp?: boolean;
  trendLabel?: string;
}

export const FinanceStats: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        // Gọi song song 5 API (thêm API Rating)
        const [financeRes, accountRes, monthlyUsersRes, bookingChartRes, ratingChartRes] = await Promise.all([
          ReportService.getFinanceStatistic(),
          AccountService.getAccountStats(),
          dashboardService.getMonthlyUsers(currentYear),
          ReportService.getChart('TOTAL_BOOKING_COMPLETED', undefined, currentYear),
          // Sử dụng 'as any' để tránh lỗi TS nếu type chưa cập nhật
          ReportService.getChart('AVG_RATING_SEER', undefined, currentYear)
        ]);

        if (financeRes.data && accountRes.data && monthlyUsersRes.data && bookingChartRes.data && ratingChartRes.data) {
          const fData = financeRes.data;
          
          // --- 1. User Data ---
          const totalUsers = accountRes.data.customerAccounts + accountRes.data.seerAccounts;
          const newUsersThisMonth = monthlyUsersRes.data[String(currentMonth)] || 0;

          // --- 2. Booking Data ---
          const bookingData = bookingChartRes.data;
          const totalBookings = bookingData.reduce((acc, item) => acc + item.value, 0);
          const bookingsThisMonth = bookingData.find(item => item.label === String(currentMonth))?.value || 0;

          // --- 3. Rating Data (MỚI) ---
          const ratingData = ratingChartRes.data;
          // Lấy rating tháng hiện tại
          const currentRating = ratingData.find(item => item.label === String(currentMonth))?.value || 0;
          // Lấy rating tháng trước để tính trend
          const prevRating = ratingData.find(item => item.label === String(currentMonth - 1))?.value || 0;
          const ratingTrend = currentRating - prevRating;

          // --- Map to Cards ---
          const mappedStats: StatItem[] = [
            {
              label: 'Tổng doanh thu',
              value: fData.totalRevenue,
              icon: DollarSign,
              trendValue: fData.percentChangeTotalRevenue,
              trendType: 'percent',
              isCurrency: true
            },
            {
              label: 'Người dùng hoạt động',
              value: totalUsers,
              icon: Users,
              trendValue: newUsersThisMonth,
              trendType: 'amount',
              isCurrency: false,
              forceTrendUp: true,
              trendLabel: 'thành viên mới tháng này'
            },
            {
              label: 'Phiên tư vấn thành công',
              value: totalBookings,
              icon: MessageSquare,
              trendValue: bookingsThisMonth,
              trendType: 'amount',
              isCurrency: false,
              forceTrendUp: true,
              trendLabel: 'phiên tháng này'
            },
            {
              // CARD 4: Đánh giá trung bình
              label: 'Đánh giá trung bình',
              value: currentRating,
              icon: Star,
              trendValue: ratingTrend,
              trendType: 'rating', // Type mới để format số lẻ
              isCurrency: false,
              trendLabel: 'so với tháng trước'
            },
          ];

          setStats(mappedStats);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-700 h-32 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-center text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {stats.map((stat, index) => (
        <StatCardDashboard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          trendValue={stat.trendValue}
          trendType={stat.trendType}
          isCurrency={stat.isCurrency}
          forceTrendUp={stat.forceTrendUp}
          trendLabel={stat.trendLabel}
        />
      ))}
    </div>
  );
};