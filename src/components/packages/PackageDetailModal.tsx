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
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { ServicePackage } from '@/types/packages/package.type';
import { getCategoryDisplay, getCategoryColorClass } from '@/utils/packageHelpers';

interface PackageDetailModalProps {
  package: ServicePackage | null;
  onClose: () => void;
  onHide?: (id: string, reason: string) => void;
  onDelete?: (id: string) => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  package: pkg,
  onClose,
  onHide,
  onDelete,
}) => {
  const [hideReason, setHideReason] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-end"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-md h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col"
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
                    src={pkg.seer.avatarUrl}
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
                         max-h-40 overflow-y-auto whitespace-pre-wrap"
            >
              {pkg.packageContent}
            </div>
          </div>

          {/* THÔNG TIN DỊCH VỤ */}
          <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white">Thông tin dịch vụ:</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Danh mục</p>
                <div
                  className={`inline-block px-2 py-1 rounded-md text-xs ${getCategoryColorClass(
                    pkg.category,
                  )}`}
                >
                  {getCategoryDisplay(pkg.category)}
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
            <div className="flex justify-around items-center text-sm py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
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
          {isHidden && (
            <div className="space-y-1 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-red-500 dark:text-red-400">Lý do ẩn bài viết</p>
              <p className="text-sm italic text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {hideReason || 'Không có lý do cụ thể'}
              </p>
            </div>
          )}

          {/* NHẬP LÝ DO ẨN (khi chưa ẩn) */}
          {isAvailable && (
            <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Lý do ẩn bài viết (tùy chọn)
              </p>
              <textarea
                value={hideReason}
                onChange={(e) => setHideReason(e.target.value)}
                placeholder="Nhập lý do nếu muốn ẩn bài viết này..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* FOOTER - Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {showDeleteConfirm ? (
            // Confirmation Dialog
            <div className="space-y-3">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                ⚠️ Bạn có chắc chắn muốn xóa gói dịch vụ này?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                             rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          ) : (
            // Normal Actions
            <div className="flex space-x-3">
              <button
                onClick={handleHide}
                disabled={!isAvailable || !hideReason.trim()}
                className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center space-x-2
                  ${
                    !isAvailable || !hideReason.trim()
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                title={!isAvailable ? 'Gói đã ẩn' : !hideReason.trim() ? 'Cần nhập lý do' : ''}
              >
                <EyeOff className="w-4 h-4" />
                <span>Ẩn bài viết</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium 
               hover:bg-red-700 flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
