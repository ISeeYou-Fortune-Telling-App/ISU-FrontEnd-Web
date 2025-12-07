'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, ChevronDown, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccountService } from '@/services/account/account.service';
import { ROLE_LABELS, STATUS_LABELS } from '@/constants/account.constant';
import { UserAccount, Role, Status, GetAccountsParams } from '@/types/account/account.type';
import { Badge } from '../common/Badge';
import { AccountDetailModal } from './AccountDetailModal';
import { useDebounce } from '@/hooks/useDebounce';
import { useScrollToTopOnPageChange } from '@/hooks/useScrollToTopOnPageChange';

const ITEMS_PER_PAGE = 10;

export const AccountTable: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [paging, setPaging] = useState({ page: 1, totalPages: 1, total: 0 });
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [selectedRole, setSelectedRole] = useState<'Tất cả' | Role>('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState<'Tất cả' | Status>('Tất cả');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);

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

  if (loading) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        Đang tải danh sách tài khoản...
      </div>
    );
  }

  return (
    <div
      ref={tableRef}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700"
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
            <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
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
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ${
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
                    <button
                      title="Xem chi tiết"
                      onClick={async () => {
                        try {
                          const detail = await AccountService.getAccountById(user.id);
                          setSelectedUser(detail.data);
                        } catch (error) {
                          console.error('Lỗi khi tải chi tiết người dùng:', error);
                        }
                      }}
                      className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 transition-colors"
                    >
                      <Eye className="w-5 h-5 inline-block" />
                    </button>
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
