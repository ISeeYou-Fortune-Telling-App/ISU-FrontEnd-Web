'use client';

import React, { useEffect, useState } from 'react';
import { AccountService } from '@/services/account/account.service';

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await AccountService.getCurrentUser();
      setUser(data);
    };
    loadProfile();
  }, []);

  if (!user)
    return <p className="text-center text-gray-500 mt-10">Đang tải thông tin...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center space-x-4">
        <img
          src={user.avatarUrl}
          alt={user.fullName}
          className="w-20 h-20 rounded-full border border-gray-300 object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {user.fullName}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">{user.role}</p>
        </div>
      </div>
      <div className="mt-6 border-t pt-4 text-sm text-gray-600 dark:text-gray-300">
        <p>📱 Số điện thoại: {user.phone || 'Chưa cập nhật'}</p>
        <p>👤 Giới tính: {user.gender || 'Chưa rõ'}</p>
        <p>🎂 Ngày sinh: {user.birthDate?.slice(0, 10)}</p>
        <p>📝 Mô tả: {user.profileDescription || 'Chưa có mô tả'}</p>
      </div>
    </div>
  );
}
