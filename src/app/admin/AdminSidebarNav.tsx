'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  Newspaper,
  CreditCard,
  MessageSquare,
  BookOpen,
  Mail,
  Bell,
  LogOut,
  Settings,
} from 'lucide-react';
import { AuthService } from '@/services/auth/auth.service';

const SidebarItem = ({
  href,
  icon: IconComponent,
  label,
  isActive,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}) => (
  <Link
    href={href}
    className={`flex items-center px-4 py-2 rounded-lg transition duration-150 text-md ${
      isActive
        ? 'bg-blue-100 dark:bg-blue-600 font-medium text-blue-800 dark:text-white hover:bg-blue-200 dark:hover:bg-blue-700'
        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    <IconComponent
      className={`w-4 h-4 mr-2 ${
        isActive ? 'text-blue-600 dark:text-white' : 'text-gray-500 dark:text-gray-400'
      }`}
    />
    <span>{label}</span>
  </Link>
);

export default function AdminSidebarNav() {
  const currentPath = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setIsAdmin(role === 'ADMIN');
  }, []);

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Sidebar list scrollable */}
      <nav className="flex-1 pt-2 px-3 overflow-y-auto space-y-2">
        <SidebarItem
          href="/admin/dashboard"
          icon={LayoutDashboard}
          label="Bảng điều khiển"
          isActive={currentPath === '/admin/dashboard'}
        />
        <SidebarItem
          href="/admin/finance"
          icon={Bell}
          label="Tài chính"
          isActive={currentPath === '/admin/finance'}
        />
        <SidebarItem
          href="/admin/accounts"
          icon={Users}
          label="Quản lý tài khoản"
          isActive={currentPath === '/admin/accounts'}
        />
        <SidebarItem
          href="/admin/certificates"
          icon={CheckCircle}
          label="Duyệt chứng chỉ"
          isActive={currentPath === '/admin/certificates'}
        />
        <SidebarItem
          href="/admin/bookings"
          icon={Newspaper}
          label="Quản lý lịch hẹn"
          isActive={currentPath === '/admin/bookings'}
        />
        <SidebarItem
          href="/admin/packages"
          icon={Newspaper}
          label="Quản lý bài viết"
          isActive={currentPath === '/admin/packages'}
        />
        <SidebarItem
          href="/admin/payments"
          icon={CreditCard}
          label="Lịch sử giao dịch"
          isActive={currentPath === '/admin/payments'}
        />
        <SidebarItem
          href="/admin/chat"
          icon={MessageSquare}
          label="Lịch sử chat"
          isActive={currentPath === '/admin/chat'}
        />
        <SidebarItem
          href="/admin/knowledge"
          icon={BookOpen}
          label="Kho tri thức"
          isActive={currentPath === '/admin/knowledge'}
        />
        <SidebarItem
          href="/admin/messages"
          icon={Mail}
          label="Gửi tin nhắn"
          isActive={currentPath === '/admin/messages'}
        />
        <SidebarItem
          href="/admin/notifications"
          icon={Bell}
          label="Thông báo"
          isActive={currentPath === '/admin/notifications'}
        />
        <SidebarItem
          href="/admin/ai-analysis"
          icon={Bell}
          label="AI phân tích"
          isActive={currentPath === '/admin/ai-analysis'}
        />
      </nav>

      {/* Profile — fixed bottom */}
      {isAdmin && (
        <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 p-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/admin/profile')}
              className="flex items-center space-x-2 group"
            >
              <img
                src="/default_avatar.jpg"
                alt="Admin Avatar"
                className="w-8 h-8 rounded-full object-cover border border-gray-400 dark:border-gray-600 group-hover:scale-105 transition-transform"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:underline">
                  Quản trị viên
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hồ sơ cá nhân</p>
              </div>
            </button>

            <div className="flex items-center space-x-2">
              <button
                title="Đăng xuất"
                onClick={AuthService.logout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <button
                title="Cài đặt"
                onClick={() => router.push('/admin/settings')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
