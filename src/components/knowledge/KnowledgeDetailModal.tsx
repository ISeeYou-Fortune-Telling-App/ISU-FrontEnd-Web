'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Image as ImageIcon, Trash2, Edit2, Calendar, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import ReactMarkdown from 'react-markdown';
import type { KnowledgeItem } from '@/types/knowledge/knowledge.type';
import { KnowledgeService } from '@/services/knowledge/knowledge.service';
import { KnowledgeEditModal } from './KnowledgeEditModal';

// --- 1. Props interface ---
interface KnowledgeDetailModalProps {
  knowledge: KnowledgeItem | null;
  onClose: () => void;
  onRefresh?: () => void;
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
  onRefresh,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!knowledge) return null;

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: `Bạn có chắc chắn muốn xóa bài viết "${knowledge.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
    });

    if (result.isConfirmed) {
      try {
        await KnowledgeService.deleteKnowledgeItem(knowledge.id);
        Swal.fire({
          title: 'Đã xóa!',
          text: 'Bài viết đã được xóa thành công.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
        onClose();
        onRefresh?.();
      } catch (error) {
        console.error('Error deleting knowledge:', error);
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không thể xóa bài viết. Vui lòng thử lại.',
          icon: 'error',
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
      }
    }
  };

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

          {/* Ảnh minh họa - Đưa lên trước */}
          {knowledge.imageUrl && (
            <div className="space-y-2 pt-2">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200">Ảnh minh họa</h4>
              <img
                src={knowledge.imageUrl}
                alt={knowledge.title}
                className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>
          )}

          {/* Danh mục & Trạng thái */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200">Danh mục</h4>
              <div className="flex flex-wrap">
                {knowledge.categories.map((cat, index) => (
                  <CategoryBadge key={index} value={cat} />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200">Trạng thái</h4>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  knowledge.status === 'PUBLISHED'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : knowledge.status === 'DRAFT'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                }`}
              >
                {knowledge.status === 'PUBLISHED'
                  ? 'Đã xuất bản'
                  : knowledge.status === 'DRAFT'
                  ? 'Bản nháp'
                  : 'Đã ẩn'}
              </span>
            </div>
          </div>

          {/* Nội dung */}
          <div className="space-y-2 pt-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200">Nội dung bài viết</h4>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:font-bold">
              <ReactMarkdown>
                {knowledge.content?.replace(/\\n/g, '\n') || '(Không có nội dung)'}
              </ReactMarkdown>
            </div>
          </div>

          {/* Lượt xem */}
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center pt-2">
            <Eye className="w-4 h-4 mr-1" />
            <span className="font-medium mr-1">{knowledge.viewCount.toLocaleString('vi-VN')}</span>
            lượt xem
          </p>
        </div>

        {/* --- Footer --- */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="w-5 h-5 mr-2" /> Chỉnh sửa
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5 mr-2" /> Xóa
          </button>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {showEditModal && (
        <KnowledgeEditModal
          knowledge={knowledge}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            onRefresh?.();
            onClose();
          }}
        />
      )}
    </div>
  );
};
