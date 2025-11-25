/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, DollarSign, Award, TrendingUp, Calendar, X, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReportService } from '@/services/finance/financeHistory.service';
import { BookingService } from '@/services/booking/booking.service';
import { CustomerPotential } from '@/types/finance/finance.types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

const getPaymentMethodBadge = (method: string) => {
  const colors: Record<string, string> = {
    PAYPAL: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    VNPAY: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    MOMO: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  };
  return colors[method] || 'bg-gray-100 text-gray-800';
};

const getStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const PaymentHistoryRow: React.FC<{ payment: any }> = ({ payment }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-b-0 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <img
          src={payment.seer.avatarUrl || '/default_avatar.jpg'}
          alt={payment.seer.fullName}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {payment.seer.fullName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {payment.packageTitle}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(payment.paymentStatus)}`}>
              {payment.paymentStatus}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getPaymentMethodBadge(payment.paymentMethod)}`}>
              {payment.paymentMethod}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4 flex-shrink-0">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatCurrency(payment.amount)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(payment.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  );
};

const RevenueChart: React.FC<{
  data: any[];
  formatValue?: (val: number) => string;
}> = ({ data, formatValue = (val) => val.toLocaleString('vi-VN') }) => {
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

  const dataMap = data.reduce((acc: any, item: any) => {
    acc[item.label] = item.value;
    return acc;
  }, {});

  const chartData = months.map((month, idx) => {
    const monthKey = String(idx + 1);
    return {
      month,
      value: dataMap[monthKey] !== undefined ? dataMap[monthKey] : 0,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-400 dark:border-gray-700 shadow-lg">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {payload[0].payload.month}
          </p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">
            Chi tiêu TB: <span className="font-bold">{formatValue(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="month"
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
            tickFormatter={formatValue}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ fill: '#6366f1', r: 4 }}
            activeDot={{ r: 6 }}
            animationBegin={0}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomerDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const customerId = params?.id as string;

  const [customerData, setCustomerData] = useState<CustomerPotential | null>(null);
  const [loading, setLoading] = useState(true);
  const [avgSpendingData, setAvgSpendingData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Payment history states
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [paymentTotalPages, setPaymentTotalPages] = useState(0);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        const currentDate = new Date();
        const [customerResponse, avgSpendingResponse] = await Promise.all([
          ReportService.getCustomerPotential(
            customerId,
            currentDate.getMonth() + 1,
            currentDate.getFullYear(),
          ),
          ReportService.getChart('AVG_CUSTOMER_SPENDING', undefined, selectedYear),
        ]);
        setCustomerData(customerResponse.data);
        setAvgSpendingData(avgSpendingResponse.data || []);
      } catch (error) {
        console.error('Error fetching customer detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerDetail();
    }
  }, [customerId, selectedYear]);

  // Fetch payment history
  useEffect(() => {
    const fetchPayments = async () => {
      setLoadingPayments(true);
      try {
        const response = await BookingService.getPayments({
          page: paymentPage,
          limit: 10,
          sortBy: 'createdAt',
          sortType: 'desc',
          userId: customerId,
        });
        
        setPayments(response.data || []);
        setPaymentTotal(response.paging?.total || 0);
        setPaymentTotalPages(response.paging?.totalPages || 0);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setPayments([]);
      } finally {
        setLoadingPayments(false);
      }
    };

    if (customerId) {
      fetchPayments();
    }
  }, [customerId, paymentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Không tìm thấy dữ liệu
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Đã có lỗi xảy ra hoặc khách hàng không tồn tại.
          </p>
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
        </div>
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
              src={customerData?.avatarUrl || `https://i.pravatar.cc/150?u=${customerId}`}
              alt={customerData?.fullName || 'Customer Avatar'}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {customerData?.fullName || 'N/A'}
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Ranking: #{customerData?.ranking}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full text-white ${getTierColor(
                    customerData?.potentialTier,
                  )}`}
                >
                  {customerData?.potentialTier}
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
              {customerData?.potentialPoint}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng chi tiêu</p>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {formatCurrency(customerData?.totalSpending)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng Bookings</p>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {customerData?.totalBookingRequests}
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
                  {customerData?.potentialPoint}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Xếp hạng</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  #{customerData?.ranking}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chi tiêu</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(customerData?.totalSpending)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Booking requests</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {customerData?.totalBookingRequests}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <X className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Đã hủy</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {customerData?.cancelledByCustomer}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Award className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tier hiện tại</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {customerData?.potentialTier}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-indigo-500" />
              <span>Lịch sử giao dịch</span>
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Tổng: {paymentTotal} giao dịch
            </span>
          </div>

          {loadingPayments ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>
            </div>
          ) : payments.length > 0 ? (
            <>
              <div className="space-y-1">
                {payments.map((payment) => (
                  <PaymentHistoryRow key={payment.id} payment={payment} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Trang {paymentPage} / {paymentTotalPages}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPaymentPage((p) => Math.max(1, p - 1))}
                    disabled={paymentPage === 1}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPaymentPage((p) => Math.min(paymentTotalPages, p + 1))}
                    disabled={paymentPage >= paymentTotalPages}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Chưa có giao dịch nào</p>
            </div>
          )}
        </div>

        {/* Period Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Kỳ báo cáo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Tháng</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {customerData?.month}/{customerData?.year}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Ngày tạo</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Date(customerData?.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Cập nhật</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Date(customerData?.updatedAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;