/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
} from 'lucide-react';
import { ReportService } from '@/services/finance/financeHistory.service';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
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

const PayBonusModal: React.FC<{
  seer: SeerPerformance;
  onClose: () => void;
  onSuccess: (updatedSeer: SeerPerformance) => void;
}> = ({ seer, onClose, onSuccess }) => {
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
      const currentDate = new Date();

      console.log('=== BẮT ĐẦU THANH TOÁN BONUS ===');
      console.log('Seer ID:', seer.seerId);
      console.log('Bonus amount:', bonusAmount);
      console.log('Bonus hiện tại:', seer.bonus);
      console.log('Bonus mong đợi:', seer.bonus + bonusAmount);

      const paymentResult = await ReportService.payBonus(seer.seerId, bonusAmount, reason);
      console.log('✅ Payment thành công:', paymentResult);

      const actionResult = await ReportService.seerAction(seer.seerId, 'EARNING', bonusAmount);
      console.log('✅ SeerAction result:', actionResult);

      const verifyResponse = await ReportService.getSeerPerformance(
        seer.seerId,
        currentDate.getMonth() + 1,
        currentDate.getFullYear(),
      );

      if (verifyResponse.data.bonus >= seer.bonus + bonusAmount) {
        console.log('✅ SERVER ĐÃ CẬP NHẬT THÀNH CÔNG!');
        alert('Thanh toán bonus thành công!');
        onSuccess(verifyResponse.data);
      } else {
        console.warn('⚠️ Server chưa cập nhật kịp, dùng optimistic update');
        const optimisticUpdate: SeerPerformance = {
          ...seer,
          bonus: seer.bonus + bonusAmount,
        };
        alert('Thanh toán bonus thành công!');
        onSuccess(optimisticUpdate);
      }

      onClose();
    } catch (err: any) {
      console.error('❌ LỖI:', err);
      console.error('Error details:', err.response?.data || err.message);
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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

const SeerDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const seerId = params?.id as string;

  const [seerData, setSeerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);

  useEffect(() => {
    const fetchSeerDetail = async () => {
      try {
        const currentDate = new Date();
        const response = await ReportService.getSeerPerformance(
          seerId,
          currentDate.getMonth() + 1,
          currentDate.getFullYear(),
        );
        setSeerData(response.data);
      } catch (error) {
        console.error('Error fetching seer detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (seerId) {
      fetchSeerDetail();
    }
  }, [seerId]);

  const handleBonusSuccess = (updatedSeer: SeerPerformance) => {
    console.log('🔄 Cập nhật UI với data mới:', updatedSeer);
    setSeerData(updatedSeer);
  };

  const handleRefresh = async () => {
    console.log('🔄 Bắt đầu refresh dữ liệu...');
    setLoading(true);
    const currentDate = new Date();

    try {
      const response = await ReportService.getSeerPerformance(
        seerId,
        currentDate.getMonth() + 1,
        currentDate.getFullYear(),
      );
      console.log('✅ Refresh thành công:', response.data);
      setSeerData(response.data);
    } catch (error) {
      console.error('❌ Lỗi khi refresh:', error);
      alert('Có lỗi khi làm mới dữ liệu. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

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

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2 disabled:opacity-50"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Làm mới</span>
            </button>

            <button
              onClick={() => setShowPayModal(true)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>Bonus</span>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-4">
            <img
              src={seerData?.avatarUrl || `https://i.pravatar.cc/150?u=${seerId}`}
              alt={seerData?.fullName || 'Seer Avatar'}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {seerData?.fullName || 'N/A'}
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Ranking: #{seerData?.ranking}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full text-white ${getTierColor(
                    seerData?.performanceTier,
                  )}`}
                >
                  {seerData?.performanceTier}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Điểm hiệu suất</p>
              <Award className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {seerData?.performancePoint}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng doanh thu</p>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {formatCurrency(seerData?.totalRevenue)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Đánh giá TB</p>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {seerData?.avgRating.toFixed(1)}/5 ⭐
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
              <Package className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tổng gói dịch vụ</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {seerData?.totalPackages}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tổng lịch hẹn</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {seerData?.totalBookings}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hoàn thành</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {seerData?.completedBookings}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tổng đánh giá</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {seerData?.totalRates}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <X className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Đã hủy</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {seerData?.cancelledBySeer}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tiền thưởng</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(seerData?.bonus)}
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
                {seerData?.month}/{seerData?.year}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Ngày tạo</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Date(seerData?.createdAt).toLocaleDateString('vi-VN')}
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
          onClose={() => setShowPayModal(false)}
          onSuccess={handleBonusSuccess}
        />
      )}
    </div>
  );
};

export default SeerDetailPage;
