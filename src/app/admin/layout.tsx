import React from 'react';
import ThemeSwitchToggle from '../../components/ui/ThemeSwitchToggle'; 
import {
  Eye,
  Menu,
  Search,
  Bell,
} from 'lucide-react';

import ClientSidebarWrapper from './ClientSidebarWrapper'; 

const AdminHeader = ({ notificationCount }: { notificationCount: number }) => (
  <header className="fixed top-0 right-0 z-20 h-16 
      bg-white dark:bg-gray-800 
      border-b border-gray-300 dark:border-gray-700 
      shadow-sm flex items-center justify-between px-6 
      ml-64 w-[calc(100%-16rem)]"
  >
    {/* ... (Nội dung AdminHeader không đổi) ... */}
    <div className="flex items-center space-x-6">
      <Menu className="w-6 h-6 text-gray-500 dark:text-gray-300 cursor-pointer" />

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accountsCount = 12;
  const certificatesCount = 2;
  const chatHistoryCount = 5;
  const notificationsCount = 9;

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900"> 
      <aside className="w-64 
          bg-white dark:bg-gray-900 
          text-gray-900 dark:text-white 
          flex flex-col fixed h-full shadow-lg z-30 border-r border-gray-300 dark:border-gray-700">
        <div className="h-16 border-b border-gray-300 dark:border-gray-700"> 
          <div className="flex items-center space-x-4 px-6 h-full"> 
            <div className="p-1 bg-blue-600 rounded-lg">
              <Eye className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">I See You</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <ClientSidebarWrapper 
                    accountsCount={accountsCount}
                    certificatesCount={certificatesCount}
                    chatHistoryCount={chatHistoryCount}
                    notificationsCount={notificationsCount}
                />
      </aside>

      <div className="flex-1 ml-64">
        <AdminHeader notificationCount={notificationsCount} />
        <main className="p-6 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
}