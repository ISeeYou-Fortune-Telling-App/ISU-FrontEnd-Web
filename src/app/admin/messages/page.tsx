// src/app/admin/chat/page.tsx
import React from 'react';

import { MessagesStats } from '../../../components/messages/MessagesStats';
import { MessageTable } from '../../../components/messages/MessageTable';

const paymentStats = [
  {
    label: 'Doanh thu (phí nền tảng)',
    value: 69800,
    colorClass: 'text-green-500',
    moneyType: 'vnđ' as const,
  },
  { label: 'Giao dịch thành công', value: 24, colorClass: 'text-green-500' },
  { label: 'Giao dịch bị hủy', value: 12, colorClass: 'text-yellow-500' },
  { label: 'Đã hoàn tiền', value: 399000, colorClass: 'text-yellow-500', moneyType: '₫' as const },
];

export default function ChatHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Gửi tin nhắn</h1>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Xem lịch sử các cuộc trò chuyện giữa Nhà tiên tri & Khách hàng, AI hỗ trợ & Khách hàng
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MessagesStats />
      </div>
      <MessageTable />
    </div>
  );
}
