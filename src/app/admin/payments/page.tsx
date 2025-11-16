'use client';

import React, { useEffect, useState } from 'react';

import { StatCardAccount } from '../../../components/common/StatCardAccount';
import { PaymentTable } from '../../../components/payments/PaymentTable';
import { BookingPaymentService } from '@/services/payments/payments.service';

interface PaymentStats {
  platformRevenue: number;
  successfulTransactions: number;
  canceledTransactions: number; // Sẽ map với FAILED
  totalRefunded: number;
}

export default function PaymentsPage() {

  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndCalculateStats = async () => {
      try {
        setLoading(true);
        const response = await BookingPaymentService.getPayments({
          page: 1,
          limit: 99999, // Lấy nhiều nhất có thể để tính toán
        });

        const payments = response.data;

        // 2. Tự tính toán 4 con số
        let calculatedStats: PaymentStats = {
          platformRevenue: 0,
          successfulTransactions: 0,
          canceledTransactions: 0,
          totalRefunded: 0,
        };

        // Dùng reduce để tính toán
        calculatedStats = payments.reduce(
          (acc, payment) => {
            
            // === SỬA LOGIC THEO STATUS MỚI ===
            switch (payment.paymentStatus) {
              case 'COMPLETED': // 'Giao dịch thành công'
                acc.successfulTransactions += 1;
                // Chỉ tính doanh thu (phí nền tảng) khi giao dịch COMPLETED
                acc.platformRevenue += (payment.amount * 0.1) || 0; 
                break;
              case 'FAILED': // 'Giao dịch bị hủy'
                acc.canceledTransactions += 1;
                break;
              case 'REFUNDED': // 'Đã hoàn tiền'
                // Chỉ tính tổng hoàn tiền khi status là REFUNDED
                acc.totalRefunded += (payment.amount - (payment.amount * 0.1)) || 0; 
                break;
              // Bỏ qua PENDING
              case 'PENDING':
              default:
                break;
            }
            // === KẾT THÚC SỬA LOGIC ===

            return acc;
          },
          calculatedStats,
        );
        
        // 3. Cập nhật state
        setStats(calculatedStats);

      } catch (error) {
        console.error('Lỗi khi tải và tính toán thống kê:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateStats();
  }, []);

  const paymentStats = [
    {
      label: 'Doanh thu (phí nền tảng)',
      value: loading ? '...' : stats?.platformRevenue ?? 0,
      colorClass: 'text-green-500',
      moneyType: 'vnđ' as const,
    },
    {
      label: 'Giao dịch thành công',
      value: loading ? '...' : stats?.successfulTransactions ?? 0,
      colorClass: 'text-green-500',
    },
    {
      label: 'Giao dịch bị hủy', // Sẽ lấy từ status FAILED
      value: loading ? '...' : stats?.canceledTransactions ?? 0,
      colorClass: 'text-yellow-500',
    },
    {
      label: 'Đã hoàn tiền',
      value: loading ? '...' : stats?.totalRefunded ?? 0,
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
