'use client'
import React from 'react';
import { X, Calendar, User, CreditCard } from 'lucide-react';
import { Badge } from '../common/Badge';

interface Payment {
  id: string;
  customer: string;
  seer: string;
  service: string;
  method: string;
  amount: string;
  status: 'Thành công' | 'Đã hoàn tiền' | 'Thất bại';
  time: string;
}

interface PaymentDetailModalProps {
  payment: Payment | null;
  onClose: () => void;
}

export type PaymentStatus = 'Thành công' | 'Thất bại' | 'Đã hoàn tiền';


export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({ payment, onClose }) => {
  if (!payment) return null;

  const isRefund = payment.status === 'Đã hoàn tiền';
  const isFailed = payment.status === 'Thất bại';

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col rounded-l-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-medium text-gray-500">Payment – View Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* Badge trạng thái */}
          <Badge type="payment" value={payment.status} />

          {/* Thông tin khách + seer */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Khách hàng</p>
              <p className="flex items-center font-medium text-gray-900 dark:text-white">
                <User className="w-4 h-4 mr-2" /> {payment.customer}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Nhà tiên tri</p>
              <p className="flex items-center font-medium text-gray-900 dark:text-white">
                <User className="w-4 h-4 mr-2" /> {payment.seer}
              </p>
            </div>
            <div className="col-span-2">
              <p className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                <Calendar className="w-4 h-4 mr-2" /> {payment.time}
              </p>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="space-y-1 border rounded-lg p-4 text-sm dark:border-gray-600">
            <p>Mã giao dịch: <span className="font-medium">{payment.id}</span></p>
            <p>Dịch vụ: {payment.service}</p>
            <p>Trạng thái: {payment.status}</p>
            <p>Giá tiền: {payment.amount}</p>
          </div>

          {/* Lý do hoàn tiền/thất bại */}
          {isRefund && (
            <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
              Lý do hoàn tiền: <span className="italic">Seer bạn hủy đột xuất.</span>
            </div>
          )}
          {isFailed && (
            <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
              Lý do thất bại: <span className="italic">VNPay giao dịch lỗi hoặc tài khoản không đủ số dư.</span>
            </div>
          )}

          {/* Phương thức */}
          <div className="border rounded-lg p-4 dark:border-gray-600">
            <p className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3">
              <CreditCard className="w-4 h-4 mr-2" /> {payment.method}
            </p>
            <div className="flex justify-between text-sm mb-1">
              <span>Tổng tiền</span>
              <span>{isFailed ? '0 VND' : '299.000 VND'}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Phí nền tảng (10%)</span>
              <span>{isFailed ? '0 VND' : '29.900 VND'}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-green-600 dark:text-green-400">
              <span>{isRefund ? 'Khách hàng nhận được' : 'Nhà tiên tri nhận được'}</span>
              <span>{isFailed ? '0 VND' : '261.100 VND'}</span>
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
      </div>
    </div>
  );
};
