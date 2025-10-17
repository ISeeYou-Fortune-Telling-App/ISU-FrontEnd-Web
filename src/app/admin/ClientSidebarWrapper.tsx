// ./src/app/admin/ClientSidebarWrapper.tsx
'use client'; 

import dynamic from 'next/dynamic';
import React from 'react';

// Import AdminSidebarNav (đã là Client Component) bằng dynamic
const AdminSidebarNav = dynamic(() => import('./AdminSidebarNav'), {
    // Bây giờ bạn có thể đặt ssr: false ở đây vì file này là Client Component
    ssr: false,
    loading: () => (
        <div className="p-4 space-y-1 text-gray-400 dark:text-gray-500 text-sm">
            Đang tải Menu...
        </div>
    ),
});

// Wrapper này chỉ đơn giản là chuyển props và render AdminSidebarNav
export default function ClientSidebarWrapper({ 
    accountsCount,
    certificatesCount,
    chatHistoryCount,
    notificationsCount,
}: {
    accountsCount: number;
    certificatesCount: number;
    chatHistoryCount: number;
    notificationsCount: number;
}) {
    return (
        <AdminSidebarNav
            accountsCount={accountsCount}
            certificatesCount={certificatesCount}
            chatHistoryCount={chatHistoryCount}
            notificationsCount={notificationsCount}
        />
    );
}