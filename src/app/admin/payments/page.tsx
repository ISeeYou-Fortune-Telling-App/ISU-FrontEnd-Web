import React from 'react';

import { StatCardAccount } from '../../../components/common/StatCardAccount';
import {PaymentTable} from '../../../components/payments/PaymentTable';

const userStats = [
    { label: 'Doanh thu (phí nền tảng)', value: 69800, colorClass: 'text-green-500', moneyType: 'vnđ' as const },
    { label: 'Giao dịch thành công', value: 24, colorClass: 'text-green-500' },
    { label: 'Giao dịch bị hủy', value: 12, colorClass: 'text-yellow-500' },
    { label: 'Đã hoàn tiền', value: 399000, colorClass: 'text-yellow-500', moneyType: '₫' as const },
];

export default function PaymentsPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Lịch sử giao dịch</h1>
                <p className="text-base font-light text-gray-500 dark:text-gray-400">
                    Theo dõi tất cả giao dịch trong hệ thống
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {userStats.map((stat, index) => (
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