// src/app/admin/transactions/page.tsx
import React from 'react';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lịch sử Giao dịch</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Theo dõi tất cả các giao dịch nạp tiền, rút tiền và thanh toán dịch vụ.
      </p>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-96 flex items-center justify-center">
        [Placeholder: Bảng Lịch sử Giao dịch chi tiết]
      </div>
    </div>
  );
}