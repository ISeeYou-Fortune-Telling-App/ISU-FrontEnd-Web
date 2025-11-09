'use client';

import React from 'react';
import ThemeSwitchToggle from '../../components/ui/ThemeSwitchToggle';
import { usePathname } from 'next/navigation';
import { Eye, Menu, Search, Bell } from 'lucide-react';
import AdminSidebarNav from './AdminSidebarNav';

const AdminHeader = ({ notificationCount }: { notificationCount: number }) => (
  <header
    className="fixed top-0 right-0 z-20 h-16 
      bg-white dark:bg-gray-800 
      border-b border-gray-400 dark:border-gray-700 
      flex items-center justify-between px-6 
      ml-64 w-[calc(100%-16rem)]"
  >
    <div className="flex items-center space-x-6">
      <Menu className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer" />

      <div className="relative flex items-center bg-gray-100 dark:bg-gray-700 rounded-3xl h-10 px-3">
        <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="bg-transparent focus:outline-none text-gray-700 dark:text-gray-200 w-64 placeholder:text-gray-400 font-light text-sm"
        />
      </div>

      <div className="relative p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
        <Bell className="w-6 h-6 text-gray-500 dark:text-gray-300" />
        {notificationCount > 0 && (
          <span className="absolute top-0 right-0 transform -translate-x-0.5 translate-y-0.5 w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </div>
    </div>

    <div className="flex items-center space-x-4">
      <ThemeSwitchToggle />
    </div>
  </header>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const notificationsCount = 9;
  const pathname = usePathname();
  const isProfilePage = pathname === '/admin/profile';
  const isAiAnalysisPage = pathname === '/admin/ai-analysis';

  let mainClassName = 'p-6 pt-20';
  if (isProfilePage) {
    mainClassName = 'pt-16';
  } else if (isAiAnalysisPage) {
    // Chiều cao cố định và Flexbox cho trang AI Chatbot
    // w-full h-[calc(100vh-64px)]
    // 100vh: Chiều cao toàn màn hình
    // 64px: Chiều cao của AdminHeader (h-16)
    // p-6: Giữ padding bên trong
    mainClassName = 'p-6 **pt-20 w-full h-[calc(100vh-0px)] flex flex-col**'; // pt-20 để bù cho header (16px * 4 = 64px + 6px*2)
  }

  return (
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
        <main className={isProfilePage ? 'pt-16' : 'p-6 pt-20'}>{children}</main>
      </div>
    </div>
  );
}
