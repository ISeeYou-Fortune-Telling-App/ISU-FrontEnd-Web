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
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { PostDetailModal } from './PackageDetailModal';
import { PackageService } from '@/services/packages/package.service';
import { ServicePackage } from '@/services/packages/package.type';

type StatusFilterType = 'Tất cả' | 'AVAILABLE' | 'DISABLED' | 'HIDDEN';

const ITEMS_PER_PAGE = 10;

export const PackageTable: React.FC = () => {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<StatusFilterType>('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [loading, setLoading] = useState(false);

  // 🧠 Gọi API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await PackageService.getAll({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sortType: 'desc',
          sortBy: 'createdAt',
        });
        setPackages(res.data);
      } catch (err) {
        console.error('❌ Lỗi khi tải danh sách gói:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  // 🔍 Filter + Search
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.packageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.packageContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.seer.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedFilter === 'Tất cả' || pkg.status === selectedFilter;
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredPackages.length;
  const totalPages = 1; // Có thể update từ backend sau

  const goToNextPage = () => setCurrentPage((prev) => prev + 1);
  const goToPrevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  const handleReject = (pkg: ServicePackage) => {
    console.log('❌ Đã từ chối gói:', pkg.id, pkg.packageTitle);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      {/* Search */}
      <div className="relative mb-4">
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

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4">
        <div className="inline-flex border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
          {['Tất cả', 'AVAILABLE', 'DISABLED', 'HIDDEN'].map((status) => (
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
                : status === 'DISABLED'
                ? 'Ngưng hoạt động'
                : 'Đã ẩn'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">⏳ Đang tải dữ liệu...</div>
        ) : filteredPackages.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">Không có gói dịch vụ nào</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="w-[150px] px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Tác giả
                </th>
                <th className="w-[260px] px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Tiêu đề
                </th>
                <th className="w-[140px] px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Danh mục
                </th>
                <th className="w-[130px] px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Trạng thái
                </th>
                <th className="w-[140px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Tương tác
                </th>
                <th className="w-[160px] px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Ngày đăng
                </th>
                <th className="w-[180px] px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPackages.map((pkg) => (
                <tr
                  key={pkg.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                >
                  {/* 🧙‍♂️ Tác giả */}
                  <td className="px-6 py-3 w-[180px] whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={pkg.seer.avatarUrl}
                      alt={pkg.seer.fullName}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-sm border border-gray-200 dark:border-gray-700"
                    />
                    <span
                      className="ml-3 text-sm font-medium text-gray-900 dark:text-white truncate max-w-[130px]"
                      title={pkg.seer.fullName}
                    >
                      {pkg.seer.fullName}
                    </span>
                  </div>
                </td>

                  {/* 📘 Tiêu đề */}
                  <td className="px-6 py-3 w-[260px] text-sm text-gray-800 dark:text-gray-200">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.packageTitle}
                        className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                      />
                      <span
                        className="truncate block max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis"
                        title={pkg.packageTitle}
                      >
                        {pkg.packageTitle}
                      </span>
                    </div>
                  </td>


                  {/* 🏷️ Danh mục */}
                  <td className="px-6 py-3 w-[140px] whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 truncate">
                    {pkg.category ?? '—'}
                  </td>

                  {/* ⚙️ Trạng thái */}
                  <td className="px-6 py-3 w-[130px] whitespace-nowrap text-sm">
                    <Badge type="status" value={pkg.status} />
                  </td>

                  {/* 💬 Tương tác */}
                  <td className="px-6 py-3 w-[140px] whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center justify-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4 text-blue-500" />
                        <span>{pkg.likeCount}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <ThumbsDown className="w-4 h-4 text-red-500" />
                        <span>{pkg.dislikeCount}</span>
                      </span>
                    </div>
                  </td>

                  {/* ⏰ Ngày đăng */}
                  <td className="px-6 py-3 w-[160px] whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 truncate">
                    {new Date(pkg.createdAt).toLocaleString('vi-VN')}
                  </td>

                  {/* 🧩 Thao tác */}
                  <td className="px-6 py-3 w-[120px] whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                    <button
                      onClick={() => setSelectedPackage(pkg)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReject(pkg)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="Từ chối gói"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Trang {currentPage} / {totalPages}
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
            className="p-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {/* <PostDetailModal post={selectedPackage} onClose={() => setSelectedPackage(null)} /> */}
    </div>
  );
};
