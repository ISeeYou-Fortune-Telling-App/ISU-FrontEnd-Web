/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import {
  X,
  ThumbsUp,
  ThumbsDown,
  Image as ImageIcon,
  EyeOff,
  Trash2,
  Star,
  Clock,
  DollarSign,
  AlertTriangle,
  Ban,
  Clock as ClockIcon,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { Badge } from '../common/Badge';
import { ServicePackage } from '@/types/packages/package.type';
import { ReportsService } from '@/services/reports/reports.service';

interface PackageDetailModalProps {
  package: ServicePackage | null;
  onClose: () => void;
  onHide?: (id: string, reason: string) => void;
  onDelete?: (id: string) => void;
  onActionComplete?: () => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  package: pkg,
  onClose,
  onHide,
  onDelete,
  onActionComplete,
}) => {
  const [hideReason, setHideReason] = useState('');
  const [suspendDays, setSuspendDays] = useState(7);

  // lock scroll khi modal mở
  const useScrollLock = (locked: boolean) => {
    React.useEffect(() => {
      if (locked) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [locked]);
  };

  useScrollLock(!!pkg);

  if (!pkg) return null;

  const isHidden = pkg.status === 'HIDDEN';
  const isAvailable = pkg.status === 'AVAILABLE';

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleHide = () => {
    if (onHide && hideReason.trim()) {
      onHide(pkg.id, hideReason);
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(pkg.id);
      onClose();
    }
  };

  const handleWarning = async (reportId: string) => {
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
        await ReportsService.handleViolation(reportId, {
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
        if (onActionComplete) onActionComplete();
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

  const handleSuspend = async (reportId: string) => {
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
        await ReportsService.handleViolation(reportId, {
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
        if (onActionComplete) onActionComplete();
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

  const handleBan = async (reportId: string) => {
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
        await ReportsService.handleViolation(reportId, {
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
        if (onActionComplete) onActionComplete();
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

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] bg-white dark:bg-gray-800 shadow-2xl rounded-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content - Scrollable */}
        <div className="flex-grow overflow-y-auto p-6 pb-20 space-y-5">
          {/* HEADER */}
          <div className="pb-4 border-b border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                Chi tiết gói dịch vụ
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 2 cột: Seer & Status */}
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nhà tiên tri</p>
                <div className="flex items-center space-x-2">
                  <img
                    src={pkg.seer.avatarUrl || '/default_avatar.jpg'}
                    alt={pkg.seer.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white block">
                      {pkg.seer.fullName}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>
                        {pkg.seer.avgRating.toFixed(1)} ({pkg.seer.totalRates})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Trạng thái</p>
                <Badge type={'status' as any} value={pkg.status} />
                <div className="mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ngày tạo</p>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {new Date(pkg.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TIÊU ĐỀ BÀI VIẾT */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Tiêu đề bài viết</p>
            <input
              type="text"
              value={pkg.packageTitle}
              readOnly
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
            />
          </div>

          {/* NỘI DUNG BÀI VIẾT */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Nội dung bài viết</p>
            <div
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
                         bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                         max-h-40 overflow-y-auto prose prose-sm dark:prose-invert max-w-none
                         prose-headings:font-bold prose-h1:text-lg prose-h2:text-base prose-h3:text-sm
                         prose-p:my-2 prose-ul:my-2 prose-li:my-1"
              dangerouslySetInnerHTML={{
                __html: pkg.packageContent
                  .replace(/\\n/g, '\n')
                  .replace(/\n/g, '<br />')
                  .replace(/#{3}\s+(.+?)(<br \/>|$)/g, '<h3>$1</h3>')
                  .replace(/#{2}\s+(.+?)(<br \/>|$)/g, '<h2>$1</h2>')
                  .replace(/#{1}\s+(.+?)(<br \/>|$)/g, '<h1>$1</h1>')
                  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.+?)\*/g, '<em>$1</em>'),
              }}
            />
          </div>

          {/* THÔNG TIN DỊCH VỤ */}
          <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white">Thông tin dịch vụ:</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Danh mục</p>
                <div className="flex flex-wrap gap-1">
                  {pkg.categories.map((cat) => (
                    <Badge key={cat.id} type="expertise" value={cat.name} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Thời lượng</p>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <p className="font-medium">{pkg.durationMinutes} phút</p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Giá tiền</p>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <p className="font-medium text-green-600">
                    {pkg.price.toLocaleString('vi-VN')} VND
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MEDIA */}
          <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Media</p>
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
              {pkg.imageUrl ? (
                <img
                  src={pkg.imageUrl}
                  alt={pkg.packageTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* THỐNG KÊ TƯƠNG TÁC */}
          <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white">Thống kê tương tác:</p>
            <div className="flex justify-around items-center text-sm py-3 dark:bg-gray-700 rounded-lg">
              <div className="flex flex-col items-center">
                <ThumbsUp className="w-5 h-5 text-blue-600 mb-1" />
                <span className="font-bold text-blue-600">{pkg.likeCount}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Thích</span>
              </div>
              <div className="flex flex-col items-center">
                <ThumbsDown className="w-5 h-5 text-red-600 mb-1" />
                <span className="font-bold text-red-600">{pkg.dislikeCount}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Không thích</span>
              </div>
              {/* <div className="flex flex-col items-center">
                <MessageCircle className="w-5 h-5 text-yellow-600 mb-1" />
                <span className="font-bold text-yellow-600">0</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Bình luận</span>
              </div> */}
            </div>
          </div>

          {/* LÝ DO ẨN (nếu đã ẩn) */}
          {isHidden && pkg.rejectionReason && (
            <div className="space-y-1 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-red-500 dark:text-red-400">Lý do ẩn bài viết</p>
              <p className="text-sm italic text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {pkg.rejectionReason}
              </p>
            </div>
          )}

          {/* REPORTS (nếu có) */}
          {pkg.reports && pkg.reports.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white">
                Báo cáo vi phạm ({pkg.reports.length}):
              </p>
              <div className="space-y-3">
                {pkg.reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <img
                          src={report.reporter.avatarUrl || '/default_avatar.jpg'}
                          alt={report.reporter.username}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.reporter.username}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Badge type="status" value={report.reportStatus} />
                        <Badge type="expertise" value={report.reportType} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {report.reportDescription}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleWarning(report.id)}
                        className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        Cảnh cáo
                      </button>
                      <button
                        onClick={() => handleSuspend(report.id)}
                        className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-1"
                      >
                        <ClockIcon className="w-3 h-3" />
                        Tạm khóa
                      </button>
                      <button
                        onClick={() => handleBan(report.id)}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <Ban className="w-3 h-3" />
                        Cấm
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER - Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {isAvailable ? (
            <div className="space-y-3">
              {/* Input lý do khi ẩn */}
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                  Lý do ẩn bài viết (tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Nhập lý do ẩn bài viết..."
                  value={hideReason}
                  onChange={(e) => setHideReason(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 
                            text-gray-900 dark:text-gray-200"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleHide}
                  disabled={!hideReason.trim()}
                  className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2
                    ${
                      !hideReason.trim()
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                >
                  <EyeOff className="w-5 h-5" />
                  <span>Ẩn bài viết</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Xóa</span>
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
      </div>
    </div>
  );
};
