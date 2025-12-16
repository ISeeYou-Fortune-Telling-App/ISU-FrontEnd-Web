'use client';

import React, { useState } from 'react';
import { X, Flame, Waves, Anvil, TreePine, Mountain, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { useScrollLock } from '../../hooks/useScrollLock';
import { Badge } from '../common/Badge';
import { UserAccount } from '@/types/account/account.type';
import { handleImageError } from '@/utils/imageHelpers';
import {
  ROLE_LABELS,
  STATUS_LABELS,
  CHINESE_ZODIAC_ICONS,
  WESTERN_ZODIAC_ICONS,
} from '@/constants/account.constant';
import { AccountService } from '@/services/account/account.service';

interface AccountDetailModalProps {
  user: UserAccount | null;
  onClose: () => void;
  onActionComplete?: () => void;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</span>
    <span className="font-medium text-gray-900 dark:text-white">{value || '(Trống)'}</span>
  </div>
);

const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  Hỏa: <Flame className="w-4 h-4 text-red-500 inline-block mr-1" />,
  Thủy: <Waves className="w-4 h-4 text-blue-500 inline-block mr-1" />,
  Thổ: <Mountain className="w-4 h-4 text-yellow-600 inline-block mr-1" />,
  Kim: <Anvil className="w-4 h-4 text-gray-500 inline-block mr-1" />,
  Mộc: <TreePine className="w-4 h-4 text-green-600 inline-block mr-1" />,
};

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  user,
  onClose,
  onActionComplete,
}) => {
  useScrollLock(!!user);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const { profile } = user;

  const getProfileTitle = () => {
    switch (user.role) {
      case 'CUSTOMER':
        return 'Hồ sơ khách hàng';
      case 'SEER':
      case 'UNVERIFIED_SEER':
        return 'Thông tin nhà tiên tri';
      case 'ADMIN':
        return 'Thông tin quản trị viên';
      default:
        return 'Hồ sơ người dùng';
    }
  };

  const getZodiacIcon = (zodiac: string | null | undefined) =>
    zodiac ? WESTERN_ZODIAC_ICONS[zodiac.trim()] || '' : '';

  const getChineseZodiacIcon = (animal: string | null | undefined) =>
    animal ? CHINESE_ZODIAC_ICONS[animal.trim()] || '' : '';

  // 🧩 API hành động
  const handleApprove = async () => {
    try {
      setIsLoading(true);
      await AccountService.approveSeer(user.id, { action: 'APPROVED' });
      await Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã duyệt tài khoản.',
        confirmButtonColor: '#3b82f6',
      });
      onActionComplete?.();
      onClose();
    } catch (err: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err.message || 'Không thể duyệt tài khoản.',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveSeer = async () => {
    try {
      setIsLoading(true);
      await AccountService.approveSeer(user.id, { action: 'APPROVED' });
      await Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã duyệt Seer thành công!',
        confirmButtonColor: '#3b82f6',
      });
      onActionComplete?.();
      onClose();
    } catch (err: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err.message || 'Không thể duyệt Seer.',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async () => {
    try {
      setIsLoading(true);
      await AccountService.updateUserStatus(user.id, 'BLOCKED');
      await Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Tài khoản đã bị khóa.',
        confirmButtonColor: '#3b82f6',
      });
      onActionComplete?.();
      onClose();
    } catch (err: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err.message || 'Không thể khóa tài khoản.',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblock = async () => {
    try {
      setIsLoading(true);
      await AccountService.updateUserStatus(user.id, 'ACTIVE');
      await Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã mở khóa tài khoản.',
        confirmButtonColor: '#3b82f6',
      });
      onActionComplete?.();
      onClose();
    } catch (err: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err.message || 'Không thể mở khóa tài khoản.',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectSeer = async () => {
    const { value: reason } = await Swal.fire({
      title: 'Từ chối Seer',
      text: 'Nhập lý do từ chối:',
      input: 'textarea',
      inputPlaceholder: 'Lý do từ chối...',
      showCancelButton: true,
      confirmButtonText: 'Từ chối',
      cancelButtonText: 'Hủy',
      inputValidator: (value) => {
        if (!value.trim()) {
          return 'Vui lòng nhập lý do từ chối!';
        }
        return null;
      },
    });

    if (reason) {
      try {
        setIsLoading(true);
        await AccountService.approveSeer(user.id, {
          action: 'REJECTED',
          rejectReason: reason,
        });
        await Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Đã từ chối Seer.',
          confirmButtonColor: '#3b82f6',
        });
        onActionComplete?.();
        onClose();
      } catch (err: any) {
        await Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: err.message || 'Không thể từ chối Seer.',
          confirmButtonColor: '#3b82f6',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await AccountService.deleteAccount(user.id);
      await Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Tài khoản đã được xóa vĩnh viễn.',
        confirmButtonColor: '#3b82f6',
      });
      onActionComplete?.();
      onClose();
    } catch (err: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err.message || 'Không thể xóa tài khoản.',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 shadow-2xl rounded-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-grow overflow-y-auto p-4 pb-20">
            {/* Header */}
            <div className="flex justify-between items-start pb-4">
              <div className="flex items-center space-x-3">
                <img
                  className="h-10 w-10 rounded-full object-cover border border-gray-400 dark:border-gray-600 shadow-sm"
                  src={user.avatarUrl || '/default_avatar.jpg'}
                  alt="Avatar"
                  onError={handleImageError}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.fullName || '(Không có tên)'}
                  </h3>
                  <div className="flex space-x-2 mt-1">
                    <Badge type="AccountStatus" value={STATUS_LABELS[user.status] || user.status} />
                    <Badge type="AccountRole" value={ROLE_LABELS[user.role] || user.role} />
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-400 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Thông tin cá nhân */}
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-400 pb-2 dark:border-gray-700">
              Thông tin cá nhân
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700 dark:text-gray-300">
              <DetailItem label="Họ tên" value={user.fullName} />
              <DetailItem label="Giới tính" value={user.gender} />
              <DetailItem label="Email" value={user.email} />
              <DetailItem label="Số điện thoại" value={user.phone} />
              <div className="col-span-2">
                <DetailItem
                  label="Ngày sinh"
                  value={
                    user.birthDate
                      ? new Date(user.birthDate).toLocaleDateString('vi-VN')
                      : '(Không có dữ liệu)'
                  }
                />
              </div>
              <div className="col-span-2 mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tiểu sử:</p>
                <p className="text-sm italic text-gray-800 dark:text-gray-200">
                  {user.profileDescription || '(Chưa có tiểu sử)'}
                </p>
              </div>
            </div>

            {/* Hồ sơ theo vai trò */}
            {profile && (
              <>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mt-6 mb-3 border-b border-gray-400 pb-2 dark:border-gray-700">
                  {getProfileTitle()}
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Cung hoàng đạo
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white flex items-center">
                      <span className="mr-2 text-xl">{getZodiacIcon(profile.zodiacSign)}</span>
                      {profile.zodiacSign || '(Trống)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Con giáp</span>
                    <span className="font-medium text-gray-900 dark:text-white flex items-center">
                      <span className="mr-2 text-xl">
                        {getChineseZodiacIcon(profile.chineseZodiac)}
                      </span>
                      {profile.chineseZodiac || '(Trống)'}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ngũ hành</span>
                    <span className="font-medium text-gray-900 dark:text-white flex items-center">
                      {profile.fiveElements &&
                        ELEMENT_ICONS[profile.fiveElements as keyof typeof ELEMENT_ICONS]}
                      {profile.fiveElements || '(Trống)'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-2">
            {isLoading && (
              <div className="flex items-center justify-center py-2 text-sm text-gray-500">
                <Loader2 className="animate-spin w-4 h-4 mr-2" /> Đang xử lý...
              </div>
            )}

            {!isLoading && (
              <div className="flex space-x-2">
                {/* Approve/Reject buttons for UNVERIFIED_SEER */}
                {user.role === 'UNVERIFIED_SEER' && (
                  <>
                    <button
                      onClick={handleApproveSeer}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                    >
                      Duyệt Seer
                    </button>
                    <button
                      onClick={handleRejectSeer}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                    >
                      Từ chối Seer
                    </button>
                  </>
                )}

                {user.status === 'UNVERIFIED' && user.role !== 'UNVERIFIED_SEER' && (
                  <button
                    onClick={handleApprove}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                  >
                    Duyệt tài khoản
                  </button>
                )}

                {/* Block/Unblock button - Always show for all accounts */}
                {user.status === 'BLOCKED' ? (
                  <button
                    onClick={handleUnblock}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                  >
                    Mở khóa tài khoản
                  </button>
                ) : (
                  <button
                    onClick={handleBlock}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                  >
                    Khóa tài khoản
                  </button>
                )}

                {/* Delete button - Always available */}
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-red-800 hover:bg-red-900 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Xóa vĩnh viễn
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
