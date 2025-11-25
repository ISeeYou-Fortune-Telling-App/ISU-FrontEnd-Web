// src/app/admin/chat/page.tsx
import React from 'react';

import { KnowledgeStats } from '../../../components/knowledge/KnowledgeStats';
import { KnowledgeTable } from '../../../components/knowledge/KnowledgeTable';

const paymentStats = [
  { label: 'Đã xuất bản', value: 69800, colorClass: 'text-green-500' },
  { label: 'Bản nháp', value: 24, colorClass: 'text-yellow-500' },
  { label: 'Đã ẩn', value: 12, colorClass: 'text-green-500' },
  { label: 'Tổng lượt xem', value: 399000, colorClass: 'text-gray-500' },
];

export default function KnowledgePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Quản lý kho tri thức
        </h1>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Thêm, sửa, xóa các bài viết trong kho tri thức
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KnowledgeStats />
      </div>
      <KnowledgeTable />
    </div>
  );
}
