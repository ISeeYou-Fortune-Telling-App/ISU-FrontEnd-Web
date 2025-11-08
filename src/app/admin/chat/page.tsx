// src/app/admin/chat/page.tsx
import React from 'react';

import { ChatHistoryStats } from '../../../components/chatHistory/ChatHistoryStats';
import { ConversationTable } from '../../../components/chatHistory/ChatHistoryTable';

const paymentStats = [
  { label: 'Nhà tiên tri - Khách hàng', value: 20, colorClass: 'text-yellow-500' },
  { label: 'AI hỗ trợ - Khách hàng', value: 10, colorClass: 'text-blue-500' },
  { label: 'Đang hoạt động', value: 3, colorClass: 'text-green-500' },
  { label: 'Tổng số tin nhắn', value: 1234556, colorClass: 'text-gray-500' },
];

export default function ChatHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Lịch sử chat</h1>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Xem lịch sử các cuộc trò chuyện giữa Nhà tiên tri & Khách hàng, AI hỗ trợ & Khách hàng
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ChatHistoryStats />
      </div>
      <ConversationTable />
    </div>
  );
}
