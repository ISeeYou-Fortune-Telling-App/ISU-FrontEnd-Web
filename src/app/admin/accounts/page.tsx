// src/app/admin/accounts/page.tsx
import React from 'react';

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Tài khoản (Users: 12)</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Nơi quản lý danh sách người dùng, phân quyền, và khóa/mở khóa tài khoản.
      </p>
      
      {/* Thêm Bảng (Table) quản lý người dùng vào đây */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-96 flex items-center justify-center">
        [Placeholder: Bảng Danh sách Tài khoản]
      </div>
    </div>
  );
}