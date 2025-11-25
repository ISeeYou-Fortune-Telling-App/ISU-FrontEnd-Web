/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Badge } from '../common/Badge';
import { PackageDetailModal } from './PackageDetailModal';
import { PackageReviewsModal } from './PackageReviewsModal';
import { PackageService } from '@/services/packages/package.service';
import { ServicePackage } from '@/types/packages/package.type';
import { type StatusFilterType } from '@/utils/packageHelpers';

const ITEMS_PER_PAGE = 10;

export const PackageTable: React.FC = () => {
  // ==================== STATE ====================
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<StatusFilterType>('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  const [totalItems, setTotalItems] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper function to reload data
  const reloadData = async () => {
    try {
      const res = await PackageService.getAll({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sortType: 'desc',
        sortBy: 'createdAt',
        searchText: searchTerm || undefined,
        status: selectedFilter !== 'Tất cả' ? selectedFilter : undefined,
        packageCategoryIds: selectedCategory ? [selectedCategory] : undefined,
      });
      setPackages(res.data);
      setTotalItems(res.paging?.total || 0);
    } catch (err) {
      console.error('❌ Lỗi khi tải danh sách gói:', err);
    }
  };

  // Fetch categories from API
  useEffect(() => {
    (async () => {
      try {
        const { KnowledgeService } = await import('@/services/knowledge/knowledge.service');
        const res = await KnowledgeService.getCategories({
          page: 1,
          limit: 50,
          sortType: 'asc',
          sortBy: 'name',
        });
        setCategories(res.data);
      } catch (err) {
        console.error('❌ Lỗi khi tải danh mục:', err);
      }
    })();
  }, []);

  // 🧠 Gọi API - Initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await PackageService.getAll({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sortType: 'desc',
          sortBy: 'createdAt',
          searchText: searchTerm || undefined,
          status: selectedFilter !== 'Tất cả' ? selectedFilter : undefined,
          packageCategoryIds: selectedCategory ? [selectedCategory] : undefined,
        });
        setPackages(res.data);
        setTotalItems(res.paging?.total || 0);
      } catch (err) {
        console.error('❌ Lỗi khi tải danh sách gói:', err);
        setError('Không thể tải danh sách gói dịch vụ');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Refresh when filters change
  useEffect(() => {
    if (!loading) {
      const fetchData = async () => {
        try {
          setIsRefreshing(true);
          setError(null);

          const res = await PackageService.getAll({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            sortType: 'desc',
            sortBy: 'createdAt',
            searchText: searchTerm || undefined,
            status: selectedFilter !== 'Tất cả' ? selectedFilter : undefined,
            packageCategoryIds: selectedCategory ? [selectedCategory] : undefined,
          });
          setPackages(res.data);
          setTotalItems(res.paging?.total || 0);
        } catch (err) {
          console.error('❌ Lỗi khi tải danh sách gói:', err);
          setError('Không thể tải danh sách gói dịch vụ');
        } finally {
          setIsRefreshing(false);
        }
      };
      fetchData();
    }
  }, [currentPage, selectedCategory, selectedFilter, searchTerm]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  const goToNextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const goToPrevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  // ==================== ACTIONS ====================
  const handleViewDetail = async (pkg: ServicePackage) => {
    try {
      const res = await PackageService.getInteractions(pkg.id);
      setSelectedPackage(res.data);
    } catch (err) {
      console.error('❌ Lỗi khi tải chi tiết:', err);
      setSelectedPackage(pkg);
    }
  };

  const handleViewReviews = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setShowReviewsModal(true);
  };

  const handleDeleteClick = async (pkg: ServicePackage) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      html: `Bạn có chắc chắn muốn xóa gói dịch vụ <strong>"${pkg.packageTitle}"</strong>?<br/><br/>
             <small class="text-gray-600 dark:text-gray-400">Các booking chưa hoàn thành sẽ được hoàn tiền và hủy tự động.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
    });

    if (result.isConfirmed) {
      try {
        const response = await PackageService.delete(pkg.id);
        await Swal.fire({
          title: 'Đã xóa!',
          text: response.message || 'Gói dịch vụ đã được xóa thành công.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
        // Reload data
        await reloadData();
      } catch (err: any) {
        console.error('❌ Lỗi khi xóa gói:', err);
        Swal.fire({
          title: 'Lỗi!',
          text: err?.response?.data?.message || 'Không thể xóa gói dịch vụ',
          icon: 'error',
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
      }
    }
  };

  // ==================== RENDER ====================

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-400 dark:border-gray-700">
      {/* Search & Category Filter */}
      <div className="flex gap-3 mb-4">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên Nhà tiên tri hoặc tiêu đề..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-400 dark:border-gray-600 rounded-lg
                       focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700
                       dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-400 dark:border-gray-600 min-w-[160px]"
          >
            <span className="truncate">
              {!selectedCategory
                ? 'Tất cả danh mục'
                : categories.find((c) => c.id === selectedCategory)?.name || 'Tất cả danh mục'}
            </span>
            <ChevronDown
              className={`w-4 h-4 ml-1 flex-shrink-0 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isDropdownOpen && (
            <div className="z-50 absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
              <div className="py-1">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setIsDropdownOpen(false);
                    setCurrentPage(1);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    !selectedCategory
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold'
                      : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  Tất cả danh mục
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                      selectedCategory === cat.id
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-1">
        <div className="inline-flex border border-gray-400 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
          {[
            { label: 'Tất cả', value: 'Tất cả' },
            { label: 'Đang hoạt động', value: 'AVAILABLE' },
            { label: 'Bị từ chối', value: 'REJECTED' },
            { label: 'Có báo cáo', value: 'HAVE_REPORT' },
            { label: 'Đã ẩn', value: 'HIDDEN' },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => {
                setSelectedFilter(status.value as StatusFilterType);
                setCurrentPage(1);
              }}
              className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors whitespace-nowrap
                ${
                  selectedFilter === status.value
                    ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">❌ {error}</p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-400 dark:border-gray-700 relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 flex items-center justify-center backdrop-blur-sm pointer-events-none z-10">
            <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
          </div>
        )}

        <table
          className="min-w-full divide-y divide-gray-400 dark:divide-gray-700 table-fixed"
          style={{ tableLayout: 'fixed', width: '100%' }}
        >
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="w-[160px] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                Tác giả
              </th>
              <th className="w-[240px] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                Nội dung
              </th>
              <th className="w-[150px] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                Danh mục
              </th>
              <th className="w-[140px] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                Trạng thái
              </th>
              <th className="w-[140px] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                Tương tác
              </th>
              <th className="w-[100px] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                Ngày đăng
              </th>
              <th className="w-[130px] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-400 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500 dark:text-gray-400">
                  ⏳ Đang tải dữ liệu...
                </td>
              </tr>
            ) : packages.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500 dark:text-gray-400">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              packages.map((pkg, index) => (
                <motion.tr
                  key={pkg.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  onClick={() => handleViewDetail(pkg)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 cursor-pointer"
                >
                  {/* 🧙‍♂️ Tác giả */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <img
                        src={pkg.seer.avatarUrl || '/default_avatar.jpg'}
                        alt={pkg.seer.fullName}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0 shadow-sm border border-gray-200 dark:border-gray-700"
                      />
                      <span
                        className="text-sm font-medium text-gray-900 dark:text-white truncate"
                        title={pkg.seer.fullName}
                      >
                        {pkg.seer.fullName || 'Không có dữ liệu'}
                      </span>
                    </div>
                  </td>

                  {/* 📘 Nội dung */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.packageTitle}
                        className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                      />
                      <span
                        className="text-sm text-gray-800 dark:text-gray-200 truncate"
                        title={pkg.packageTitle}
                      >
                        {pkg.packageTitle || 'Không có dữ liệu'}
                      </span>
                    </div>
                  </td>

                  {/* 🏷️ Danh mục */}
                  <td className="px-4 py-3">
                    {pkg.categories && pkg.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {pkg.categories.map((cat) => (
                          <Badge key={cat.id} type="expertise" value={cat.name} />
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Không có dữ liệu</span>
                    )}
                  </td>

                  {/* ⚙️ Trạng thái */}
                  <td className="px-4 py-3 text-center">
                    <Badge type="status" value={pkg.status} />
                  </td>

                  {/* 💬 Tương tác */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <span className="inline-flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {pkg.likeCount}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ThumbsDown className="w-4 h-4" />
                        {pkg.dislikeCount}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {pkg.totalReviews}
                      </span>
                    </div>
                  </td>

                  {/* ⏰ Ngày đăng */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(pkg.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(pkg.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </td>

                  {/* 🧩 Thao tác */}
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-center space-x-1 min-w-[120px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(pkg);
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewReviews(pkg);
                        }}
                        className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
                        title="Xem bình luận"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(pkg);
                        }}
                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                        title="Xóa gói"
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
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
          Trang {currentPage}/{totalPages || 1} • {totalItems} gói dịch vụ
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1 || isRefreshing}
            className={`p-2 rounded-md transition ${
              currentPage <= 1 || isRefreshing
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages || isRefreshing}
            className={`p-2 rounded-md transition ${
              currentPage >= totalPages || isRefreshing
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal Detail */}
      {selectedPackage && !showReviewsModal && (
        <PackageDetailModal
          package={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onActionComplete={async () => {
            // Reload data after action
            await reloadData();
          }}
          onHide={async (id, reason) => {
            const result = await Swal.fire({
              title: 'Xác nhận ẩn',
              html: `Bạn có chắc chắn muốn ẩn gói dịch vụ này?<br/><br/>
                     <small class="text-gray-600 dark:text-gray-400">Lý do: ${
                       reason || 'Không có lý do'
                     }</small>`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#6b7280',
              cancelButtonColor: '#6b7280',
              confirmButtonText: 'Ẩn',
              cancelButtonText: 'Hủy',
              reverseButtons: true,
              background: document.documentElement.classList.contains('dark')
                ? '#1f2937'
                : '#ffffff',
              color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
            });

            if (result.isConfirmed) {
              try {
                const response = await PackageService.adminConfirm(id, 'HIDDEN', reason);
                await Swal.fire({
                  title: 'Thành công!',
                  text: response.message || 'Đã ẩn bài viết thành công!',
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false,
                  background: document.documentElement.classList.contains('dark')
                    ? '#1f2937'
                    : '#ffffff',
                  color: document.documentElement.classList.contains('dark')
                    ? '#f3f4f6'
                    : '#111827',
                });
                setSelectedPackage(null);
                // Reload data
                await reloadData();
              } catch (err: any) {
                console.error('❌ Lỗi khi ẩn bài viết:', err);
                Swal.fire({
                  title: 'Lỗi!',
                  text: err?.response?.data?.message || 'Lỗi khi ẩn bài viết',
                  icon: 'error',
                  background: document.documentElement.classList.contains('dark')
                    ? '#1f2937'
                    : '#ffffff',
                  color: document.documentElement.classList.contains('dark')
                    ? '#f3f4f6'
                    : '#111827',
                });
              }
            }
          }}
          onDelete={async (id) => {
            const result = await Swal.fire({
              title: 'Xác nhận xóa',
              html: `Bạn có chắc chắn muốn xóa gói dịch vụ này?<br/><br/>
                     <small class="text-gray-600 dark:text-gray-400">Các booking chưa hoàn thành sẽ được hoàn tiền và hủy tự động.</small>`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#dc2626',
              cancelButtonColor: '#6b7280',
              confirmButtonText: 'Xóa',
              cancelButtonText: 'Hủy',
              reverseButtons: true,
              background: document.documentElement.classList.contains('dark')
                ? '#1f2937'
                : '#ffffff',
              color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
            });

            if (result.isConfirmed) {
              try {
                const response = await PackageService.delete(id);
                await Swal.fire({
                  title: 'Thành công!',
                  text: response.message || 'Đã xóa bài viết thành công!',
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false,
                  background: document.documentElement.classList.contains('dark')
                    ? '#1f2937'
                    : '#ffffff',
                  color: document.documentElement.classList.contains('dark')
                    ? '#f3f4f6'
                    : '#111827',
                });
                setSelectedPackage(null);
                // Reload data
                await reloadData();
              } catch (err: any) {
                console.error('❌ Lỗi khi xóa bài viết:', err);
                Swal.fire({
                  title: 'Lỗi!',
                  text: err?.response?.data?.message || 'Lỗi khi xóa bài viết',
                  icon: 'error',
                  background: document.documentElement.classList.contains('dark')
                    ? '#1f2937'
                    : '#ffffff',
                  color: document.documentElement.classList.contains('dark')
                    ? '#f3f4f6'
                    : '#111827',
                });
              }
            }
          }}
        />
      )}

      {/* Reviews Modal */}
      {showReviewsModal && selectedPackage && (
        <PackageReviewsModal
          packageId={selectedPackage.id}
          packageTitle={selectedPackage.packageTitle}
          onClose={() => {
            setShowReviewsModal(false);
            setSelectedPackage(null);
          }}
        />
      )}
    </div>
  );
};
