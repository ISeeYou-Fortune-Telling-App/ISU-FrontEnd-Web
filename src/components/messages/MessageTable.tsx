'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { MessagesService } from '@/services/messages/messages.service';
import type { ConversationSession, ConversationParams } from '@/types/messages/messages.type';
import { useDebounce } from '@/hooks/useDebounce';
import { MessageDetailPanel } from './MessageDetailPanel';
import { useAdminChat } from '@/hooks/useAdminChat';

const ITEMS_PER_PAGE = 10;

export const MessageTable: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messageMode, setMessageMode] = useState<'group' | 'individual'>('individual');
  const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [page, setPage] = useState(1);

  // 1. Ref để theo dõi container cuộn của danh sách hội thoại
  const conversationListRef = useRef<HTMLDivElement | null>(null);
  // Ref để lưu vị trí cuộn trước đó
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    if (messageMode === 'group') setSelectedConvId(null);
    else setSelectedConversations(new Set());
  }, [messageMode]);

  const fetchConversations = async () => {
    // LƯU vị trí cuộn trước khi tải (để tránh nhấp nháy khi fetch)
    if (conversationListRef.current) {
      scrollPositionRef.current = conversationListRef.current.scrollTop;
    }

    setLoading(true);
    setError(null);
    try {
      const params: ConversationParams = {
        page,
        limit: ITEMS_PER_PAGE,
        sortBy: 'sessionStartTime',
        participantName: debouncedSearch || undefined,
        type: 'ADMIN_CHAT',
      };
      const res = await MessagesService.getSearchConversations(params);

      // Lấy adminId từ localStorage
      const adminId = localStorage.getItem('userId');

      // Lọc bỏ hội thoại của admin với chính mình
      const filtered = res.filter((c: any) => {
        // Nếu cả seerId và customerId đều tồn tại và bằng adminId thì bỏ qua
        const isSelfConversation =
          adminId &&
          c.seerId &&
          c.customerId &&
          c.seerId.toString() === adminId.toString() &&
          c.customerId.toString() === adminId.toString();

        return !isSelfConversation;
      });

      const formatted = filtered.map((c: any) => ({
        ...c,
        unreadForAdmin: c.adminUnreadCount > 0,
      }));
      setConversations(formatted);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải danh sách hội thoại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [page, debouncedSearch]);

  // 2. useEffect để khôi phục vị trí cuộn sau khi conversations được cập nhật
  useEffect(() => {
    if (conversationListRef.current && !loading) {
      // Chỉ khôi phục vị trí cuộn khi KHÔNG ở trang đầu và KHÔNG đang tìm kiếm
      if (page > 1 || debouncedSearch || scrollPositionRef.current > 0) {
        conversationListRef.current.scrollTop = scrollPositionRef.current;
      }
    }
  }, [conversations, loading]);

  const { socketConnected, getMessages, joinConversation, sendMessage, clearMessages } =
    useAdminChat({
      onNewMessage: (msg) => {
        // ⭐ BẮT ĐẦU PHẦN CHỈNH SỬA LOGIC DỊCH CHUYỂN SCROLL
        const currentUserId = localStorage.getItem('userId');
        const isMyMessage = msg.senderId === currentUserId;

        // 3. Khi nhận tin nhắn mới, lưu vị trí cuộn hiện tại trước khi cập nhật state
        if (conversationListRef.current) {
          scrollPositionRef.current = conversationListRef.current.scrollTop;
        }

        setConversations((prev) => {
          const idx = prev.findIndex(
            (c) => c.conversationId === msg.conversationId || c.id === msg.conversationId,
          );

          if (idx !== -1) {
            const isActive = selectedConvId === msg.conversationId || selectedConvId === msg.id;
            const updated = {
              ...prev[idx],
              lastMessageContent: msg.textContent,
              lastMessageTime: msg.createdAt,
              // Cập nhật unread count dựa trên người gửi
              adminUnreadCount: isActive
                ? 0
                : isMyMessage
                ? prev[idx].adminUnreadCount
                : (prev[idx].adminUnreadCount || 0) + 1,
              unreadForAdmin: isActive ? false : isMyMessage ? prev[idx].unreadForAdmin : true,
            };

            const newList = [...prev];

            // ⭐ LOGIC QUYẾT ĐỊNH VỊ TRÍ:
            if (!isMyMessage) {
              // Tin nhắn từ Khách hàng: Cập nhật và ĐẨY lên đầu
              newList.splice(idx, 1);
              newList.unshift(updated);
            } else {
              // Tin nhắn từ Admin (bản thân): Cập nhật tại chỗ (GIỮ nguyên vị trí)
              newList[idx] = updated;
            }

            return newList;
          }
          return prev;
        });
        // ⭐ KẾT THÚC PHẦN CHỈNH SỬA
      },
    });

  const handleSelectConversation = (convId: string) => {
    if (messageMode === 'group') {
      const newSelected = new Set(selectedConversations);
      if (newSelected.has(convId)) newSelected.delete(convId);
      else newSelected.add(convId);
      setSelectedConversations(newSelected);
    } else {
      setSelectedConvId(convId);
      MessagesService.markAsRead(convId);

      // Lưu vị trí cuộn trước khi setState để tránh bị giật khi component re-render
      if (conversationListRef.current) {
        scrollPositionRef.current = conversationListRef.current.scrollTop;
      }

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, unreadForAdmin: false, adminUnreadCount: 0 } : c,
        ),
      );
    }
  };

  return (
    <div className="flex flex-col">
      {/* Thanh chế độ (Không thay đổi) */}
      <div className="w-full bg-gray-200 dark:bg-gray-800 p-1 rounded-xl flex mb-4 border border-gray-400 dark:border-gray-700">
        <button
          onClick={() => setMessageMode('group')}
          className={`flex-1 text-center py-2 text-sm font-medium rounded-lg transition ${
            messageMode === 'group'
              ? 'bg-white shadow text-gray-900 dark:bg-gray-700 dark:text-white'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Soạn tin nhắn nhiều người
        </button>
        <button
          onClick={() => setMessageMode('individual')}
          className={`flex-1 text-center py-2 text-sm font-medium rounded-lg transition ${
            messageMode === 'individual'
              ? 'bg-white shadow text-gray-900 dark:bg-gray-700 dark:text-white'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Soạn tin nhắn một người
        </button>
      </div>

      {/* Khung chính */}
      <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-400 dark:border-gray-700 h-[600px] flex shadow-sm overflow-hidden will-change-transform">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-400 dark:border-gray-700 flex flex-col p-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Danh sách hội thoại
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {messageMode === 'group'
              ? 'Chọn nhiều người để gửi tin hàng loạt'
              : 'Tra cứu và quản lý các cuộc hội thoại'}
          </p>

          {/* Tìm kiếm (Không thay đổi) */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-400 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Danh sách hội thoại */}
          {loading ? (
            <p className="text-center text-gray-500">Đang tải...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            // Gán Ref vào div cuộn
            <div
              ref={conversationListRef}
              className="flex-grow overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-500 dark:scrollbar-track-gray-800"
            >
              {conversations.length === 0 ? (
                <p className="text-center text-gray-500">Không có hội thoại nào.</p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition border ${
                      selectedConvId === conv.id || selectedConversations.has(conv.id)
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-400 dark:border-indigo-600'
                        : conv.unreadForAdmin
                        ? 'bg-indigo-100 dark:bg-indigo-950/30 border-transparent'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {messageMode === 'group' && (
                        <input
                          type="checkbox"
                          checked={selectedConversations.has(conv.id)}
                          onChange={() => handleSelectConversation(conv.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 accent-indigo-600 cursor-pointer"
                        />
                      )}
                      <img
                        src={conv.customerAvatarUrl || conv.seerAvatarUrl || '/default_avatar.jpg'}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover border border-gray-400 dark:border-gray-600"
                      />
                      <div>
                        <p
                          className={`text-sm ${
                            conv.unreadForAdmin
                              ? 'font-semibold text-indigo-700 dark:text-indigo-300'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {conv.customerName || conv.seerName || '(Không rõ tên)'}
                        </p>
                        <p
                          className={`text-xs truncate max-w-[150px] ${
                            conv.unreadForAdmin
                              ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {conv.lastMessageContent?.startsWith('http')
                            ? '[Ảnh/Video]'
                            : conv.lastMessageContent || '(Chưa có tin nhắn)'}
                        </p>
                      </div>
                    </div>
                    {conv.unreadForAdmin && (
                      <div className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                        {conv.adminUnreadCount}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Chat panel (Truyền prop) */}
        <MessageDetailPanel
          conversationId={selectedConvId}
          messageMode={messageMode}
          selectedConversations={selectedConversations}
          joinConversation={joinConversation}
          sendMessage={sendMessage}
          clearMessages={clearMessages}
          messages={getMessages(selectedConvId || '')}
          socketConnected={socketConnected}
          convInfo={conversations.find((c) => c.id === selectedConvId) || null}
        />
      </div>
    </div>
  );
};
