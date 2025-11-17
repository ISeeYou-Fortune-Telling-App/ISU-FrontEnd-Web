/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { PackageDetailModal } from './PackageDetailModal';
import { PackageReviewsModal } from './PackageReviewsModal';
import { PackageService } from '@/services/packages/package.service';
import { ServiceCategoryEnum, ServicePackage } from '@/types/packages/package.type';
import {
  getCategoryDisplay,
  getCategoryColorClass,
  type StatusFilterType,
} from '@/utils/packageHelpers';

const ITEMS_PER_PAGE = 10;

export const PackageTable: React.FC = () => {
  // ==================== STATE ====================
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<StatusFilterType>('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryEnum | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<ServicePackage | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  // 🧠 Gọi API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: any = {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sortType: 'desc',
          sortBy: 'createdAt',
          searchText: searchTerm || undefined,
        };

        if (selectedCategory !== 'ALL') {
          const res = await PackageService.getByCategory(selectedCategory, {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            sortType: 'desc',
            sortBy: 'createdAt',
            minPrice: 0,
            maxPrice: 10000000,
          });
          setPackages(res.data);
          setTotalItems(res.paging?.total || 0);
        } else {
          const res = await PackageService.getAll({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            sortType: 'desc',
            sortBy: 'createdAt',
            minPrice: 0,
            maxPrice: 10000000,
            status: selectedFilter !== 'Tất cả' ? (selectedFilter as any) : undefined,
          });
          setPackages(res.data);
          setTotalItems(res.paging?.total || 0);
        }
      } catch (err) {
        console.error('❌ Lỗi khi tải danh sách gói:', err);
        setError('Không thể tải danh sách gói dịch vụ');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  const handleDeleteClick = (pkg: ServicePackage) => {
    setPackageToDelete(pkg);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!packageToDelete) return;

    try {
      await PackageService.delete(packageToDelete.id);
      alert('Đã xóa gói dịch vụ thành công! Các booking chưa hoàn thành đã được hoàn tiền và hủy.');
      setShowDeleteConfirm(false);
      setPackageToDelete(null);
      // Reload data
      window.location.reload();
    } catch (err: any) {
      console.error('Error deleting package:', err);
      alert(err?.response?.data?.message || 'Không thể xóa gói dịch vụ');
    }
  };

  // ==================== RENDER ====================
  const categoryOptions: Array<{ value: ServiceCategoryEnum | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'Tất cả danh mục' },
    {
      value: ServiceCategoryEnum.PALM_READING,
      label: getCategoryDisplay(ServiceCategoryEnum.PALM_READING),
    },
    {
      value: ServiceCategoryEnum.CONSULTATION,
      label: getCategoryDisplay(ServiceCategoryEnum.CONSULTATION),
    },
    { value: ServiceCategoryEnum.TAROT, label: getCategoryDisplay(ServiceCategoryEnum.TAROT) },
    {
      value: ServiceCategoryEnum.PHYSIOGNOMY,
      label: getCategoryDisplay(ServiceCategoryEnum.PHYSIOGNOMY),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      {/* Search & Category Filter */}
      <div className="flex gap-3 mb-4">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên Nhà tiên tri hoặc tiêu đề..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
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
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value as ServiceCategoryEnum | 'ALL');
              setCurrentPage(1);
            }}
            className="appearance-none flex items-center gap-2 px-2.5 py-2 rounded-[5px] bg-[#F0F2F5] dark:bg-gray-700 
                       text-[#42454A] dark:text-gray-300 text-sm font-normal 
                       border-none outline-none cursor-pointer pr-8 min-w-[180px]"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#42454A] dark:text-gray-300 w-[19px] h-[19px]" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4">
        <div className="inline-flex border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
          {['Tất cả', 'AVAILABLE', 'REJECTED', 'HAVE_REPORT', 'HIDDEN'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedFilter(status as StatusFilterType);
                setCurrentPage(1);
              }}
              className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors 
                ${
                  selectedFilter === status
                    ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {status === 'Tất cả'
                ? 'Tất cả'
                : status === 'AVAILABLE'
                ? 'Đang hoạt động'
                : status === 'REJECTED'
                ? 'Bị từ chối'
                : status === 'HAVE_REPORT'
                ? 'Có báo cáo'
                : status === 'HIDDEN'
                ? 'Đã ẩn'
                : status}
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
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            ⏳ Đang tải dữ liệu...
          </div>
        ) : packages.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Không có gói dịch vụ nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                    Tác giả
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                    Nội dung
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                    Danh mục
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                    Tương tác
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                    Ngày đăng
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {packages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    onClick={() => handleViewDetail(pkg)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 cursor-pointer"
                  >
                    {/* 🧙‍♂️ Tác giả */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center min-w-[150px]">
                        <img
                          src={pkg.seer.avatarUrl}
                          alt={pkg.seer.fullName}
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-sm border border-gray-200 dark:border-gray-700"
                        />
                        <span
                          className="ml-3 text-sm font-medium text-gray-900 dark:text-white truncate max-w-[100px]"
                          title={pkg.seer.fullName}
                        >
                          {pkg.seer.fullName}
                        </span>
                      </div>
                    </td>

                    {/* 📘 Nội dung */}
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                      <div className="flex items-center space-x-2 min-w-[200px] max-w-[300px]">
                        <img
                          src={pkg.imageUrl}
                          alt={pkg.packageTitle}
                          className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                        />
                        <span className="truncate" title={pkg.packageTitle}>
                          {pkg.packageTitle}
                        </span>
                      </div>
                    </td>

                    {/* 🏷️ Danh mục */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {pkg.categories && pkg.categories.length > 0 ? (
                        <div
                          className={`inline-flex ... ${getCategoryColorClass(
                            // Lấy 'name' của category ĐẦU TIÊN
                            pkg.categories[0].name as ServiceCategoryEnum,
                          )}`}
                        >
                          <span className="...">
                            {getCategoryDisplay(pkg.categories[0].name as ServiceCategoryEnum)}

                            {/* Bonus: Hiển thị '...' nếu có nhiều hơn 1 category */}
                            {pkg.categories.length > 1 && (
                              <span
                                className="ml-1"
                                title={pkg.categories.map((c) => c.name).join(', ')}
                              >
                                ...
                              </span>
                            )}
                          </span>
                        </div>
                      ) : (
                        // Hiển thị 'N/A' nếu không có category
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </td>

                    {/* ⚙️ Trạng thái */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <Badge type={'status' as any} value={pkg.status} />
                    </td>

                    {/* 💬 Tương tác */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center justify-center gap-2 min-w-[140px]">
                        <span className="inline-flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">{pkg.likeCount}</span>
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <ThumbsDown className="w-4 h-4" />
                          <span className="text-sm">{pkg.dislikeCount}</span>
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{pkg.totalReviews}</span>
                        </span>
                      </div>
                    </td>

                    {/* ⏰ Ngày đăng */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(pkg.createdAt).toLocaleString('vi-VN')}
                    </td>

                    {/* 🧩 Thao tác */}
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-1 min-w-[120px]">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Trang {currentPage} / {totalPages || 1}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
              currentPage === 1
                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
              currentPage >= totalPages
                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
          onHide={async (id, reason) => {
            try {
              await PackageService.adminConfirm(id, 'HIDDEN', reason);
              alert('Đã ẩn bài viết thành công!');
              window.location.reload();
            } catch (err: any) {
              alert(err.message || 'Lỗi khi ẩn bài viết');
            }
          }}
          onDelete={async (id) => {
            try {
              await PackageService.delete(id);
              alert('Đã xóa bài viết thành công!');
              window.location.reload();
            } catch (err: any) {
              alert(err.message || 'Lỗi khi xóa bài viết');
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

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && packageToDelete && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              ⚠️ Xác nhận xóa
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Bạn có chắc chắn muốn xóa gói dịch vụ{' '}
              <strong>"{packageToDelete.packageTitle}"</strong>?
              <br />
              <br />
              Các booking chưa hoàn thành (PENDING, CONFIRMED) sẽ được tự động hoàn tiền và hủy.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPackageToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                           rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
