'use client'
import React, { useState } from 'react';
import { X, Calendar, User, Clock, Check, Ban } from 'lucide-react'; 
import { Badge, BadgeStatus } from '../common/Badge'; 

// ==================== INTERFACE ====================
export interface AppointmentDetail {
  id: number;
  clientName: string;
  seerName: string;
  service: string;
  category?: string;
  dateTime: string;
  duration: string;
  price: string;
  status: 'Hoàn thành' | 'Chờ xác nhận' | 'Đang diễn ra' | 'Bị hủy' | string;
  paymentStatus: 'Đã thanh toán' | 'Chờ thanh toán' | 'Đã hoàn tiền' | string;
  note: string;
  cancellationReason?: string;
  confirmationTime?: string;
  history?: { label: string; value: string }[];
}

interface AppointmentDetailModalProps {
  appointment: AppointmentDetail | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
  onCancel: (id: number, reason: string) => void;
}

// ==================== COMPONENT ====================
export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({ appointment, onClose, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  const useScrollLock = (locked: boolean) => {};
  useScrollLock(!!appointment);

  if (!appointment) return null;

  const isPendingConfirmation = appointment.status === 'Chờ xác nhận';
  const isCancelled = appointment.status === 'Bị hủy';

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => onConfirm(appointment.id);
  const handleCancel = () => onCancel(appointment.id, reason);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-end"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-md h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-grow overflow-y-auto p-6 pb-20 space-y-5">
          
          {/* HEADER */}
          <div className="pb-4 border-b border-dashed dark:border-gray-700">
            <div className='flex justify-between items-start'>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">Chi tiết lịch hẹn</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 flex-shrink-0">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 2 cột: khách hàng & nhà tiên tri */}
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Khách hàng</p>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{appointment.clientName}</span>
                </div>
                <div className="mt-2">
                  <Badge type="status" value={appointment.status as BadgeStatus} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nhà tiên tri</p>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{appointment.seerName}</span>
                </div>
                <div className="mt-2">
                  <Badge type="payment" value={appointment.paymentStatus} />
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
                <p className="font-medium">{appointment.service}</p>
              </div>
              {appointment.category && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Danh mục</p>
                  <p className="font-medium">{appointment.category}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Thời lượng</p>
                <p className="font-medium">{appointment.duration}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Giá tiền</p>
                <p className="font-medium">{appointment.price}</p>
              </div>
            </div>
          </div>

          {/* CHI TIẾT LỊCH HẸN */}
          <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white">Chi tiết lịch hẹn:</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ngày giờ</p>
                <p className="font-medium">{appointment.dateTime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Thời lượng</p>
                <p className="font-medium">{appointment.duration}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Ghi chú khách hàng</p>
              <p className="text-sm italic text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                {appointment.note || 'Không có ghi chú.'}
              </p>
            </div>
          </div>

          {/* LỊCH SỬ */}
          {appointment.history && (
            <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white">Lịch sử:</p>
              <div className="space-y-1 text-sm">
                {appointment.history.map((h, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{h.label}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{h.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LÝ DO HỦY */}
          {(isCancelled && appointment.cancellationReason) && (
            <div className="space-y-1 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-red-500 dark:text-red-400">Lý do hủy</p>
              <p className="text-sm italic text-red-800 dark:text-red-200">{appointment.cancellationReason}</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {isPendingConfirmation ? (
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
                disabled={!reason}
                className={`flex-1 py-3 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 ${
                  !reason ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <Ban className="w-5 h-5" />
                <span>Từ chối</span>
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
