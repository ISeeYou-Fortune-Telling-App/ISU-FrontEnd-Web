// src/app/admin/chat/page.tsx
import React from 'react';

export default function ChatHistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lịch sử Chat (New: 5)</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Xem lại lịch sử tư vấn chat giữa người dùng và Seer.
      </p>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-96 flex items-center justify-center">
        [Placeholder: Danh sách Phiên Chat và Lọc]
      </div>
    </div>
  );
}