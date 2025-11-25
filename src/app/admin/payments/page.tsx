'use client';

import React, { useEffect, useState } from 'react';

import { StatCardAccount } from '../../../components/common/StatCardAccount';
import { PaymentTable } from '../../../components/payments/PaymentTable';
import { BookingPaymentService } from '@/services/payments/payments.service';

interface PaymentStats {
  totalRevenue: number;
  successfulTransactions: number;
  canceledTransactions: number;
  totalRefundedAmount: number;
}

export default function PaymentsPage() {
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await BookingPaymentService.getPaymentStats();
        setStats(response);
      } catch (error) {
        console.error('Lỗi khi tải thống kê thanh toán:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const paymentStats = [
    {
      label: 'Doanh thu (phí nền tảng)',
      value: loading ? '...' : stats?.totalRevenue ?? 0,
      colorClass: 'text-green-500',
      moneyType: 'vnđ' as const,
    },
    {
      label: 'Giao dịch thành công',
      value: loading ? '...' : stats?.successfulTransactions ?? 0,
      colorClass: 'text-green-500',
    },
    {
      label: 'Giao dịch bị hủy',
      value: loading ? '...' : stats?.canceledTransactions ?? 0,
      colorClass: 'text-yellow-500',
    },
    {
      label: 'Đã hoàn tiền',
      value: loading ? '...' : stats?.totalRefundedAmount ?? 0,
      colorClass: 'text-yellow-500',
      moneyType: '₫' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Lịch sử giao dịch</h1>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Theo dõi tất cả giao dịch trong hệ thống
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paymentStats.map((stat, index) => (
          <StatCardAccount
            key={index}
            value={stat.value}
            label={stat.label}
            colorClass={stat.colorClass}
            moneyType={stat.moneyType}
          />
        ))}
      </div>
      <PaymentTable />
    </div>
  );
}
