'use client';

import React, { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { MessagesService } from '@/services/messages/messages.service';
import type { ConversationSession, ConversationParams } from '@/types/messages/messages.type';
import { useDebounce } from '@/hooks/useDebounce';
import { useAdminChat } from '@/hooks/useAdminChat';

const ITEMS_PER_PAGE = 10;

export const MessageTable: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedConv, setSelectedConv] = useState<ConversationSession | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('userId');
      setAdminId(storedId);
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- Realtime chat logic ---
  const { socketConnected, messages, joinConversation, sendMessage } = useAdminChat();

  const [input, setInput] = useState('');

  // ---- Fetch API ----
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
      setConversations(res.data);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải danh sách hội thoại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [page, debouncedSearch]);

  // ---- Chọn hội thoại ----
  const handleSelectConversation = (conv: ConversationSession) => {
    setSelectedConv(conv);
    joinConversation(conv.id);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  // ---- Pagination ----
  const goToNextPage = () => page < totalPages && setPage(page + 1);
  const goToPrevPage = () => page > 1 && setPage(page - 1);

  return (
    <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-[700px] flex">
      {/* --- Left Column: Conversation list --- */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col p-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Danh sách hội thoại
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Tra cứu và quản lý các cuộc hội thoại
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
                  onClick={() => handleSelectConversation(conv)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                    selectedConv?.id === conv.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={conv.customerAvatarUrl || '/default-avatar.png'}
                      alt={conv.customerName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {conv.customerName}
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

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700 mt-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Trang {page}/{totalPages}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={page === 1}
                className={`p-1 border rounded-lg ${
                  page === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNextPage}
                disabled={page === totalPages}
                className={`p-1 border rounded-lg ${
                  page === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Right Column: Chat panel --- */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Header */}
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex justify-between">
              <span>{selectedConv.customerName}</span>
              <span className="text-sm">{socketConnected ? '🟢 Online' : '🔴 Offline'}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">Chưa có tin nhắn nào</p>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex mb-3 ${
                      msg.senderId === adminId ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                        msg.senderId === adminId
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none'
                          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none shadow'
                      }`}
                    >
                      <p>{msg.textContent}</p>
                      <p className="text-[10px] mt-1 opacity-70 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="flex p-3 border-t bg-white dark:bg-gray-900">
              <input
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-3 py-2 text-sm dark:bg-gray-800"
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                className="ml-2 w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white flex items-center justify-center hover:scale-105 transition"
                onClick={handleSend}
                disabled={!socketConnected}
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Chọn một hội thoại để bắt đầu
          </div>
        )}
      </div>
    </div>
  );
};
