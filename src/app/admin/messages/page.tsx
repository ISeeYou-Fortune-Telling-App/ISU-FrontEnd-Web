'use client';

import React, { useEffect } from 'react';
import { MessagesStats } from '../../../components/messages/MessagesStats';
import { MessageTable } from '../../../components/messages/MessageTable';

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
