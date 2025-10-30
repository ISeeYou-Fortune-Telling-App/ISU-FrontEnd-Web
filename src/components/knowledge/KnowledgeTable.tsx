'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import { KnowledgeService } from '@/services/knowledge/knowledge.service';
import type {
  KnowledgeItem,
  KnowledgeCategory,
  KnowledgeStatus,
} from '@/types/knowledge/knowledge.type';
import { useDebounce } from '@/hooks/useDebounce';

// ---------- Badge hiển thị danh mục ----------
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

type StatusFilterType = 'Tất cả' | KnowledgeStatus;
const ITEMS_PER_PAGE = 10;

export const KnowledgeTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [selectedStatus, setSelectedStatus] = useState<StatusFilterType>('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [knowledges, setKnowledges] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true); // lần đầu load
  const [refreshing, setRefreshing] = useState(false); // search/filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Fetch categories
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

  // 🔹 Fetch knowledge items
  const fetchData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await KnowledgeService.searchKnowledgeItem({
        title: debouncedSearch || undefined,
        categoryIds:
          selectedCategory !== 'Tất cả'
            ? [categories.find((c) => c.name === selectedCategory)?.id ?? '']
            : undefined,
        status: selectedStatus !== 'Tất cả' ? selectedStatus : undefined,
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

  // lần đầu load
  useEffect(() => {
    fetchData(true);
  }, []);

  // khi search/filter thay đổi
  useEffect(() => {
    if (!loading) fetchData(false);
  }, [debouncedSearch, selectedStatus, selectedCategory, currentPage, categories]);

  // 🔹 Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusClass = (status: KnowledgeStatus) => {
    if (status === 'PUBLISH')
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (status === 'DRAFT')
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (status === 'HIDDEN') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    return '';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* ----------------- SEARCH + CATEGORY ----------------- */}
      <div className="flex flex-wrap items-center gap-3 mb-4 relative">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
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

        {/* Dropdown danh mục */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 
                       dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
          >
            <span>{selectedCategory}</span>
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 
                         ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-10 animate-fadeIn"
            >
              <div className="py-1 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedCategory('Tất cả');
                    setIsDropdownOpen(false);
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
                      setIsDropdownOpen(false);
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

        {/* Dropdown trạng thái */}
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value as StatusFilterType);
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        >
          <option value="Tất cả">Tất cả trạng thái</option>
          <option value="PUBLISH">Đã xuất bản</option>
          <option value="DRAFT">Bản nháp</option>
          <option value="HIDDEN">Đã ẩn</option>
        </select>
      </div>

      {/* ----------------- TABLE ----------------- */}
      <div className="overflow-x-auto relative">
        {(loading || refreshing) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm z-10">
            <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
          </div>
        )}

        <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase font-semibold">
            <tr>
              <th className="w-[350px] px-4 py-3 text-center">Tiêu đề</th>
              <th className="w-[310px] px-4 py-3 text-center">Danh mục</th>
              <th className="w-[100px] px-4 py-3 text-center">Lượt xem</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {knowledges.length === 0 && !loading && !refreshing ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                  Không có bài viết nào phù hợp.
                </td>
              </tr>
            ) : (
              knowledges.map((k) => (
                <tr
                  key={k.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3 font-medium">{k.title}</td>
                  <td className="px-4 py-3">
                    {k.categories.map((cat, idx) => (
                      <CategoryBadge key={idx} value={cat} />
                    ))}
                  </td>
                  <td className="px-4 py-3">{k.viewCount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                        k.status,
                      )}`}
                    >
                      {k.status === 'PUBLISH'
                        ? 'Đã xuất bản'
                        : k.status === 'DRAFT'
                        ? 'Bản nháp'
                        : 'Đã ẩn'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button className="text-blue-500 hover:text-blue-400">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-400">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ----------------- PAGINATION ----------------- */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="flex items-center px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-sm disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Trang trước
        </button>

        <span className="text-gray-600 dark:text-gray-400 text-sm">
          Trang {currentPage} / {totalPages}
        </span>

        <button
          className="flex items-center px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-sm disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Trang sau <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
