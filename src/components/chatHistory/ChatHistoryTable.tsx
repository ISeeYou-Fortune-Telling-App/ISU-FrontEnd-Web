'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Eye, X, ChevronLeft, ChevronRight, ChevronDown, Search, Clock } from 'lucide-react';
import { Conversation, ConversationStatus } from '@/types/chatHistory/chatHistory.type';
import { ChatHistoryService } from '@/services/chatHistory/chatHistory.service';
import { MessagesService } from '@/services/messages/messages.service';
import { ChatHistoryModal } from './ChatHistoryModal';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from '@/components/common/Badge';
import { useScrollToTopOnPageChange } from '@/hooks/useScrollToTopOnPageChange';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAdminChatContext } from '@/contexts/AdminChatContext';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 10;

const STATUS_LABELS: Record<ConversationStatus | 'ALL', string> = {
  ALL: 'Tất cả',
  WAITING: 'Chờ xử lý',
  ACTIVE: 'Đang hoạt động',
  ENDED: 'Đã kết thúc',
  CANCELLED: 'Bị hủy',
};

// Map status sang tiếng Việt cho Badge
const STATUS_DISPLAY: Record<ConversationStatus, string> = {
  WAITING: 'Chờ xử lý',
  ACTIVE: 'Đang hoạt động',
  ENDED: 'Đã kết thúc',
  CANCELLED: 'Bị hủy',
};

const ChatHistoryTable: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [paging, setPaging] = useState({ page: 1, totalPages: 1, total: 0 });

  const debouncedSearch = useDebounce(searchTerm, 1000);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);

  // ✅ Use shared socket context
  const { socketConnected, subscribeToMessages } = useAdminChatContext();

  // ✅ Subscribe to messages
  useEffect(() => {
    console.log('📝 [ChatHistoryTable] Subscribing to messages...');
    const unsubscribe = subscribeToMessages((msg) => {
      console.log('🔔 [ChatHistoryTable] New message received:', msg);
      console.log('🔌 [ChatHistoryTable] Socket connected:', socketConnected);
      console.log('📦 [ChatHistoryTable] Current conversations count:', conversations.length);

      // Update conversation list: đẩy conversation lên đầu và tăng unread count
      setConversations((prev) => {
        const convId = msg.conversationId;
        const existingConv = prev.find((c) => c.conversationId === convId);

        if (!existingConv) {
          // Nếu conversation chưa có trong list, fetch lại
          console.log('⚠️ [ChatHistoryTable] Conversation not found, refetching...');
          fetchConversations(1, false);
          return prev;
        }

        // Tăng unread count (giả sử admin chưa đọc)
        const isFromAdmin = msg.senderId === localStorage.getItem('userId');
        const updatedConv = {
          ...existingConv,
          lastMessageTime: msg.createdAt,
          lastMessageContent: msg.textContent,
          adminUnreadCount: isFromAdmin
            ? existingConv.adminUnreadCount
            : (existingConv.adminUnreadCount || 0) + 1,
        };

        console.log('✅ [ChatHistoryTable] Updated conversation:', updatedConv);
        console.log('📊 [ChatHistoryTable] Admin unread count:', updatedConv.adminUnreadCount);

        // Nếu đang xem conversation này (selectedConversation), không đẩy lên top, chỉ update in-place
        if (selectedConversation?.id === convId) {
          console.log(
            '👁️ [ChatHistoryTable] Currently viewing this conversation, updating in-place',
          );
          return prev.map((c) => (c.conversationId === convId ? updatedConv : c));
        }

        // Nếu không đang xem, đẩy lên đầu
        console.log('⬆️ [ChatHistoryTable] Moving conversation to top');
        const filtered = prev.filter((c) => c.conversationId !== convId);
        return [updatedConv, ...filtered];
      });
    });

    return unsubscribe;
  }, [socketConnected, subscribeToMessages, conversations.length, selectedConversation]);

  // Scroll to top when page changes
  useScrollToTopOnPageChange(paging.page, tableRef);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchConversations = async (page = 1, showSkeleton = false) => {
    try {
      if (showSkeleton) setLoading(true);
      else setIsRefreshing(true);

      const statusKey = Object.entries(STATUS_LABELS).find(
        ([_, label]) => label === selectedStatus,
      )?.[0];

      const res = await ChatHistoryService.getConversations({
        page,
        limit: ITEMS_PER_PAGE,
        participantName: debouncedSearch || undefined,
        status: statusKey !== 'ALL' ? (statusKey as ConversationStatus) : undefined,
        sortBy: 'lastMessageTime',
        sortType: 'desc',
        type: 'BOOKING_SESSION',
      });

      setConversations(res.data);
      setPaging({
        page: (res.paging?.page ?? 0) + 1,
        totalPages: res.paging?.totalPages ?? 1,
        total: res.paging?.total ?? res.data.length,
      });
    } catch (err) {
      console.error('Lỗi khi tải hội thoại:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConversations(1, true);
  }, []);

  useEffect(() => {
    if (!loading) fetchConversations(paging.page, false);
  }, [selectedStatus, debouncedSearch, paging.page]);

  const goToNextPage = () => {
    if (paging.page < paging.totalPages && !isRefreshing) {
      setPaging((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const goToPrevPage = () => {
    if (paging.page > 1 && !isRefreshing) {
      setPaging((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleEndSession = async (conversationId: string) => {
    const result = await Swal.fire({
      title: 'Kết thúc phiên chat?',
      text: 'Bạn có chắc chắn muốn kết thúc phiên chat này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Kết thúc',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        await MessagesService.endChatSession(conversationId);
        await Swal.fire({
          title: 'Thành công!',
          text: 'Đã kết thúc phiên chat',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        // Refresh data
        fetchConversations(paging.page, false);
      } catch (error: any) {
        await Swal.fire({
          title: 'Lỗi!',
          text: error.message || 'Không thể kết thúc phiên chat',
          icon: 'error',
        });
      }
    }
  };

  const handleExtendSession = async (conversationId: string) => {
    const result = await Swal.fire({
      title: 'Gia hạn phiên chat',
      text: 'Nhập số phút muốn gia hạn:',
      input: 'number',
      inputAttributes: {
        min: '1',
        max: '120',
        step: '1',
      },
      inputValue: '15',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Gia hạn',
      cancelButtonText: 'Hủy',
      inputValidator: (value) => {
        const num = parseInt(value);
        if (!value || num < 1) {
          return 'Vui lòng nhập số phút hợp lệ (tối thiểu 1 phút)';
        }
        if (num > 120) {
          return 'Số phút không được vượt quá 120 phút';
        }
        return null;
      },
    });

    if (result.isConfirmed && result.value) {
      try {
        const additionalMinutes = parseInt(result.value);
        await MessagesService.extendChatSession(conversationId, additionalMinutes);
        await Swal.fire({
          title: 'Thành công!',
          text: `Đã gia hạn thêm ${additionalMinutes} phút`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        // Refresh data
        fetchConversations(paging.page, false);
      } catch (error: any) {
        await Swal.fire({
          title: 'Lỗi!',
          text: error.message || 'Không thể gia hạn phiên chat',
          icon: 'error',
        });
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      ref={tableRef}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700"
    >
      {/* Search + Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-grow mr-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khách hàng hoặc seer..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPaging((prev) => ({ ...prev, page: 1 }));
            }}
          />
        </div>

        <div className="relative flex-shrink-0" ref={statusDropdownRef}>
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-400 dark:border-gray-600"
          >
            <span>{selectedStatus}</span>
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform ${
                isStatusDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isStatusDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-20 animate-fadeIn">
              <div className="py-1">
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => {
                      setSelectedStatus(label);
                      setIsStatusDropdownOpen(false);
                      setPaging((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-400 dark:border-gray-700">
        <table className="min-w-full table-fixed divide-y divide-gray-400 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="w-[230px] px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Người tham gia
              </th>
              <th className="w-[250px] px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tin nhắn gần nhất
              </th>
              <th className="w-[120px] text-center px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Thời lượng
              </th>
              <th className="w-[150px] text-center px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="w-[200px] text-center px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="text-end px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-400 dark:divide-gray-700">
            {conversations.map((conv) => (
              <tr key={conv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={conv.seerAvatarUrl || '/default_avatar.jpg'}
                        alt={conv.seerName || 'Seer'}
                        className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {conv.seerName || 'Không rõ'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Nhà tiên tri</div>
                      </div>
                    </div>
                    {(conv.adminUnreadCount ?? 0) > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full ml-2">
                        {conv.adminUnreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={conv.customerAvatarUrl || '/default_avatar.jpg'}
                      alt={conv.customerName || 'Customer'}
                      className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {conv.customerName || 'Ẩn danh'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Khách hàng</div>
                    </div>
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
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 text-center">
                  {conv.sessionDurationMinutes ? `${conv.sessionDurationMinutes} phút` : '-'}
                </td>
                <td className="px-4 py-3">
                  <Badge type="AccountStatus" value={STATUS_DISPLAY[conv.status]} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {conv.sessionStartTime ? (
                    <div className="flex flex-col items-center">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(conv.sessionStartTime).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(conv.sessionStartTime).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => setSelectedConversation(conv)}
                    className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 p-1 transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleExtendSession(conv.conversationId)}
                    disabled={conv.status === 'ENDED' || conv.status === 'CANCELLED'}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Gia hạn phiên"
                  >
                    <Clock className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEndSession(conv.conversationId)}
                    disabled={conv.status === 'ENDED' || conv.status === 'CANCELLED'}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Kết thúc phiên"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-400 dark:border-gray-700 mt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Trang {paging.page}/{paging.totalPages} • {paging.total} cuộc hội thoại
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={paging.page <= 1 || isRefreshing}
            className={`p-2 rounded-md transition ${
              paging.page <= 1 || isRefreshing
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={goToNextPage}
            disabled={paging.page >= paging.totalPages || isRefreshing}
            className={`p-2 rounded-md transition ${
              paging.page >= paging.totalPages || isRefreshing
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
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

export default ChatHistoryTable;
