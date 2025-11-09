'use client';

import React, { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { MessagesService } from '@/services/messages/messages.service';
import type { ConversationSession, ConversationParams } from '@/types/messages/messages.type';
import { useDebounce } from '@/hooks/useDebounce';
import { MessageDetailPanel } from './MessageDetailPanel';
import { useAdminChat } from '@/hooks/useAdminChat';
import { CreateConversationModal } from './CreateConversationModal';

const ITEMS_PER_PAGE = 10;

export const MessageTable: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messageMode, setMessageMode] = useState<'group' | 'individual'>('individual');
  const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ---- Fetch conversations ----
  const fetchConversations = async () => {
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
      setConversations(res);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải danh sách hội thoại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [page, debouncedSearch]);

  // ✅ Dùng socket chung cho cả table và panel
  const { socketConnected, messages, joinConversation, sendMessage, clearMessages } = useAdminChat({
    onNewMessage: (msg) => {
      setConversations((prev) => {
        const idx = prev.findIndex(
          (c) => c.conversationId === msg.conversationId || c.id === msg.conversationId,
        );

        if (idx !== -1) {
          const updated = {
            ...prev[idx],
            lastMessageContent: msg.textContent,
            lastMessageTime: msg.createdAt,
          };
          const newList = [...prev];
          newList.splice(idx, 1);
          newList.unshift(updated);
          return newList;
        }
        return prev;
      });
    },
  });

  // ---- Select conversation ----
  const handleSelectConversation = (convId: string) => {
    if (messageMode === 'group') {
      const newSelected = new Set(selectedConversations);
      if (newSelected.has(convId)) newSelected.delete(convId);
      else newSelected.add(convId);
      setSelectedConversations(newSelected);
    } else {
      setSelectedConvId(convId);
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="w-full bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex mb-4">
        <button
          onClick={() => {
            setMessageMode('group');
          }}
          className={`flex-1 text-center py-2 text-sm font-medium transition duration-200 rounded-lg ${
            messageMode === 'group'
              ? 'bg-white shadow text-gray-900 dark:bg-gray-800 dark:text-white'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Soạn tin nhắn nhiều người
        </button>
        <button
          onClick={() => {
            setMessageMode('individual');
          }}
          className={`flex-1 text-center py-2 text-sm font-medium transition duration-200 rounded-lg ${
            messageMode === 'individual'
              ? 'bg-white shadow text-gray-900 dark:bg-gray-800 dark:text-white'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Soạn tin nhắn một người
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-400 dark:border-gray-700 h-[700px] flex">
        {/* --- Left Column --- */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col p-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Danh sách hội thoại
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {messageMode === 'group'
              ? 'Chọn nhiều người để gửi tin hàng loạt'
              : 'Tra cứu và quản lý các cuộc hội thoại'}
          </p>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Loading / Error */}
          {loading && <p className="text-center text-gray-500">Đang tải...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* Conversations */}
          {!loading && !error && (
            <div className="flex-grow overflow-y-auto pr-2 space-y-2">
              {conversations.length === 0 ? (
                <p className="text-center text-gray-500">Không có hội thoại nào.</p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                      selectedConvId === conv.id || selectedConversations.has(conv.id)
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
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
                        alt={conv.customerName || conv.seerName || 'User'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {conv.customerName || conv.seerName || '(Không rõ tên)'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                          {conv.lastMessageContent || '(Chưa có tin nhắn)'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(conv.lastMessageTime).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* --- Cuối danh sách hội thoại --- */}
          {messageMode === 'individual' && (
            <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-2 text-sm font-medium text-center text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:opacity-90 transition"
              >
                + Tạo hội thoại mới
              </button>
            </div>
          )}
        </div>

        {/* --- Right Column (detail) --- */}
        <MessageDetailPanel
          conversationId={selectedConvId}
          messageMode={messageMode}
          selectedConversations={selectedConversations}
          joinConversation={joinConversation}
          sendMessage={sendMessage}
          clearMessages={clearMessages}
          messages={messages} // không cần "as Message[]"
          socketConnected={socketConnected}
        />
      </div>
      <CreateConversationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={(newConv) => {
          // ✅ chèn hội thoại mới vào đầu danh sách
          setConversations((prev) => [newConv as unknown as ConversationSession, ...prev]);

          // ✅ mở luôn panel hội thoại vừa tạo
          setSelectedConvId(newConv.id);
        }}
      />
    </div>
  );
};
