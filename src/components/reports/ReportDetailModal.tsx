'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, Ban, Clock } from 'lucide-react';
import Swal from 'sweetalert2';
import type { Report } from '@/types/reports/reports.type';
import { ReportsService } from '@/services/reports/reports.service';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  VIEWED: 'Đã xem',
  RESOLVED: 'Đã giải quyết',
  REJECTED: 'Từ chối',
};

const ACTION_LABELS: Record<string, string> = {
  NO_ACTION: 'Chưa xử lý',
  WARNING_ISSUED: 'Cảnh cáo',
  CONTENT_REMOVED: 'Gỡ nội dung',
  USER_BANNED: 'Cấm TK',
  TEMPORARY_SUSPENSION: 'Tạm khóa',
};

interface ReportDetailModalProps {
  report: Report | null;
  onClose: () => void;
  onActionComplete: () => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onActionComplete,
}) => {
  const [suspendDays] = useState(7);

  // Lock scroll khi modal mở
  React.useEffect(() => {
    if (report) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [report]);

  if (!report) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleWarning = async () => {
    const result = await Swal.fire({
      title: 'Cảnh cáo người dùng',
      input: 'textarea',
      inputLabel: 'Lý do cảnh cáo',
      inputPlaceholder: 'Nhập lý do cảnh cáo...',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Cảnh cáo',
      cancelButtonText: 'Hủy',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
      inputValidator: (value) => {
        if (!value) return 'Vui lòng nhập lý do!';
      },
    });

    if (result.isConfirmed) {
      try {
        await ReportsService.handleViolation(report.id, {
          action: 'WARNING',
          actionReason: result.value,
        });
        await Swal.fire({
          title: 'Thành công!',
          text: 'Đã gửi cảnh cáo',
          icon: 'success',
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
        onActionComplete();
        onClose();
      } catch (error) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không thể gửi cảnh cáo',
          icon: 'error',
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
      }
    }
  };

  const handleSuspend = async () => {
    const result = await Swal.fire({
      title: 'Tạm khóa tài khoản',
      html: `
        <div class="text-left space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1">Số ngày khóa:</label>
            <input type="number" id="suspendDays" class="swal2-input" value="${suspendDays}" min="1" max="365" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Lý do:</label>
            <textarea id="suspendReason" class="swal2-textarea" placeholder="Nhập lý do tạm khóa..."></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Tạm khóa',
      cancelButtonText: 'Hủy',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
      preConfirm: () => {
        const days = (document.getElementById('suspendDays') as HTMLInputElement)?.value;
        const reason = (document.getElementById('suspendReason') as HTMLTextAreaElement)?.value;
        if (!reason) {
          Swal.showValidationMessage('Vui lòng nhập lý do!');
          return false;
        }
        return { days: parseInt(days), reason };
      },
    });

    if (result.isConfirmed && result.value) {
      try {
        await ReportsService.handleViolation(report.id, {
          action: 'SUSPEND',
          actionReason: result.value.reason,
          suspendDays: result.value.days,
        });
        await Swal.fire({
          title: 'Thành công!',
          text: `Đã tạm khóa ${result.value.days} ngày`,
          icon: 'success',
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
        onActionComplete();
        onClose();
      } catch (error) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không thể tạm khóa tài khoản',
          icon: 'error',
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
      }
    }
  };

  const handleBan = async () => {
    const result = await Swal.fire({
      title: 'Cấm vĩnh viễn',
      input: 'textarea',
      inputLabel: 'Lý do cấm',
      inputPlaceholder: 'Nhập lý do cấm vĩnh viễn...',
      showCancelButton: true,
      confirmButtonColor: '#991b1b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Cấm vĩnh viễn',
      cancelButtonText: 'Hủy',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
      inputValidator: (value) => {
        if (!value) return 'Vui lòng nhập lý do!';
      },
    });

    if (result.isConfirmed) {
      try {
        await ReportsService.handleViolation(report.id, {
          action: 'BAN',
          actionReason: result.value,
        });
        await Swal.fire({
          title: 'Thành công!',
          text: 'Đã cấm tài khoản vĩnh viễn',
          icon: 'success',
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
        onActionComplete();
        onClose();
      } catch (error) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không thể cấm tài khoản',
          icon: 'error',
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
      }
    }
  };

  const handleNoAction = async () => {
    const result = await Swal.fire({
      title: 'Không xử lý',
      input: 'textarea',
      inputLabel: 'Ghi chú (tùy chọn)',
      inputPlaceholder: 'Nhập lý do không xử lý...',
      showCancelButton: true,
      confirmButtonColor: '#6b7280',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
    });

    if (result.isConfirmed) {
      try {
        await ReportsService.updateReportStatus(report.id, {
          status: 'NO_ACTION',
          actionType: 'NO_ACTION',
          note: result.value || undefined,
        });
        await Swal.fire({
          title: 'Thành công!',
          text: 'Đã cập nhật trạng thái',
          icon: 'success',
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
        onActionComplete();
        onClose();
      } catch (error) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không thể cập nhật',
          icon: 'error',
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-400 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết báo cáo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {/* Reporter & Reported */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Người báo cáo</p>
              <div className="flex items-center space-x-2">
                <img
                  src={report.reporter.avatarUrl || '/default_avatar.jpg'}
                  alt={report.reporter.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {report.reporter.username}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Người bị báo cáo</p>
              <div className="flex items-center space-x-2">
                <img
                  src={report.reported.avatarUrl || '/default_avatar.jpg'}
                  alt={report.reported.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {report.reported.username}
                </span>
              </div>
            </div>
          </div>

          {/* Report Info */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Loại báo cáo</p>
              <p className="font-medium text-gray-900 dark:text-white">{report.reportType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Mô tả</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {report.reportDescription || 'Không có mô tả'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Đối tượng</p>
              <p className="font-medium text-gray-900 dark:text-white">{report.targetReportType}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Trạng thái</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {STATUS_LABELS[report.reportStatus] || report.reportStatus}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hành động</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {ACTION_LABELS[report.actionType] || report.actionType}
                </p>
              </div>
            </div>
            {report.note && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ghi chú</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {report.note}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWarning}
              className="py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Cảnh cáo</span>
            </button>
            <button
              onClick={handleSuspend}
              className="py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Tạm khóa</span>
            </button>
            <button
              onClick={handleBan}
              className="py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
            >
              <Ban className="w-4 h-4" />
              <span>Cấm vĩnh viễn</span>
            </button>
            <button
              onClick={handleNoAction}
              className="py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Không xử lý
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
