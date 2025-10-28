'use client';

import React from 'react';
import { X, Calendar, Mail, Phone, User, Star } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';
import { Badge } from '../common/Badge';
import { UserAccount } from '@/services/account/account.type';
import { ROLE_LABELS, STATUS_LABELS } from '@/services/account/account.constant';

interface UserDetailModalProps {
  user: UserAccount | null;
  onClose: () => void;
}

const DetailItem: React.FC<{
  label: string;
  value?: string | number | null;
}> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
      {label}
    </span>
    <span className="font-medium text-gray-900 dark:text-white">
      {value || '(Trống)'}
    </span>
  </div>
);

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  onClose,
}) => {
  useScrollLock(!!user);
  if (!user) return null;

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) onClose();
  };

  const { profile } = user;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-end"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-sm h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-grow overflow-y-auto p-6 pb-20">
          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={user.avatarUrl || '/default_avatar.jpg'}
                alt="Avatar"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.fullName || '(Không có tên)'}
                </h3>
                <div className="flex space-x-2 mt-1">
                  <Badge
                    type="status"
                    value={STATUS_LABELS[user.status] || user.status}
                  />
                  <Badge
                    type="role"
                    value={ROLE_LABELS[user.role] || user.role}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Thông tin cá nhân */}
          <h4 className="text-base font-semibold text-gray-900 dark:text-white mt-4 mb-3 border-b pb-2 dark:border-gray-700">
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Tiểu sử:
              </p>
              <p className="text-sm italic text-gray-800 dark:text-gray-200">
                {user.profileDescription || '(Chưa có tiểu sử)'}
              </p>
            </div>
          </div>

          {/* Hồ sơ chiêm tinh / tử vi */}
          {profile && (
            <>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mt-6 mb-3 border-b pb-2 dark:border-gray-700">
                Hồ sơ chiêm tinh
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700 dark:text-gray-300">
                <DetailItem
                  label="Cung hoàng đạo"
                  value={profile.zodiacSign}
                />
                <DetailItem
                  label="Con giáp"
                  value={profile.chineseZodiac}
                />
                <DetailItem
                  label="Ngũ hành"
                  value={profile.fiveElements}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            className={`w-full py-3 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 ${
              user.status === 'BLOCKED'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <span>
              {user.status === 'BLOCKED'
                ? 'Mở khóa tài khoản'
                : 'Khóa tài khoản'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
