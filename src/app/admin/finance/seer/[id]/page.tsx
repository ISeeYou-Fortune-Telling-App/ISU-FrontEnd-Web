/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { SeerPerformance } from '@/types/finance/finance.types';
import {
  ArrowLeft,
  DollarSign,
  Award,
  TrendingUp,
  Users,
  Star,
  Package,
  Calendar,
  X,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ReportService } from '@/services/finance/financeHistory.service';
import { BookingService } from '@/services/booking/booking.service';
import { YearDropdown, MonthDropdown } from '@/components/finance/UnifiedDropdown';

const formatCurrency = (value: number | null | undefined) => {
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(safeValue);
};

const getTierColor = (tier: string) => {
  const colors: Record<string, string> = {
    MASTER: 'bg-cyan-500',
    EXPERT: 'bg-purple-500',
    PROFESSIONAL: 'bg-yellow-500',
    APPRENTICE: 'bg-gray-400',
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

const PaymentHistoryRow: React.FC<{ payment: any; index: number }> = ({ payment, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay: index * 0.02 }}
      className="flex items-center justify-between py-4 border-b last:border-b-0 border-gray-400 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
    >
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <img
          src={payment.customer.avatarUrl || '/default_avatar.jpg'}
          alt={payment.customer.fullName}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          onError={(e) => {
            e.currentTarget.src = '/default_avatar.jpg';
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {payment.customer.fullName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {payment.packageTitle}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(
                payment.paymentStatus,
              )}`}
            >
              {payment.paymentStatus}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${getPaymentMethodBadge(
                payment.paymentMethod,
              )}`}
            >
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
    </motion.div>
  );
};

const PayBonusModal: React.FC<{
  seer: SeerPerformance;
  month: number;
  year: number;
  onClose: () => void;
  onSuccess: (updatedSeer: SeerPerformance) => void;
}> = ({ seer, month, year, onClose, onSuccess }) => {
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do thưởng');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bonusAmount = parseFloat(amount);

      await ReportService.payBonus(seer.seerId, bonusAmount, reason);

      const verifyResponse = await ReportService.getSeerPerformance(seer.seerId, month, year);

      if (verifyResponse.data.bonus >= seer.bonus + bonusAmount) {
        await Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: `Đã thanh toán bonus ${formatCurrency(bonusAmount)} cho ${seer.fullName}`,
          confirmButtonColor: '#10b981',
        });
        onSuccess(verifyResponse.data);
      } else {
        const optimisticUpdate: SeerPerformance = {
          ...seer,
          bonus: seer.bonus + bonusAmount,
        };
        await Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: `Đã thanh toán bonus ${formatCurrency(bonusAmount)} cho ${seer.fullName}`,
          confirmButtonColor: '#10b981',
        });
        onSuccess(optimisticUpdate);
      }

      onClose();
    } catch (err: any) {
      console.error('Error paying bonus:', err);
      setError(err.message || 'Có lỗi xảy ra khi thanh toán');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span>Bonus</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Seer:{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {seer?.fullName || 'N/A'}
              </span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bonus hiện tại:{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(seer?.bonus || 0)}
              </span>
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
              Số tiền (VND) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || parseFloat(value) >= 0) {
                  setAmount(value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
              placeholder="Nhập số tiền..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
              Lý do thưởng <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do thưởng..."
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  <span>Thanh toán</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SeerDetailContent: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const seerId = params?.id as string;

  // Load month/year from URL params or sessionStorage
  const [month, setMonth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlMonth = urlParams.get('month');
      if (urlMonth && parseInt(urlMonth) >= 1 && parseInt(urlMonth) <= 12) {
        return parseInt(urlMonth);
      }

      const stored = sessionStorage.getItem(`seer_${seerId}_period`);
      if (stored) {
        const { month: storedMonth } = JSON.parse(stored);
        return storedMonth;
      }
    }
    return new Date().getMonth() + 1;
  });

  const [year, setYear] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlYear = urlParams.get('year');
      if (urlYear && parseInt(urlYear) >= 2020 && parseInt(urlYear) <= 2030) {
        return parseInt(urlYear);
      }

      const stored = sessionStorage.getItem(`seer_${seerId}_period`);
      if (stored) {
        const { year: storedYear } = JSON.parse(stored);
        return storedYear;
      }
    }
    return 2025;
  });

  const [seerData, setSeerData] = useState<any>(null);
  const [seerBasicInfo, setSeerBasicInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);

  // Payment history states
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [paymentTotalPages, setPaymentTotalPages] = useState(0);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    const fetchSeerDetail = async () => {
      console.log('📅 Fetching seer detail with:', { seerId, month, year });

      try {
        const seerResponse = await ReportService.getSeerPerformance(seerId, month, year).catch(
          () => ({ data: null }),
        );
        setSeerData(seerResponse.data);

        // If no data for this period, try to get basic info from current month
        if (!seerResponse.data && !seerBasicInfo) {
          try {
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            const basicInfoResponse = await ReportService.getSeerPerformance(
              seerId,
              currentMonth,
              currentYear,
            );
            if (basicInfoResponse.data) {
              setSeerBasicInfo({
                fullName: basicInfoResponse.data.fullName,
                avatarUrl: basicInfoResponse.data.avatarUrl,
                seerId: basicInfoResponse.data.seerId,
              });
            }
          } catch (basicError) {
            console.log('Could not fetch basic seer info:', basicError);
          }
        }
      } catch (error) {
        console.error('Error fetching seer detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (seerId && month && year) {
      fetchSeerDetail();
    }
  }, [seerId, month, year]);

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
          seerId: seerId,
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

    if (seerId) {
      fetchPayments();
    }
  }, [seerId, paymentPage]);

  const handleBonusSuccess = (updatedSeer: SeerPerformance) => {
    setSeerData(updatedSeer);
  };

  const handleRefresh = async () => {
    setLoading(true);

    try {
      const response = await ReportService.getSeerPerformance(seerId, month, year);
      setSeerData(response.data);
    } catch (error) {
      console.error('Error refreshing:', error);
      alert('Có lỗi khi làm mới dữ liệu. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Get display info - prefer seerData, fallback to basicInfo
  const displayInfo = seerData || seerBasicInfo;
  const hasDataForPeriod = !!seerData;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>
      </div>
    );
  }

  if (!displayInfo && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Không tìm thấy seer
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Seer không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => router.push('/admin/finance?tab=seer')}
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
    <div className="min-h-screen dark:bg-gray-900">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/admin/finance?tab=seer')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>

          {/* Month/Year Filter */}
          <div className="flex items-center space-x-2">
            {/* Month Dropdown */}
            <MonthDropdown
              value={month}
              onChange={(newMonth) => {
                setMonth(newMonth);
                sessionStorage.setItem(
                  `seer_${seerId}_period`,
                  JSON.stringify({ month: newMonth, year }),
                );
              }}
              className="w-32"
            />

            {/* Year Dropdown */}
            <YearDropdown
              value={year}
              onChange={(newYear) => {
                setYear(newYear);
                sessionStorage.setItem(
                  `seer_${seerId}_period`,
                  JSON.stringify({ month, year: newYear }),
                );
              }}
              className="w-32"
            />

            <button
              onClick={() => setShowPayModal(true)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>Thưởng thêm</span>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-400 dark:border-gray-700">
          <div className="flex items-start space-x-4">
            <img
              src={displayInfo?.avatarUrl || `https://i.pravatar.cc/150?u=${seerId}`}
              alt={displayInfo?.fullName || 'Seer Avatar'}
              className="w-20 h-20 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/default_avatar.jpg';
              }}
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayInfo?.fullName || 'Seer'}
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Ranking: {hasDataForPeriod ? `#${seerData?.ranking}` : 'Không có dữ liệu'}
                </span>
                {hasDataForPeriod && seerData?.performanceTier && (
                  <span
                    className={`text-xs px-3 py-1 rounded-full text-white ${getTierColor(
                      seerData.performanceTier,
                    )}`}
                  >
                    {seerData.performanceTier}
                  </span>
                )}
              </div>
              {!hasDataForPeriod && (
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                  Không có dữ liệu cho tháng {month}/{year}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Điểm hiệu suất</p>
              <Award className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {hasDataForPeriod ? seerData?.performancePoint ?? 0 : 'Không có dữ liệu'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng doanh thu</p>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {hasDataForPeriod ? formatCurrency(seerData?.totalRevenue || 0) : 'Không có dữ liệu'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Đánh giá TB</p>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {hasDataForPeriod
                ? `${(seerData?.avgRating || 0).toFixed(1)}/5 ⭐`
                : 'Không có dữ liệu'}
            </p>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-400 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Thông tin chi tiết
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 dark:bg-gray-700/50 rounded-lg transition-colors">
              <Package className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tổng gói dịch vụ</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {seerData?.totalPackages ?? 0}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 dark:bg-gray-700/50 rounded-lg transition-colors">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tổng Lịch hẹn</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {seerData?.totalBookings ?? 0}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 dark:bg-gray-700/50 rounded-lg transition-colors">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hoàn thành</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {seerData?.completedBookings ?? 0}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 dark:bg-gray-700/50 rounded-lg transition-colors">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tổng đánh giá</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {seerData?.totalRates ?? 0}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 dark:bg-gray-700/50 rounded-lg transition-colors">
              <X className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Đã hủy</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {seerData?.cancelledBySeer ?? 0}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 dark:bg-gray-700/50 rounded-lg transition-colors">
              <DollarSign className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tiền thưởng</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(seerData?.bonus || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-400 dark:border-gray-700">
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
                {payments.map((payment, index) => (
                  <PaymentHistoryRow key={payment.id} payment={payment} index={index} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-400 dark:border-gray-700 mt-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Trang {paymentPage}/{paymentTotalPages} • {paymentTotal} giao dịch
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPaymentPage((p) => Math.max(1, p - 1))}
                    disabled={paymentPage === 1 || loadingPayments}
                    className={`p-2 rounded-md transition ${
                      paymentPage === 1 || loadingPayments
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPaymentPage((p) => Math.min(paymentTotalPages, p + 1))}
                    disabled={paymentPage >= paymentTotalPages || loadingPayments}
                    className={`p-2 rounded-md transition ${
                      paymentPage >= paymentTotalPages || loadingPayments
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
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
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-400 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Kỳ báo cáo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Tháng</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {seerData?.month}/{seerData?.year}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Ngày tạo</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {seerData?.createdAt
                  ? new Date(seerData.createdAt).toLocaleDateString('vi-VN')
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Cập nhật</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Date(seerData?.updatedAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showPayModal && (
        <PayBonusModal
          seer={seerData}
          month={month}
          year={year}
          onClose={() => setShowPayModal(false)}
          onSuccess={handleBonusSuccess}
        />
      )}
    </div>
  );
};

export default SeerDetailContent;
