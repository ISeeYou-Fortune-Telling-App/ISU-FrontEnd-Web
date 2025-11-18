'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Image as ImageIcon,
  Trash2,
  Edit2,
  Calendar,
  ChevronDown,
  Plus,
  Eye,
} from 'lucide-react';
import type { KnowledgeItem } from '@/types/knowledge/knowledge.type';

// --- 1. Props interface ---
interface KnowledgeDetailModalProps {
  knowledge: KnowledgeItem | null;
  onClose: () => void;
}

// --- 2. Badge hiển thị danh mục ---
const CategoryBadge = ({ value }: { value: string }) => {
  let colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  if (value === 'Ngũ Hành')
    colorClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  if (value === 'Nhân Tướng Học')
    colorClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
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

// --- 3. Main modal ---
export const KnowledgeDetailModal: React.FC<KnowledgeDetailModalProps> = ({
  knowledge,
  onClose,
}) => {
  if (!knowledge) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 shadow-2xl flex flex-col rounded-xl overflow-hidden border border-gray-400 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header --- */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Knowledge – Chi tiết bài viết
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* --- Content scrollable --- */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* Title + Date */}
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{knowledge.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(knowledge.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>

          {/* Nội dung */}
          <div className="space-y-2 pt-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200">Nội dung bài viết</h4>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
              {knowledge.content || '(Không có nội dung)'}
            </div>
          </div>

          {/* Danh mục */}
          <div className="space-y-2 pt-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200">Danh mục</h4>
            <div className="flex flex-wrap items-center">
              {knowledge.categories.map((cat, index) => (
                <CategoryBadge key={index} value={cat} />
              ))}
              <button className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:opacity-80 transition">
                <Plus className="w-4 h-4 mr-1" /> Thêm danh mục
              </button>
            </div>
          </div>

          {/* Trạng thái */}
          <div className="space-y-2 pt-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200">Trạng thái</h4>
            <div className="inline-block relative">
              <select
                value={knowledge.status}
                className="appearance-none block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                            text-gray-900 dark:text-gray-200 py-2 pl-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled
              >
                <option value="PUBLISHED">Đã xuất bản</option>
                <option value="DRAFT">Bản nháp</option>
                <option value="HIDDEN">Đã ẩn</option>
              </select>
              <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 w-5 h-5 my-auto mr-2 text-gray-400" />
            </div>
          </div>

          {/* Ảnh minh họa */}
          <div className="space-y-2 pt-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200">Ảnh minh họa</h4>
            {knowledge.imageUrl ? (
              <img
                src={knowledge.imageUrl}
                alt={knowledge.title}
                className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-full h-40 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200 dark:border-blue-700">
                <ImageIcon className="w-10 h-10 text-blue-400 dark:text-blue-600" />
              </div>
            )}
          </div>

          {/* Lượt xem */}
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center pt-2">
            <Eye className="w-4 h-4 mr-1" />
            <span className="font-medium">{knowledge.viewCount.toLocaleString('vi-VN')}</span> lượt
            xem
          </p>
        </div>

        {/* --- Footer --- */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between space-x-3">
          <button className="flex items-center justify-center flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            <Edit2 className="w-5 h-5 mr-2" /> Lưu thay đổi
          </button>
          <button className="flex items-center justify-center flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
            <Trash2 className="w-5 h-5 mr-2" /> Xóa
          </button>
        </div>
      </motion.div>
    </div>
  );
};
