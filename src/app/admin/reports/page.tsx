import React from 'react';
import { ReportsTable } from '@/components/reports/ReportsTable';
import { ReportsStats } from '@/components/reports/ReportsStats';

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportsStats />
      </div>
      <ReportsTable />
    </div>
  );
}
