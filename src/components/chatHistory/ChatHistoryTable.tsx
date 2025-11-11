'use client';

import React, { useState, useEffect } from 'react';
import { Search, Eye, X, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { ChatHistoryService } from '@/services/chatHistory/chatHistory.service';
import { Conversation } from '@/types/chatHistory/chatHistory.type';
import { ChatHistoryModal } from './ChatHistoryModal';

const ITEMS_PER_PAGE = 10;

const ConversationBadge = ({ value }: { value: string }) => {
  let colorClass = 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
  if (value === 'Đang hoạt động' || value === 'ACTIVE')
    colorClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  if (value === 'Đã kết thúc' || value === 'ENDED')
    colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  if (value === 'Bị hủy' || value === 'CANCELLED')
    colorClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colorClass}`}
    >
      {value}
    </span>
  );
};

export const ConversationTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<
    'Tất cả' | 'Đang hoạt động' | 'Đã kết thúc' | 'Bị hủy'
  >('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await ChatHistoryService.getConversations({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          participantName: searchTerm || undefined,
        });
        setConversations(res);
      } catch (err) {
        console.error('Lỗi khi tải hội thoại:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [currentPage, searchTerm]);

  const filtered = conversations.filter((conv) => {
    if (selectedFilter === 'Tất cả') return true;
    if (selectedFilter === 'Đang hoạt động') return conv.status === 'ACTIVE';
    if (selectedFilter === 'Đã kết thúc') return conv.status === 'ENDED';
    if (selectedFilter === 'Bị hủy') return conv.status === 'CANCELLED';
    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
      {/* Search and filter */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên người tham gia..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="flex space-x-2 mb-4">
        <div className="inline-flex border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
          {['Tất cả', 'Đang hoạt động', 'Đã kết thúc', 'Bị hủy'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedFilter(status as any);
                setCurrentPage(1);
              }}
              className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors ${
                selectedFilter === status
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {[
                  'Loại',
                  'Người tham gia',
                  'Tin nhắn gần nhất',
                  'Thời lượng',
                  'Trạng thái',
                  'Thời gian',
                  'Thao tác',
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map((conv) => (
                <tr key={conv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1 text-blue-500" />
                      {conv.conversationType === 'BOOKING_SESSION' ? 'Nhà tiên tri' : 'AI Hỗ trợ'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {conv.customerName || 'Ẩn danh'}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs italic">
                      {conv.seerName || 'Không rõ'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="text-gray-800 dark:text-gray-100 line-clamp-1 max-w-xs">
                      {conv.lastMessageContent || '(Chưa có tin nhắn)'}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs italic">
                      {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleString() : ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {conv.sessionDurationMinutes ? `${conv.sessionDurationMinutes} phút` : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <ConversationBadge value={conv.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {conv.sessionStartTime ? new Date(conv.sessionStartTime).toLocaleString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedConversation(conv)}
                      className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 p-1 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-1 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Trang {currentPage}/{totalPages}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg ${
              currentPage === 1
                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedConversation && (
        <ChatHistoryModal
          conversation={selectedConversation}
          onClose={() => setSelectedConversation(null)}
        />
      )}
    </div>
  );
};
