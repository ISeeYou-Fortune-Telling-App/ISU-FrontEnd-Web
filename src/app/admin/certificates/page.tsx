import React from 'react';

import { CertificateStats } from '../../../components/certificates/CertificateStats';
import { CertificateTable } from '../../../components/certificates/CertificateTable';

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
        <CertificateStats />
      </div>

      {/* 3. User Management Table Section */}
      <CertificateTable />
    </div>
  );
}
