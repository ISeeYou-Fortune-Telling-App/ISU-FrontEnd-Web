'use client';

import React, { memo } from 'react';
import ThemeSwitchToggle from '../../components/ui/ThemeSwitchToggle';
import { usePathname } from 'next/navigation';
import { Eye, Menu, Search, Bell } from 'lucide-react';
import AdminSidebarNav from './AdminSidebarNav';
import { AdminChatProvider } from '@/contexts/AdminChatContext';

const AdminHeader = memo(({ notificationCount }: { notificationCount: number }) => (
  <header
    className="fixed top-0 right-0 z-20 h-16 
      bg-white dark:bg-gray-800 
      border-b border-gray-400 dark:border-gray-700 
      flex items-center justify-end px-6 
      ml-64 w-[calc(100%-16rem)]"
  >
    <div className="flex items-center space-x-4">
      <ThemeSwitchToggle />
    </div>
  </header>
));

AdminHeader.displayName = 'AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const notificationsCount = 9;
  const pathname = usePathname();
  const isProfilePage = pathname === '/admin/profile';
  const isAiAnalysisPage = pathname === '/admin/ai-analysis';

  // Tối ưu: Tránh tính toán lại className mỗi lần render
  const mainClassName = React.useMemo(() => {
    if (isProfilePage) return 'pt-16';
    if (isAiAnalysisPage) return 'h-screen overflow-hidden';
    return 'p-6 pt-20';
  }, [isProfilePage, isAiAnalysisPage]);

  return (
    <AdminChatProvider>
      <div className="flex min-h-screen bg-white dark:bg-gray-900">
        <aside
          className="w-64 
            bg-white dark:bg-gray-900 
            text-gray-900 dark:text-white 
            flex flex-col fixed h-full z-30 border-r border-gray-400 dark:border-gray-700"
        >
          <div className="h-16 pt-5 border-b border-gray-400 dark:border-gray-700">
            <div className="flex items-center space-x-4 px-6 h-full ">
              <div className="p-1 bg-blue-600 rounded-lg mt-[-12px]">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col leading-none pb-5">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">I See You</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
              </div>
            </div>
          </div>
          <AdminSidebarNav />
        </aside>

        <div className="flex-1 ml-64">
          <AdminHeader notificationCount={notificationsCount} />
          <main className={mainClassName}>{children}</main>
        </div>
      </div>
    </AdminChatProvider>
  );
}
