import React from 'react';

import { AccountStats } from '../../../components/accounts/AccountStats';
import { CertificateTable } from '../../../components/certificates/CertificateTable';

const userStats = [
  { label: 'Tổng số chứng chỉ', value: 1983, colorClass: 'text-blue-500' },
  { label: 'Đã duyệt', value: 24, colorClass: 'text-green-500' },
  { label: 'Chờ duyệt', value: 12, colorClass: 'text-yellow-500' },
  { label: 'Đã từ chối', value: 5, colorClass: 'text-red-500' },
];

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      {/* 1. Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Duyệt chứng chỉ</h1>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Xem và duyệt chứng chỉ của các Nhà tiên tri
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AccountStats />
      </div>

      {/* 3. User Management Table Section */}
      {/* UserTable đã được cập nhật Dark Mode trong các div và text class. */}
      <CertificateTable />
    </div>
  );
}
