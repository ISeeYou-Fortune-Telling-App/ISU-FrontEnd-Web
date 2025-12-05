'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { MessagesStats } from '../../../components/messages/MessagesStats';

const MessageTable = dynamic(
  () =>
    import('../../../components/messages/MessageTable').then((mod) => ({
      default: mod.MessageTable,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700 h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    ),
  },
);

export default function ChatHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Gữi tin nhắn</h1>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Gữi tin nhắn tới các nhà tiên tri và khách hàng
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MessagesStats />
      </div>

      <div>
        <MessageTable />
      </div>
    </div>
  );
}
