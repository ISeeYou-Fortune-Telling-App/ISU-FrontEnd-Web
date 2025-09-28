// src/app/admin/certificates/page.tsx
import React from 'react';

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Duyệt Chứng chỉ (Pending: 2)</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Xem xét và phê duyệt các yêu cầu cấp chứng chỉ của Seer.
      </p>

      {/* Thêm danh sách Pending Certificates */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-96 flex items-center justify-center">
        [Placeholder: Danh sách Chứng chỉ cần Duyệt]
      </div>
    </div>
  );
}