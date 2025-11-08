'use client';

import React, { useState, useEffect, useRef } from 'react';
import { KnowledgeDetailModal } from './KnowledgeDetailModal';
import { Search, Eye, Trash2, ChevronLeft, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { KnowledgeService } from '@/services/knowledge/knowledge.service';
import type {
  KnowledgeItem,
  KnowledgeCategory,
  KnowledgeStatus,
} from '@/types/knowledge/knowledge.type';
import { useDebounce } from '@/hooks/useDebounce';

const ITEMS_PER_PAGE = 10;

const CategoryBadge = ({ value }: { value: string }) => {
  let colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  if (value === 'Ngũ Hành')
    colorClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  if (value === 'Tarot')
    colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass} mr-2 mb-1`}
    >
      {value}
    </span>
  );
};

export const KnowledgeTable: React.FC = () => {
  const [selectedKnowledge, setSelectedKnowledge] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [selectedStatus, setSelectedStatus] = useState<'Tất cả' | KnowledgeStatus>('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [knowledges, setKnowledges] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- Fetch danh mục ---
  useEffect(() => {
    (async () => {
      try {
        const res = await KnowledgeService.getCategories({
          page: 1,
          limit: 50,
          sortType: 'asc',
          sortBy: 'name',
        });
        setCategories(res.data);
      } catch (err) {
        console.error('❌ Lỗi khi tải danh mục tri thức:', err);
      }
    })();
  }, []);

  // --- Fetch tất cả bài viết ---
  const fetchAllKnowledges = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await KnowledgeService.getKnowledges({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sortType: 'desc',
        sortBy: 'createdAt',
      });
      setKnowledges(res.data);
      setTotalPages(res.paging?.totalPages ?? 1);
    } catch (err) {
      console.error('❌ Lỗi khi tải danh sách tri thức:', err);
    } finally {
      if (isInitial) setLoading(false);
      else setRefreshing(false);
    }
  };

  const handleViewDetail = async (id: string) => {
    try {
      setLoadingDetail(true);
      const detail = await KnowledgeService.getKnowledgeById(id);
      setSelectedKnowledge(detail);
      setIsModalOpen(true);
    } catch (err) {
      console.error('❌ Lỗi khi tải chi tiết bài viết:', err);
      alert('Không thể tải chi tiết bài viết.');
    } finally {
      setLoadingDetail(false);
    }
  };

  // --- Fetch theo tìm kiếm / bộ lọc ---
  const searchData = async () => {
    setRefreshing(true);
    try {
      const queryCategoryId =
        selectedCategory !== 'Tất cả'
          ? categories.find((c) => c.name === selectedCategory)?.id
          : undefined;

      const res = await KnowledgeService.searchKnowledgeItem({
        title: debouncedSearch || undefined,
        categoryIds: queryCategoryId ? [queryCategoryId] : undefined,
        status: selectedStatus !== 'Tất cả' ? (selectedStatus as KnowledgeStatus) : undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sortType: 'desc',
        sortBy: 'createdAt',
      });

      setKnowledges(res.data);
      setTotalPages(res.paging?.totalPages ?? 1);
    } catch (err) {
      console.error('❌ Lỗi khi tìm kiếm tri thức:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // --- Load dữ liệu lần đầu ---
  useEffect(() => {
    fetchAllKnowledges(true);
  }, []);

  // --- Khi filter/search thay đổi ---
  useEffect(() => {
    if (!loading) {
      if (debouncedSearch || selectedStatus !== 'Tất cả' || selectedCategory !== 'Tất cả') {
        searchData();
      } else {
        fetchAllKnowledges(false);
      }
    }
  }, [debouncedSearch, selectedStatus, selectedCategory, currentPage, categories]);

  // --- Click ra ngoài để đóng dropdown ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusClass = (status: KnowledgeStatus) => {
    if (status === 'PUBLISHED')
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (status === 'DRAFT')
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (status === 'HIDDEN') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    return '';
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  if (loading)
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        Đang tải danh sách bài viết...
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
      {/* --- SEARCH + CATEGORY DROPDOWN --- */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-grow mr-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Dropdown Category */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 
                       dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-400 dark:border-gray-600"
          >
            <span>{selectedCategory}</span>
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform ${
                isCategoryDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isCategoryDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 
                            ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-10 animate-fadeIn"
            >
              <div className="py-1 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedCategory('Tất cả');
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    selectedCategory === 'Tất cả'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-600 font-semibold'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  Tất cả
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      selectedCategory === cat.name
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-600 font-semibold'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
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

      {/* --- FILTER STATUS NGANG --- */}
      <div className="flex space-x-2 mb-5">
        <div className="flex border border-gray-400 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
          {['Tất cả', 'PUBLISHED', 'DRAFT', 'HIDDEN'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status as 'Tất cả' | KnowledgeStatus);
                setCurrentPage(1);
              }}
              className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors ${
                selectedStatus === status
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {status === 'Tất cả'
                ? 'Tất cả'
                : status === 'PUBLISHED'
                ? 'Đã xuất bản'
                : status === 'DRAFT'
                ? 'Bản nháp'
                : 'Đã ẩn'}
            </button>
          ))}
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="overflow-x-auto rounded-lg border border-gray-400 dark:border-gray-700 relative">
        {refreshing && (
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 flex items-center justify-center backdrop-blur-sm pointer-events-none">
            <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-700 table-fixed">
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="w-[290px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Bài viết
              </th>
              <th className="w-[270px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Danh mục
              </th>
              <th className="w-[250px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Trạng thái
              </th>
              <th className="w-[50px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Lượt xem
              </th>
              <th className="w-[130px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Ngày đăng
              </th>
              <th className="w-[130px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Cập nhật
              </th>
              <th className="w-[130px] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-400 dark:divide-gray-700">
            {knowledges.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-gray-500 dark:text-gray-400 italic"
                >
                  Không có bài viết nào.
                </td>
              </tr>
            ) : (
              knowledges.map((k) => (
                <tr
                  key={k.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                >
                  <td className="px-4 py-2 w-[290px]">
                    <div className="flex items-start space-x-3">
                      <img
                        src={k.imageUrl || '/default_image.jpg'}
                        alt={k.title}
                        className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <div
                          className="font-semibold text-sm text-gray-900 dark:text-white truncate max-w-[290px]"
                          title={k.title}
                        >
                          {k.title}
                        </div>
                        <div
                          className="text-xs font-light text-gray-600 dark:text-gray-400 truncate mt-0.5 max-w-[290px]"
                          title={k.content}
                        >
                          {k.content}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-3 text-center w-[310px]">
                    <div className="flex flex-wrap justify-start">
                      {k.categories.map((cat, idx) => (
                        <CategoryBadge key={idx} value={cat} />
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-3 text-center w-[250px]">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                        k.status,
                      )}`}
                    >
                      {k.status === 'PUBLISHED'
                        ? 'Đã xuất bản'
                        : k.status === 'DRAFT'
                        ? 'Bản nháp'
                        : 'Đã ẩn'}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-center w-[50px] text-gray-600 dark:text-gray-300 text-sm">
                    {k.viewCount}
                  </td>

                  <td className="px-6 py-3 text-center w-[160px] text-gray-600 dark:text-gray-300 text-sm ">
                    {formatDateTime(k.createdAt)}
                  </td>

                  <td className="px-6 py-3 text-center w-[160px] text-gray-600 dark:text-gray-300 text-sm">
                    {formatDateTime(k.updatedAt)}
                  </td>

                  <td className="px-4 py-3 text-center w-[150px] space-x-1">
                    <button
                      title="Xem chi tiết"
                      onClick={() => handleViewDetail(k.id)}
                      disabled={loadingDetail}
                      className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 transition-colors disabled:opacity-50"
                    >
                      {loadingDetail ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Eye className="w-5 h-5 inline-block" />
                      )}
                    </button>

                    <button
                      title="Xóa bài viết"
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 inline-block" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION --- */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-400 dark:border-gray-700 mt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Trang {currentPage}/{totalPages}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1 || refreshing}
            className={`p-2 rounded-md transition ${
              currentPage <= 1 || refreshing
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || refreshing}
            className={`p-2 rounded-md transition ${
              currentPage >= totalPages || refreshing
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {isModalOpen && selectedKnowledge && (
        <KnowledgeDetailModal knowledge={selectedKnowledge} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};
