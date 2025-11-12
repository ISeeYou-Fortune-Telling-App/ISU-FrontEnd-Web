/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, DollarSign, Award, TrendingUp, Calendar, X } from 'lucide-react';
import { ReportService } from '@/services/finance/financeHistory.service';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getTierColor = (tier: string) => {
  const colors: Record<string, string> = {
    VIP: 'bg-yellow-500',
    PREMIUM: 'bg-purple-400',
    STANDARD: 'bg-gray-400',
    CASUAL: 'bg-gray-300',
  };
  return colors[tier] || 'bg-gray-300';
};

const CustomerDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const customerId = params?.id as string;

  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        const currentDate = new Date();
        const response = await ReportService.getCustomerPotential(
          customerId,
          currentDate.getMonth() + 1,
          currentDate.getFullYear(),
        );
        setCustomerData(response.data);
      } catch (error) {
        console.error('Error fetching customer detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerDetail();
    }
  }, [customerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-4">
            <img
              src={`https://i.pravatar.cc/150?u=${customerId}`}
              alt="Customer Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {customerData.fullName || 'N/A'}
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Ranking: #{customerData.ranking}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full text-white ${getTierColor(
                    customerData.potentialTier,
                  )}`}
                >
                  {customerData.potentialTier}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Potential Point
              </p>
              <Award className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {customerData.potentialPoint}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng chi tiêu</p>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {formatCurrency(customerData.totalSpending)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng Bookings</p>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {customerData.totalBookingRequests}
            </p>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Thông tin chi tiết
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Award className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Điểm tiềm năng</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {customerData.potentialPoint}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Xếp hạng</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  #{customerData.ranking}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chi tiêu</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(customerData.totalSpending)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Booking requests</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {customerData.totalBookingRequests}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <X className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Đã hủy</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {customerData.cancelledByCustomer}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Award className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tier hiện tại</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {customerData.potentialTier}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Period Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Kỳ báo cáo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Tháng</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {customerData.month}/{customerData.year}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Ngày tạo</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Date(customerData.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Cập nhật</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Date(customerData.updatedAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
