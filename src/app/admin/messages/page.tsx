'use client';

import React, { useEffect } from 'react';
import { MessagesStats } from '../../../components/messages/MessagesStats';
import { MessageTable } from '../../../components/messages/MessageTable';

export default function ChatHistoryPage() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-80px)] overflow-hidden">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Gửi tin nhắn</h1>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Gửi tin nhắn tới các nhà tiên tri và khách hàng
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MessagesStats />
      </div>

      <div className="flex-1 overflow-hidden">
        <MessageTable />
      </div>
    </div>
  );
}
