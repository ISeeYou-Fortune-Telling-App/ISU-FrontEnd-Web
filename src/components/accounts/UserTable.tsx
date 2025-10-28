'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { AccountService } from '@/services/account/account.service';
import { ROLE_LABELS, STATUS_LABELS } from '@/services/account/account.constant';
import {
  UserAccount,
  Role,
  Status,
  GetAccountsParams,
} from '@/services/account/account.type';
import { Badge } from '../common/Badge';
import { UserDetailModal } from '../accounts/UserDetailModal';

const ITEMS_PER_PAGE = 10;

const STATUS_DISPLAY: Record<string, string> = {
  'Tất cả': 'Tất cả',
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Ngưng hoạt động',
  VERIFIED: 'Đã xác thực',
  UNVERIFIED: 'Chưa xác thực',
  BLOCKED: 'Bị khóa',
};

export const UserTable: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [paging, setPaging] = useState({ page: 1, totalPages: 1, total: 0 });
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Tất cả' | Role>('Tất cả');
  const [selectedStatus, setSelectedStatus] =
    useState<'Tất cả' | Status>('Tất cả');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };
    if (isStatusDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isStatusDropdownOpen]);

  // ====================== FETCH DATA ======================
  const fetchAccounts = async (page = 1, showSkeleton = false) => {
    try {
      if (showSkeleton) setLoading(true);
      else setIsRefreshing(true);

      const commonParams: GetAccountsParams = {
        page,
        limit: ITEMS_PER_PAGE,
        sortType: 'desc',
        sortBy: 'createdAt',
      };

      let res;
      if (searchTerm.trim()) {
        res = await AccountService.searchAccounts({
          ...commonParams,
          keyword: searchTerm.trim(),
        });

        let filtered = res.data;
        if (selectedRole !== 'Tất cả')
          filtered = filtered.filter((u) => u.role === selectedRole);
        if (selectedStatus !== 'Tất cả')
          filtered = filtered.filter((u) => u.status === selectedStatus);

        setUsers(filtered);
        setPaging({
          ...res.paging,
          page: (res.paging.page ?? 0) + 1,
        });
      } else {
        res = await AccountService.getAccounts({
          ...commonParams,
          role: selectedRole !== 'Tất cả' ? selectedRole : undefined,
          status: selectedStatus !== 'Tất cả' ? selectedStatus : undefined,
        });

        setUsers(res.data);
        setPaging({
          ...res.paging,
          page: (res.paging.page ?? 0) + 1,
        });
      }
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
    const timer = setTimeout(() => {
      if (!loading) fetchAccounts(paging.page, false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedRole, selectedStatus, searchTerm, paging.page]);

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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      {/* 🔍 Search + Dropdown */}
      <div className="flex justify-between items-center mb-4">
        {/* Search box */}
        <div className="relative flex-grow mr-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPaging((prev) => ({ ...prev, page: 1 }));
            }}
          />
        </div>

        {/* Dropdown trạng thái - styled đẹp + click outside */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 
                       dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
          >
            <span>{STATUS_DISPLAY[selectedStatus]}</span>
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform ${
                isStatusDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isStatusDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 
                         ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-10 animate-fadeIn"
            >
              <div className="py-1">
                {[
                  { label: 'Tất cả', value: 'Tất cả' },
                  { label: 'Đang hoạt động', value: 'ACTIVE' },
                  { label: 'Ngưng hoạt động', value: 'INACTIVE' },
                  { label: 'Đã xác thực', value: 'VERIFIED' },
                  { label: 'Chưa xác thực', value: 'UNVERIFIED' },
                  { label: 'Bị khóa', value: 'BLOCKED' },
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => {
                      setSelectedStatus(status.value as any);
                      setIsStatusDropdownOpen(false);
                      setPaging((prev) => ({ ...prev, page: 1 }));
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      selectedStatus === status.value
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-600 font-semibold'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🧭 Filter theo vai trò */}
      <div className="flex space-x-2 mb-4">
        <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
          {[
            { label: 'Tất cả', value: 'Tất cả' },
            { label: 'Người dùng', value: 'CUSTOMER' },
            { label: 'Nhà tiên tri', value: 'SEER' },
            { label: 'Chưa xác thực', value: 'UNVERIFIED_SEER' },
            { label: 'Quản trị viên', value: 'ADMIN' },
          ].map((role) => (
            <button
              key={role.value}
              onClick={() => {
                setSelectedRole(role.value as any);
                setPaging((prev) => ({ ...prev, page: 1 }));
              }}
              className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors ${
                selectedRole === role.value
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 flex items-center justify-center backdrop-blur-sm pointer-events-none">
            <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="w-[220px] px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Người dùng
              </th>
              <th className="w-[220px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Email
              </th>
              <th className="w-[140px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Vai trò
              </th>
              <th className="w-[140px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Trạng thái
              </th>
              <th className="w-[160px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Ngày tạo
              </th>
              <th className="w-[300px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
              >
                <td className="px-6 py-3 w-[220px] whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={user.avatarUrl || '/default_avatar.jpg'}
                      alt={user.fullName}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-sm border border-gray-200 dark:border-gray-700"
                    />
                    <span
                      className="ml-3 text-sm font-medium text-gray-900 dark:text-white truncate max-w-[140px]"
                      title={user.fullName}
                    >
                      {user.fullName || '(Không có tên)'}
                    </span>
                  </div>
                </td>

                <td
                  className="px-6 py-3 w-[220px] text-sm text-gray-500 dark:text-gray-300 truncate text-center"
                  title={user.email}
                >
                  {user.email}
                </td>

                <td className="px-6 py-3 w-[140px] text-center whitespace-nowrap">
                  <Badge type="role" value={ROLE_LABELS[user.role]} />
                </td>

                <td className="px-6 py-3 w-[140px] text-center whitespace-nowrap">
                  <Badge type="status" value={STATUS_LABELS[user.status]} />
                </td>

                <td className="px-6 py-3 w-[160px] text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap text-center">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </td>

                <td className="px-6 py-3 w-[120px] text-center text-sm font-medium">
                  <button
                    title="Xem chi tiết"
                    onClick={async () => {
                      try {
                        setIsRefreshing(true);
                        const detail = await AccountService.getAccountById(user.id);
                        setSelectedUser(detail);
                      } catch (error) {
                        console.error('❌ Lỗi khi tải chi tiết người dùng:', error);
                      } finally {
                        setIsRefreshing(false);
                      }
                    }}
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 transition-colors"
                  >
                    <Eye className="w-5 h-5 inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
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

      {/* 🪄 Modal chi tiết */}
      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};
