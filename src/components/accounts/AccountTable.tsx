'use client';

import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  X,
  Check,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccountService } from '@/services/account/account.service';
import { ROLE_LABELS, STATUS_LABELS } from '@/constants/account.constant';
import { UserAccount, Role, Status, GetAccountsParams } from '@/types/account/account.type';
import { Badge } from '../common/Badge';
import { AccountDetailModal } from './AccountDetailModal';
import { useDebounce } from '@/hooks/useDebounce';
import { useScrollToTopOnPageChange } from '@/hooks/useScrollToTopOnPageChange';
import { LoadingSpinner } from '../common/LoadingSpinner';

const ITEMS_PER_PAGE = 10;

export const AccountTable: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [paging, setPaging] = useState({ page: 1, totalPages: 1, total: 0 });
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 1000);

  const [selectedRole, setSelectedRole] = useState<'Tất cả' | Role>('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState<'Tất cả' | Status>('Tất cả');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);

  // Prevent hydration mismatch from browser extensions
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to top when page changes
  useScrollToTopOnPageChange(paging.page, tableRef);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    if (isStatusDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isStatusDropdownOpen]);

  const fetchAccounts = async (page = 1, showSkeleton = false) => {
    try {
      if (showSkeleton) setLoading(true);
      else setIsRefreshing(true);

      const params: GetAccountsParams = {
        page,
        limit: ITEMS_PER_PAGE,
        sortType: 'desc',
        sortBy: 'createdAt',
      };

      let res;
      if (debouncedSearch.trim()) {
        res = await AccountService.getAccounts({ ...params, keyword: debouncedSearch.trim() });
        let filtered = res.data;
        if (selectedRole !== 'Tất cả')
          filtered = filtered.filter((u: any) => u.role === selectedRole);
        if (selectedStatus !== 'Tất cả')
          filtered = filtered.filter((u: any) => u.status === selectedStatus);
        setUsers(filtered);
      } else {
        res = await AccountService.getAccounts({
          ...params,
          role: selectedRole !== 'Tất cả' ? selectedRole : undefined,
          status: selectedStatus !== 'Tất cả' ? selectedStatus : undefined,
        });
        setUsers(res.data);
      }

      setPaging({
        page: (res.paging?.page ?? 0) + 1,
        totalPages: res.paging?.totalPages ?? 1,
        total: res.paging?.total ?? res.data.length ?? 0,
      });
    } catch (error) {
      console.error('❌ Lỗi khi tải danh sách tài khoản:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAccounts(1, true);
  }, []);

  useEffect(() => {
    if (!loading) fetchAccounts(paging.page, false);
  }, [selectedRole, selectedStatus, debouncedSearch, paging.page]);

  const goToNextPage = () => {
    if (paging.page < paging.totalPages && !isRefreshing) {
      setPaging((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const goToPrevPage = () => {
    if (paging.page > 1 && !isRefreshing) {
      setPaging((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleApprove = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (actionLoading) return;

    const result = await Swal.fire({
      title: 'Duyệt tài khoản?',
      text: 'Bạn có chắc muốn duyệt tài khoản này?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Duyệt',
      cancelButtonText: 'Hủy',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(userId);
      await AccountService.approveSeer(userId, { action: 'APPROVED' });
      await fetchAccounts(paging.page, false);
      await Swal.fire({
        title: 'Thành công!',
        text: 'Đã duyệt tài khoản thành công',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
      });
    } catch (error) {
      console.error('❌ Lỗi khi duyệt tài khoản:', error);
      await Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi duyệt tài khoản',
        icon: 'error',
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (actionLoading) return;

    const result = await Swal.fire({
      title: 'Từ chối tài khoản?',
      text: 'Nhập lý do từ chối:',
      input: 'textarea',
      inputPlaceholder: 'Lý do từ chối...',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Từ chối',
      cancelButtonText: 'Hủy',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
      inputValidator: (value) => {
        if (!value.trim()) {
          return 'Vui lòng nhập lý do từ chối!';
        }
        return null;
      },
    });

    if (!result.isConfirmed || !result.value) return;

    try {
      setActionLoading(userId);
      await AccountService.approveSeer(userId, {
        action: 'REJECTED',
        rejectReason: result.value,
      });
      await fetchAccounts(paging.page, false);
      await Swal.fire({
        title: 'Thành công!',
        text: 'Đã từ chối tài khoản',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
      });
    } catch (error) {
      console.error('❌ Lỗi khi từ chối tài khoản:', error);
      await Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi từ chối tài khoản',
        icon: 'error',
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlock = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (actionLoading) return;

    const result = await Swal.fire({
      title: 'Khóa tài khoản?',
      text: 'Bạn có chắc muốn khóa tài khoản này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Khóa',
      cancelButtonText: 'Hủy',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(userId);
      await AccountService.updateUserStatus(userId, 'BLOCKED');
      await fetchAccounts(paging.page, false);
      await Swal.fire({
        title: 'Thành công!',
        text: 'Đã khóa tài khoản',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
      });
    } catch (error) {
      console.error('❌ Lỗi khi khóa tài khoản:', error);
      await Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi khóa tài khoản',
        icon: 'error',
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (actionLoading) return;

    const result = await Swal.fire({
      title: 'Mở khóa tài khoản?',
      text: 'Bạn có chắc muốn mở khóa tài khoản này?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Mở khóa',
      cancelButtonText: 'Hủy',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(userId);
      await AccountService.updateUserStatus(userId, 'ACTIVE');
      await fetchAccounts(paging.page, false);
      await Swal.fire({
        title: 'Thành công!',
        text: 'Đã mở khóa tài khoản',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
      });
    } catch (error) {
      console.error('❌ Lỗi khi mở khóa tài khoản:', error);
      await Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi mở khóa tài khoản',
        icon: 'error',
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (actionLoading) return;

    const result = await Swal.fire({
      title: 'Xóa tài khoản?',
      text: 'Bạn có chắc muốn xóa vĩnh viễn tài khoản này? Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa vĩnh viễn',
      cancelButtonText: 'Hủy',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(userId);
      await AccountService.deleteAccount(userId);
      await fetchAccounts(paging.page, false);
      await Swal.fire({
        title: 'Đã xóa!',
        text: 'Tài khoản đã được xóa vĩnh viễn',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
      });
    } catch (error) {
      console.error('❌ Lỗi khi xóa tài khoản:', error);
      await Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi xóa tài khoản',
        icon: 'error',
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      ref={tableRef}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700 max-w-full"
    >
      {/* Search + Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-grow mr-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPaging((prev) => ({ ...prev, page: 1 }));
            }}
          />
        </div>

        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 
                       dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-400 dark:border-gray-600"
          >
            <span>
              {selectedStatus === 'Tất cả' ? 'Tất cả' : STATUS_LABELS[selectedStatus as Status]}
            </span>
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform ${
                isStatusDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isStatusDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 
                         ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-20 animate-fadeIn"
            >
              <div className="py-1">
                {[['Tất cả', 'Tất cả'], ...Object.entries(STATUS_LABELS)].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedStatus(key as any);
                      setIsStatusDropdownOpen(false);
                      setPaging((prev) => ({ ...prev, page: 1 }));
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      selectedStatus === key
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-600 font-semibold'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter theo vai trò */}
      <div className="flex space-x-2 mb-4">
        <div className="flex border border-gray-400 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
          {[['Tất cả', 'Tất cả'], ...Object.entries(ROLE_LABELS)].map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedRole(key as any);
                setPaging((prev) => ({ ...prev, page: 1 }));
              }}
              className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors ${
                selectedRole === key
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-400 dark:border-gray-700 relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 flex items-center justify-center backdrop-blur-sm pointer-events-none">
            <div
              className="h-6 w-6 rounded-full border-b-2 border-indigo-600 animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
          </div>
        )}

        <table
          className="min-w-full divide-y divide-gray-400 dark:divide-gray-700 table-fixed"
          style={{ tableLayout: 'fixed', width: '100%' }}
        >
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="w-[180px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Người dùng
              </th>
              <th className="w-[200px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Email
              </th>
              <th className="w-[140px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Vai trò
              </th>
              <th className="w-[140px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Trạng thái
              </th>
              <th className="w-[100px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Ngày tạo
              </th>
              <th className="w-[150px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-400 dark:divide-gray-700 relative">
            {/* overlay chỉ trong tbody */}
            {isRefreshing && (
              <tr>
                <td colSpan={6}>
                  <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
                  </div>
                </td>
              </tr>
            )}

            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-gray-500 dark:text-gray-400 italic"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  onClick={async () => {
                    try {
                      const detail = await AccountService.getAccountById(user.id);
                      setSelectedUser(detail.data);
                    } catch (error) {
                      console.error('Lỗi khi tải chi tiết người dùng:', error);
                    }
                  }}
                  className={`hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition duration-150 ${
                    isRefreshing ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <td className="px-6 py-3 w-[180px] whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.avatarUrl || '/default_avatar.jpg'}
                        alt={user.fullName}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-sm border border-gray-400 dark:border-gray-700"
                        onError={(e) => {
                          e.currentTarget.src = '/default_avatar.jpg';
                        }}
                      />
                      <span
                        className="ml-3 text-sm font-medium text-gray-900 dark:text-white truncate max-w-[140px]"
                        title={user.fullName}
                      >
                        {user.fullName || '(Không có tên)'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-300 truncate text-center">
                    {user.email}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge type="AccountRole" value={ROLE_LABELS[user.role] || user.role} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge type="AccountStatus" value={STATUS_LABELS[user.status]} />
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-3 text-center text-sm font-medium">
                    {user.status === 'UNVERIFIED' ? (
                      // Tài khoản chưa duyệt: hiện ✓ X 👁️ 🗑️
                      <div className="grid grid-cols-4 gap-1 items-center justify-items-center w-full max-w-[160px] mx-auto">
                        {/* Approve */}
                        <div className="flex justify-center">
                          <button
                            title="Duyệt tài khoản"
                            onClick={(e) => handleApprove(user.id, e)}
                            disabled={actionLoading === user.id}
                            className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === user.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Check className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        {/* Reject */}
                        <div className="flex justify-center">
                          <button
                            title="Từ chối tài khoản"
                            onClick={(e) => handleReject(user.id, e)}
                            disabled={actionLoading === user.id}
                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* View */}
                        <div className="flex justify-center">
                          <button
                            title="Xem chi tiết"
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const detail = await AccountService.getAccountById(user.id);
                                setSelectedUser(detail.data);
                              } catch (error) {
                                console.error('Lỗi khi tải chi tiết người dùng:', error);
                              }
                            }}
                            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Delete */}
                        <div className="flex justify-center">
                          <button
                            title="Xóa tài khoản"
                            onClick={(e) => handleDelete(user.id, e)}
                            disabled={actionLoading === user.id}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Tài khoản bình thường: chỉ hiện 👁️ 🗑️
                      <div className="flex items-center justify-center space-x-3">
                        {/* View */}
                        <button
                          title="Xem chi tiết"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              const detail = await AccountService.getAccountById(user.id);
                              setSelectedUser(detail.data);
                            } catch (error) {
                              console.error('Lỗi khi tải chi tiết người dùng:', error);
                            }
                          }}
                          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>

                        {/* Delete */}
                        <button
                          title="Xóa tài khoản"
                          onClick={(e) => handleDelete(user.id, e)}
                          disabled={actionLoading === user.id}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-400 dark:border-gray-700 mt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Trang {paging.page}/{paging.totalPages} • {paging.total} tài khoản
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={paging.page <= 1 || isRefreshing}
            className={`p-2 rounded-md transition ${
              paging.page <= 1 || isRefreshing
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={goToNextPage}
            disabled={paging.page >= paging.totalPages || isRefreshing}
            className={`p-2 rounded-md transition ${
              paging.page >= paging.totalPages || isRefreshing
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {selectedUser && (
        <AccountDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onActionComplete={() => fetchAccounts(paging.page)}
        />
      )}
    </div>
  );
};
