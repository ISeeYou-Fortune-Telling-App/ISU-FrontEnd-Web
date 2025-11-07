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
import { logout } from '@/services/auth/auth.service';

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
    className={`flex items-center p-3 rounded-lg transition duration-150 ${
      isActive
        ? 'bg-blue-100 dark:bg-blue-600 font-semibold text-blue-800 dark:text-white hover:bg-blue-200 dark:hover:bg-blue-700'
        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    <IconComponent
      className={`w-5 h-5 mr-3 ${
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
    <div className="flex flex-col justify-between">
      {/* Sidebar  */}
      <nav className="flex-1 p-4 overflow-y-auto space-y-1">
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
      </nav>

      {/* Profile */}
      {isAdmin && (
        <div className="border-t border-gray-400 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/admin/profile')}
              className="flex items-center space-x-3 group"
            >
              <img
                src="/default_avatar.jpg"
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full object-cover border border-gray-400 dark:border-gray-600 group-hover:scale-105 transition-transform"
              />
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:underline">
                  Quản trị viên
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hồ sơ cá nhân</p>
              </div>
            </button>

            <div className="flex items-center space-x-2">
              <button
                title="Đăng xuất"
                onClick={logout}
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
