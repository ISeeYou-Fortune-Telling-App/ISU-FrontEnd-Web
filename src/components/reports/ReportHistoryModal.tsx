'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { ReportsService } from '@/services/reports/reports.service';
import type { Report } from '@/types/reports/reports.type';
import { Badge } from '@/components/common/Badge';

interface ReportHistoryModalProps {
  userId: string;
  username: string;
  type: 'reporter' | 'reported';
  onClose: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  VIEWED: 'Đã xem',
  RESOLVED: 'Đã giải quyết',
  REJECTED: 'Từ chối',
};

export function ReportHistoryModal({ userId, username, type, onClose }: ReportHistoryModalProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lock scroll khi modal mở
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gọi API tương ứng
        const response =
          type === 'reporter'
            ? await ReportsService.getReportsByReporter(userId, {
                page: 1,
                limit: 50,
                sortType: 'desc',
                sortBy: 'createdAt',
              })
            : await ReportsService.getReportsByReportedUser(userId, {
                page: 1,
                limit: 50,
                sortType: 'desc',
                sortBy: 'createdAt',
              });

        setReports(response.data || []);
      } catch (err: any) {
        console.error('Error fetching report history:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId, type]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-400 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Lịch sử {type === 'reporter' ? 'báo cáo' : 'bị báo cáo'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Người dùng: <span className="font-semibold">{username}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Đang tải lịch sử...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Không có lịch sử {type === 'reporter' ? 'báo cáo' : 'bị báo cáo'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-400 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          type === 'reporter'
                            ? report.reported.avatarUrl
                            : report.reporter.avatarUrl
                        }
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {type === 'reporter'
                            ? `Báo cáo: ${report.reported.username}`
                            : `Bị báo cáo bởi: ${report.reporter.username}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(report.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <Badge type="AccountStatus" value={STATUS_LABELS[report.reportStatus]} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        Loại vi phạm:
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        {report.reportType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        Đối tượng:
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {report.targetReportType}
                      </span>
                    </div>

                    {report.reportDescription && (
                      <div>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                          Mô tả:
                        </span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {report.reportDescription}
                        </p>
                      </div>
                    )}

                    {report.note && (
                      <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                        <span className="text-xs font-semibold text-yellow-800 dark:text-yellow-400">
                          Ghi chú:
                        </span>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          {report.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-400 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
