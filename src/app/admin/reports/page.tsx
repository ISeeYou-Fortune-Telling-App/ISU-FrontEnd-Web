import React from 'react';
import { ReportsTable } from '@/components/reports/ReportsTable';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Quản lý báo cáo vi phạm
        </h1>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Xem và xử lý các báo cáo vi phạm từ người dùng
        </p>
      </div>

      <ReportsTable />
    </div>
  );
}
