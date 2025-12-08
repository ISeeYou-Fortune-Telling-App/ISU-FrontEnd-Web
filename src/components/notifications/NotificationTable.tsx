/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Trash2, Loader2 } from 'lucide-react';
import { notificationService } from '@/services/notification/notification.service';
import {
  Notification as NotificationType,
  TargetType,
} from '@/types/notification/notification.type';
import { Badge } from '@/components/common/Badge';
import { useScrollToTopOnPageChange } from '@/hooks/useScrollToTopOnPageChange';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import Swal from 'sweetalert2';
import { NotificationDetailModal } from './NotificationDetailModal';

const ITEMS_PER_PAGE = 10;

const getTargetTypeLabel = (type: TargetType) => {
  switch (type) {
    case TargetType.BOOKING:
      return 'Lịch đặt';
    case TargetType.PAYMENT:
      return 'Thanh toán';
    case TargetType.REPORT:
      return 'Báo cáo';
    case TargetType.CONVERSATION:
      return 'Tin nhắn';
    case TargetType.ACCOUNT:
      return 'Tài khoản';
    case TargetType.SERVICE_PACKAGES:
      return 'Gói dịch vụ';
    case TargetType.SERVICE_REVIEWS:
      return 'Đánh giá';
    default:
      return type;
  }
};

export const NotificationTable: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [paging, setPaging] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const tableRef = useRef<HTMLDivElement | null>(null);

  // Scroll to top when page changes
  useScrollToTopOnPageChange(paging.page, tableRef);

  const fetchNotifications = useCallback(async (page = 1, showSkeleton = false) => {
    try {
      if (showSkeleton) setLoading(true);
      else setIsRefreshing(true);

      const res = await notificationService.getMyNotifications({
        page,
        limit: ITEMS_PER_PAGE,
        sortBy: 'createdAt',
        sortType: 'desc',
      });

      setNotifications(res.data as unknown as NotificationType[]);
      setPaging({
        page: (res.paging?.page ?? 0) + 1,
        totalPages: res.paging?.totalPages ?? 1,
        total: res.paging?.total ?? res.data.length,
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1, true);
  }, [fetchNotifications]);

  useEffect(() => {
    if (!loading) fetchNotifications(paging.page, false);
  }, [paging.page]);

  const goToNextPage = () => {
    if (paging.page < paging.totalPages && !isRefreshing) {
      setPaging((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const goToPrevPage = () => {
    if (paging.page > 1 && !isRefreshing) {
      setPaging((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleViewDetail = async (notification: NotificationType) => {
    // Mark as read immediately in UI for instant feedback
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
      );

      // Then call API
      try {
        await notificationService.markAsRead(notification.id);
      } catch (error) {
        console.error('Error marking as read:', error);
        // Revert on error
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, isRead: false } : n)),
        );
      }
    }

    // Open modal with updated notification
    setSelectedNotification({ ...notification, read: true });
  };

  const handleDelete = async (notification: NotificationType, e: React.MouseEvent) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: `Bạn có chắc chắn muốn xóa thông báo "${notification.notificationTitle}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
    });

    if (result.isConfirmed) {
      try {
        setDeletingId(notification.id);
        await notificationService.deleteNotification(notification.id);
        await Swal.fire({
          title: 'Đã xóa!',
          text: 'Thông báo đã được xóa thành công.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
        await fetchNotifications(paging.page, false);
      } catch (error: any) {
        console.error('❌ Lỗi khi xóa thông báo:', error);
        Swal.fire({
          title: 'Lỗi!',
          text: error?.response?.data?.message || 'Không thể xóa thông báo',
          icon: 'error',
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      ref={tableRef}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700"
    >
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-400 dark:border-gray-700 relative pt-2 pr-4">
        {isRefreshing && (
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 flex items-center justify-center backdrop-blur-sm pointer-events-none z-10">
            <div
              className="h-6 w-6 rounded-full border-b-2 border-indigo-600 animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
          </div>
        )}

        <table
          className="min-w-full divide-y divide-gray-400 dark:divide-gray-700 table-fixed"
          style={{ tableLayout: 'fixed', width: '100%' }}
        >
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="w-[25%] px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Tiêu đề
              </th>
              <th className="w-[35%] px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Nội dung
              </th>
              <th className="w-[10%] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Loại
              </th>
              <th className="w-[10%] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Thời gian
              </th>
              <th className="w-[10%] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-400 dark:divide-gray-700 relative">
            {notifications.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-gray-500 dark:text-gray-400 italic"
                >
                  Không có thông báo nào
                </td>
              </tr>
            ) : (
              notifications.map((notification) => (
                <tr
                  key={notification.id}
                  onClick={() => handleViewDetail(notification)}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer ${
                    notification.read === false ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm ${
                        notification.read === false
                          ? 'text-gray-900 dark:text-white font-semibold'
                          : 'text-gray-700 dark:text-gray-300'
                      } line-clamp-2`}
                    >
                      {notification.notificationTitle}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {notification.notificationBody}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge type="expertise" value={getTargetTypeLabel(notification.targetType)} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(notification.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(notification.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center relative">
                    {' '}
                    {/* Thêm relative vào chính thẻ td */}
                    {/* Badge nằm độc lập ở đây, dính chặt vào góc trên phải của ô */}
                    {notification.read === false && (
                      <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm z-10">
                        1
                      </span>
                    )}
                    {/* Nút xóa vẫn căn giữa/phải bình thường */}
                    <div className="flex justify-end items-center pr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification, e);
                        }}
                        disabled={deletingId === notification.id}
                        className="text-red-500 hover:text-red-700 p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Xóa thông báo"
                      >
                        {deletingId === notification.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-400 dark:border-gray-700 mt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Trang {paging.page}/{paging.totalPages} • {paging.total} thông báo
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={paging.page <= 1 || isRefreshing}
            className={`p-2 rounded-md transition ${
              paging.page <= 1 || isRefreshing
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={goToNextPage}
            disabled={paging.page >= paging.totalPages || isRefreshing}
            className={`p-2 rounded-md transition ${
              paging.page >= paging.totalPages || isRefreshing
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
};
