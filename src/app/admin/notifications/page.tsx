// src/app/admin/notifications/page.tsx
import React from 'react';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Thông báo (Unread: 9)</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Xem tất cả các thông báo hệ thống và hoạt động gần đây.
      </p>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-96 flex items-center justify-center">
        [Placeholder: Bảng Danh sách Thông báo]
      </div>
    </div>
  );
}