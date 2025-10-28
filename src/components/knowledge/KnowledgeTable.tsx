'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { KnowledgeService } from '@/services/knowledge/knowledge.service';
import {
  Knowledge,
  KnowledgeStatus,
  KnowledgeCategory,
} from '@/services/knowledge/knowledge.type';
import { KnowledgeDetailModal } from './KnowledgeDetailModal';

// ---------- Badge hiển thị danh mục ----------
const CategoryBadge = ({ value }: { value: string }) => {
  let colorClass =
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
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

// ---------- Main Component ----------
export const KnowledgeTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] =
    useState<StatusFilterType>('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKnowledge, setSelectedKnowledge] = useState<Knowledge | null>(
    null
  );

  // 🔹 Mock dữ liệu Knowledge (demo)
  const mockKnowledges: Knowledge[] = Array.from({ length: 42 }).map(
    (_, i) => ({
      id: i + 1,
      title: `Bài viết số ${i + 1}: Kiến thức huyền học`,
      excerpt: 'Khám phá những khía cạnh bí ẩn của số mệnh và tâm linh...',
      categories:
        i % 3 === 0
          ? ['Cung Hoàng Đạo']
          : i % 3 === 1
          ? ['Ngũ Hành']
          : ['Tarot'],
      views: 1200 + i * 5,
      status:
        i % 3 === 0
          ? 'Đã xuất bản'
          : i % 3 === 1
          ? 'Bản nháp'
          : 'Đã lưu trữ',
      publishedDate: `12:30 12/0${(i % 9) + 1}/2025`,
      updatedDate: `13:00 15/0${(i % 9) + 1}/2025`,
    })
  );

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

  // 🔹 Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔹 Lọc danh sách Knowledge
  const filteredKnowledges = mockKnowledges.filter((k) => {
    const matchSearch =
      k.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      selectedStatus === 'Tất cả' || k.status === selectedStatus;
    const matchCategory =
      selectedCategory === 'Tất cả' || k.categories.includes(selectedCategory);
    return matchSearch && matchStatus && matchCategory;
  });

  const totalItems = filteredKnowledges.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentKnowledges = filteredKnowledges.slice(startIndex, endIndex);

  const getStatusClass = (status: KnowledgeStatus) => {
    if (status === 'Đã xuất bản')
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (status === 'Bản nháp')
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (status === 'Đã ẩn')
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    if (status === 'Đã lưu trữ')
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    return '';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* ----------------- SEARCH + CATEGORY ----------------- */}
      <div className="flex items-center space-x-3 mb-4 relative">
        {/* Search */}
        <div className="relative flex-1">
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
              className={`w-4 h-4 ml-1 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
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
      </div>

      {/* ----------------- FILTER STATUS, TABLE, PAGINATION, MODAL ----------------- */}
      {/* Giữ nguyên phần phía dưới như bản của bạn — không cần sửa */}
    </div>
  );
};
