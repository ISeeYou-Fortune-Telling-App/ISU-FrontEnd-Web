'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, CreditCard } from 'lucide-react';
import { Badge } from '../common/Badge';
import type { BookingPayment } from '@/types/payments/payments.type';

interface Props {
  payment: BookingPayment | null;
  onClose: () => void;
}

export const PaymentDetailModal: React.FC<Props> = ({ payment, onClose }) => {
  if (!payment) return null;

  const isRefund = payment.paymentStatus === 'REFUNDED';
  const isFailed = payment.paymentStatus === 'FAILED';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 shadow-2xl flex flex-col rounded-xl overflow-hidden border border-gray-400 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-medium text-gray-500">Chi tiết thanh toán</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <Badge type="payment" value={payment.paymentStatus} />

          {/* Khách và Seer */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Khách hàng</p>
              <p className="flex items-center font-medium text-gray-900 dark:text-white">
                <User className="w-4 h-4 mr-2" /> {payment.customer.fullName}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Nhà tiên tri</p>
              <p className="flex items-center font-medium text-gray-900 dark:text-white">
                <User className="w-4 h-4 mr-2" /> {payment.seer.fullName}
              </p>
            </div>
            <div className="col-span-2">
              <p className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                <Calendar className="w-4 h-4 mr-2" />{' '}
                {new Date(payment.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="space-y-1 border rounded-lg p-4 text-sm dark:border-gray-600">
            <p>
              Mã giao dịch: <span className="font-medium">{payment.transactionId}</span>
            </p>
            <p>Dịch vụ: {payment.packageTitle}</p>
            <p>Phương thức: {payment.paymentMethod}</p>
            <p>Trạng thái: {payment.paymentStatus}</p>
            <p>Giá tiền: {payment.amount.toLocaleString('vi-VN')}₫</p>
          </div>

          {/* Lý do thất bại / hoàn tiền */}
          {isRefund && payment.failureReason && (
            <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
              Lý do hoàn tiền: <span className="italic">{payment.failureReason}</span>
            </div>
          )}
          {isFailed && payment.failureReason && (
            <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
              Lý do thất bại: <span className="italic">{payment.failureReason}</span>
            </div>
          )}

          {/* Tổng tiền chi tiết */}
          <div className="border rounded-lg p-4 dark:border-gray-600">
            <p className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3">
              <CreditCard className="w-4 h-4 mr-2" /> {payment.paymentMethod}
            </p>
            <div className="flex justify-between text-sm mb-1">
              <span>Tổng tiền</span>
              <span>{payment.amount.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Phí nền tảng (10%)</span>
              <span>{Math.round(payment.amount * 0.1).toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-green-600 dark:text-green-400">
              <span>{isRefund ? 'Khách hàng nhận lại' : 'Nhà tiên tri nhận được'}</span>
              <span>{Math.round(payment.amount * 0.9).toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
};
