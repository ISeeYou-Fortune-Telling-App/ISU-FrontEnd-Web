'use client';
import React from 'react';
import { X, FileText } from 'lucide-react';
import type { Notification, TargetType } from '@/types/notification/notification.type';

const getTargetTypeLabel = (type: TargetType) => {
  switch (type) {
    case 'BOOKING':
      return 'Lịch đặt';
    case 'PAYMENT':
      return 'Thanh toán';
    case 'REPORT':
      return 'Báo cáo';
    case 'CONVERSATION':
      return 'Tin nhắn';
    case 'ACCOUNT':
      return 'Tài khoản';
    case 'SERVICE_PACKAGES':
      return 'Gói dịch vụ';
    case 'SERVICE_REVIEWS':
      return 'Đánh giá';
    default:
      return type;
  }
};

interface NotificationDetailModalProps {
  notification: Notification;
  onClose: () => void;
}

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  notification,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 shadow-2xl flex flex-col rounded-xl overflow-hidden border border-gray-400 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-400 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết thông báo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {/* Type & Time */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-bold">
              {getTargetTypeLabel(notification.targetType)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(notification.createdAt).toLocaleString('vi-VN')}
            </span>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tiêu đề
            </label>
            <div className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {notification.notificationTitle}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Nội dung
            </label>
            <div className="w-full min-h-[120px] p-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white whitespace-pre-wrap">
              {notification.notificationBody}
            </div>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Hình ảnh đính kèm
            </label>
            <div className="w-full h-48 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
              {notification.imageUrl ? (
                <img
                  src={notification.imageUrl}
                  alt="Attachment"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <FileText className="w-8 h-8 mb-2" />
                  <span className="text-sm">Không có hình ảnh</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-400 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
