import React from 'react';
import { NotificationTable } from '../../../components/notifications/NotificationTable';

export default function NotificationPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Thông báo</h1>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Xem các thông báo gần đây
        </p>
      </div>
      <NotificationTable />
    </div>
  );
}
