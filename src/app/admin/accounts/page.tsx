import React from 'react';

import { AccountStats } from '../../../components/accounts/AccountStats';
import { AccountTable } from '../../../components/accounts/AccountTable'; 

export default function AccountsPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Quản lý tài khoản</h1>
                <p className="text-base text-gray-500 dark:text-gray-400">
                    Xem và duyệt tài khoản Customer và Seer
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AccountStats />
            </div>
            <AccountTable />
        </div>
    );
}