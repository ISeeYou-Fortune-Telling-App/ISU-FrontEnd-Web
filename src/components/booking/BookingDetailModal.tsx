'use client';
import React from 'react';
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
  if (!booking) return null;

  const isPending = booking.status === 'PENDING' || booking.status === 'CONFIRMED';

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const paymentInfo = booking.bookingPaymentInfos?.[0];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-end"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-md h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chi tiết booking</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Khách hàng & Nhà tiên tri */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Khách hàng</p>
              <div className="flex items-center space-x-2">
                <img
                  src={booking.customer.avatarUrl}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {booking.customer.fullName}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nhà tiên tri</p>
              <div className="flex items-center space-x-2">
                <img
                  src={booking.seer.avatarUrl}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {booking.seer.fullName}
                </span>
              </div>
            </div>
          </div>

          {/* Trạng thái */}
          <div className="flex space-x-3">
            <Badge type="status" value={booking.status} />
            <Badge type="payment" value={paymentInfo?.paymentStatus || 'PENDING'} />
          </div>

          {/* Dịch vụ */}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-1">Gói dịch vụ</p>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>{booking.servicePackage.packageTitle}</p>
              <p className="text-gray-500 dark:text-gray-400">
                {booking.servicePackage.packageContent}
              </p>
              <p>
                <strong>Giá:</strong> {booking.servicePackage.price.toLocaleString('vi-VN')}₫
              </p>
              <p>
                <strong>Thời lượng:</strong> {booking.servicePackage.durationMinutes} phút
              </p>
            </div>
          </div>

          {/* Thời gian */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">Thời gian & ghi chú</p>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>
                <Calendar className="inline w-4 h-4 mr-1 text-blue-500" />
                {new Date(booking.scheduledTime).toLocaleString('vi-VN')}
              </p>
              <p className="italic bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                {booking.additionalNote || 'Không có ghi chú.'}
              </p>
            </div>
          </div>

          {/* Thanh toán */}
          {paymentInfo && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                Thông tin thanh toán
              </p>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p>
                  <strong>Phương thức:</strong> {paymentInfo.paymentMethod}
                </p>
                <p>
                  <strong>Thời gian:</strong>{' '}
                  {new Date(paymentInfo.paymentTime).toLocaleString('vi-VN')}
                </p>
                <p>
                  <strong>Số tiền:</strong> {paymentInfo.amount.toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {isPending ? (
            <div className="flex space-x-3">
              <button
                onClick={() => onConfirm(booking.id)}
                className="flex-1 py-3 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Check className="w-5 h-5" />
                <span>Xác nhận</span>
              </button>
              <button
                onClick={() => onCancel(booking.id)}
                className="flex-1 py-3 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700"
              >
                <Ban className="w-5 h-5" />
                <span>Hủy</span>
              </button>
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
      </div>
    </div>
  );
};
