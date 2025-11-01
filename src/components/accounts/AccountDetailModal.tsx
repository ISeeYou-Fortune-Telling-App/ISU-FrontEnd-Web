'use client';

import React, { useState } from 'react';
import { X, Flame, Waves, Anvil, TreePine, Mountain, Loader2 } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';
import { Badge } from '../common/Badge';
import { UserAccount } from '@/types/account/account.type';
import {
  ROLE_LABELS,
  STATUS_LABELS,
  CHINESE_ZODIAC_ICONS,
  WESTERN_ZODIAC_ICONS,
} from '@/constants/account.constant';
import { AccountService } from '@/services/account';

interface AccountDetailModalProps {
  user: UserAccount | null;
  onClose: () => void;
  onActionComplete?: () => void; // callback để reload danh sách
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
      await AccountService.updateUserStatus(user.id, 'VERIFIED');
      alert('✅ Đã duyệt tài khoản.');
      onActionComplete?.();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Không thể duyệt tài khoản.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async () => {
    try {
      setIsLoading(true);
      await AccountService.deleteAccount(user.id);
      alert('🚫 Tài khoản đã bị khóa.');
      onActionComplete?.();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Không thể khóa tài khoản.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblock = async () => {
    try {
      setIsLoading(true);
      await AccountService.updateUserStatus(user.id, 'ACTIVE');
      alert('🔓 Đã mở khóa tài khoản.');
      onActionComplete?.();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Không thể mở khóa tài khoản.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-end"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-sm h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col"
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
            <>
              {user.status === 'UNVERIFIED' && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleApprove}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                  >
                    Duyệt tài khoản
                  </button>
                  <button
                    onClick={handleBlock}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                  >
                    Khóa tài khoản
                  </button>
                </div>
              )}

              {user.status === 'VERIFIED' && (
                <button
                  onClick={handleBlock}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                >
                  Khóa tài khoản
                </button>
              )}

              {user.status === 'BLOCKED' && (
                <button
                  onClick={handleUnblock}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                >
                  Mở khóa tài khoản
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
