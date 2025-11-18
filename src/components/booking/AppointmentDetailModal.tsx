'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Clock, Check, Ban } from 'lucide-react';
import { Badge } from '../common/Badge';
import type { BookingResponse } from '@/types/booking/booking.type';

interface BookingDetailModalProps {
  booking: BookingResponse | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  onCancel: (id: string, reason?: string) => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  onClose,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');

  if (!booking) return null;

  const isPendingConfirmation = booking.status === 'PENDING';
  const isCancelled = booking.status === 'CANCELLED';

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => onConfirm(booking.id);
  const handleCancel = () => onCancel(booking.id, reason);

  const paymentInfo = booking.bookingPaymentInfos?.[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-gray-800 shadow-2xl flex flex-col rounded-xl overflow-hidden border border-gray-400 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-grow overflow-y-auto p-6 pb-20 space-y-5">
          {/* HEADER */}
          <div className="pb-4 border-b border-dashed dark:border-gray-700">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                Chi tiết lịch hẹn
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 2 cột: khách hàng & nhà tiên tri */}
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Khách hàng</p>
                <div className="flex items-center space-x-2">
                  <img
                    src={booking.customer.avatarUrl}
                    alt={booking.customer.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {booking.customer.fullName}
                  </span>
                </div>
                <div className="mt-2">
                  <Badge type="status" value={booking.status} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nhà tiên tri</p>
                <div className="flex items-center space-x-2">
                  <img
                    src={booking.seer.avatarUrl}
                    alt={booking.seer.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {booking.seer.fullName}
                  </span>
                </div>
                <div className="mt-2">
                  <Badge type="payment" value={paymentInfo?.paymentStatus || 'PENDING'} />
                </div>
              </div>
            </div>
          </div>

          {/* THÔNG TIN DỊCH VỤ */}
          <div className="space-y-2">
            <p className="font-semibold text-gray-900 dark:text-white">Thông tin dịch vụ:</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Dịch vụ</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {booking.servicePackage.packageTitle}
                </p>
              </div>
              {booking.servicePackage.categories.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Danh mục</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.servicePackage.categories.join(', ')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Thời lượng</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {booking.servicePackage.durationMinutes} phút
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Giá tiền</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {booking.servicePackage.price.toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>
            {booking.servicePackage.packageContent && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Mô tả</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {booking.servicePackage.packageContent}
                </p>
              </div>
            )}
          </div>

          {/* CHI TIẾT LỊCH HẸN */}
          <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white">Chi tiết lịch hẹn:</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ngày giờ</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(booking.scheduledTime).toLocaleString('vi-VN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Thời lượng</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {booking.servicePackage.durationMinutes} phút
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Ghi chú khách hàng</p>
              <p className="text-sm italic text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                {booking.additionalNote || 'Không có ghi chú.'}
              </p>
            </div>
          </div>

          {/* THÔNG TIN THANH TOÁN */}
          {paymentInfo && (
            <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white">Thông tin thanh toán:</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phương thức</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {paymentInfo.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Số tiền</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {paymentInfo.amount.toLocaleString('vi-VN')}₫
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Thời gian thanh toán</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(paymentInfo.paymentTime).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              {paymentInfo.failureReason && (
                <div className="space-y-1">
                  <p className="text-xs text-red-500 dark:text-red-400">Lý do thất bại</p>
                  <p className="text-sm italic text-red-800 dark:text-red-200">
                    {paymentInfo.failureReason}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* LỊCH SỬ */}
          <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white">Lịch sử:</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Ngày tạo</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(booking.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Cập nhật lần cuối</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(booking.updatedAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {isPendingConfirmation ? (
            <div className="space-y-3">
              {/* Input lý do khi từ chối */}
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                  Lý do từ chối (tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Nhập lý do từ chối..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 
                            text-gray-900 dark:text-gray-200"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-5 h-5" />
                  <span>Xác nhận</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700"
                >
                  <Ban className="w-5 h-5" />
                  <span>Từ chối</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Đóng
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
