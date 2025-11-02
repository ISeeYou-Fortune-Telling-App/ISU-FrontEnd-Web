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
import { PostDetailModal } from './PackageDetailModal';
import { PackageService } from '@/services/packages/package.service';
import { ServiceCategoryEnum, ServicePackage } from '@/types/packages/package.type';
import {
  getCategoryDisplay,
  getCategoryColorClass,
  type StatusFilterType,
} from '@/utils/packageHelpers';

const ITEMS_PER_PAGE = 10;

export const mockPackages = Array.from({ length: 100 }).map((_, i) => {
  const id = i + 1;
  const categories: ServiceCategoryEnum[] = [
    ServiceCategoryEnum.PALM_READING,
    ServiceCategoryEnum.CONSULTATION,
    ServiceCategoryEnum.TAROT,
    ServiceCategoryEnum.PHYSIOGNOMY,
  ];
  const statuses = ['AVAILABLE', 'CLOSED', 'HAVE_REPORT', 'HIDDEN'];
  return {
    id: id.toString(),
    packageTitle: `Gói dịch vụ #${id}`,
    packageContent: `Mô tả chi tiết cho gói dịch vụ số ${id}. Bao gồm các phân tích chuyên sâu và tư vấn cá nhân hóa.`,
    imageUrl: `https://picsum.photos/seed/package-${id}/400/300`,
    category: categories[i % categories.length],
    status: statuses[i % statuses.length],
    likeCount: Math.floor(Math.random() * 500),
    dislikeCount: Math.floor(Math.random() * 50),
    createdAt: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60),
    ).toISOString(),
    updatedAt: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60),
    ).toISOString(),
    durationMinutes: Math.floor(Math.random() * 120) + 15,
    price: Math.floor(Math.random() * 1000000) + 100000,
    seer: {
      id: (100 + (i % 10)).toString(),
      fullName: `Thầy/Cô ${
        ['Minh', 'Thiên', 'Phương', 'Hoàng', 'Bảo', 'Thúy', 'Hải', 'Kim', 'Ngọc', 'Trí'][i % 10]
      } ${['Tuệ', 'Ân', 'Tâm', 'Long', 'Linh', 'Anh', 'Đức', 'Hạnh', 'Phúc', 'Lộc'][i % 10]}`,
      avatarUrl: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      avgRating: parseFloat((Math.random() * 5).toFixed(2)),
      totalRates: Math.floor(Math.random() * 1000),
    },
  };
});

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

  // 🧠 Gọi API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // if (selectedCategory !== 'ALL') {
        //   const res = await PackageService.getByCategory(selectedCategory, {
        //     page: currentPage,
        //     limit: ITEMS_PER_PAGE,
        //     sortType: 'desc',
        //     sortBy: 'createdAt',
        //     minPrice: 0,
        //     maxPrice: 10000000,
        //   });
        //   setPackages(res.data);
        // } else {
        //   const res = await PackageService.getAll({
        //     page: currentPage,
        //     limit: ITEMS_PER_PAGE,
        //     sortType: 'desc',
        //     sortBy: 'createdAt',
        //     minPrice: 0,
        //     maxPrice: 10000000,
        //     status: selectedFilter !== 'Tất cả' ? selectedFilter as any : undefined,
        //   });
        //   setPackages(res.data);
        // }

        // FAKE DATA
        setPackages(mockPackages);
      } catch (err) {
        console.error('❌ Lỗi khi tải danh sách gói:', err);
        setError('Không thể tải danh sách gói dịch vụ');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, selectedCategory, selectedFilter]);

  // 🔍 Filter + Search
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.packageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.packageContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.seer.fullName.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (selectedFilter !== 'Tất cả') {
        if (selectedFilter === 'DISABLED') {
          matchesStatus = pkg.status === 'CLOSED' || pkg.status === 'HAVE_REPORT';
        } else {
          matchesStatus = pkg.status === selectedFilter;
        }
      }

      const matchesCategory = selectedCategory === 'ALL' || pkg.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [packages, searchTerm, selectedFilter, selectedCategory]);

  // PAGINATION
  const { totalItems, totalPages, startIndex, endIndex, currentPackages } = useMemo(() => {
    const totalItems = filteredPackages.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentPackages = filteredPackages.slice(startIndex, endIndex);

    return { totalItems, totalPages, startIndex, endIndex, currentPackages };
  }, [filteredPackages, currentPage]);

  const goToNextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const goToPrevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  // ==================== ACTION ====================
  const handleViewDetail = async (pkg: ServicePackage) => {
    try {
      //const res = (await PackageService.getInteractions(pkg.id)) as { data: ServicePackage };
      setSelectedPackage(pkg);
    } catch (err) {
      console.error('❌ Lỗi khi tải chi tiết:', err);
      setSelectedPackage(pkg);
    }
  };

  const handleReject = async (pkg: ServicePackage) => {
    console.log('❌ Đã từ chối gói:', pkg.id, pkg.packageTitle);
  };

  const mapPackageToPost = (pkg: ServicePackage | null) => {
    if (!pkg) return null;

    return {
      id: pkg.id,
      author: pkg.seer.fullName,
      postedAt: new Date(pkg.createdAt).toLocaleString('vi-VN'),
      title: pkg.packageTitle,
      fullContent: pkg.packageContent,
      categories: pkg.category ? [getCategoryDisplay(pkg.category)] : [],
      likes: pkg.likeCount,
      dislikes: pkg.dislikeCount,
      comments: 0,
      reports: 0,
    };
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

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">❌ {error}</p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            ⏳ Đang tải dữ liệu...
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Không có gói dịch vụ nào
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="w-[150px] px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Tác giả
                </th>
                <th className="w-[260px] px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Nội dung
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
              {currentPackages.map((pkg) => (
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

                  {/* 📘 Nội dung */}
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
                  <td className="px-6 py-3 w-[140px] whitespace-nowrap text-sm text-center">
                    <div
                      className={`flex flex-col justify-center items-center gap-[10px] p-[2px] rounded-[5px] ${getCategoryColorClass(
                        pkg.category,
                      )}`}
                    >
                      <span className="font-[Inter] text-[12px] font-normal leading-normal text-center">
                        {getCategoryDisplay(pkg.category)}
                      </span>
                    </div>
                  </td>

                  {/* ⚙️ Trạng thái */}
                  <td className="px-6 py-3 w-[130px] whitespace-nowrap text-sm">
                    <Badge type={'status' as any} value={pkg.status} />
                  </td>

                  {/* 💬 Tương tác */}
                  <td className="px-6 py-3 w-[140px] whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 align-middle">
                    <div className="flex items-center justify-center gap-3">
                      {/* each metric has fixed width so columns stay aligned top-to-bottom */}
                      <span className="inline-flex items-center justify-center gap-1 w-[56px]">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm leading-none">{pkg.likeCount}</span>
                      </span>

                      <span className="inline-flex items-center justify-center gap-1 w-[56px]">
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm leading-none">{pkg.dislikeCount}</span>
                      </span>

                      <span className="inline-flex items-center justify-center gap-1 w-[56px]">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm leading-none">{pkg.dislikeCount}</span>
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
                      onClick={() => handleViewDetail(pkg)}
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

      {/* Modal Detail */}
      {selectedPackage && (
        <PostDetailModal
          post={mapPackageToPost(selectedPackage)}
          onClose={() => setSelectedPackage(null)}
          onReject={(id) => {
            alert('Backend chưa hỗ trợ chức năng này');
          }}
        />
      )}
    </div>
  );
};
