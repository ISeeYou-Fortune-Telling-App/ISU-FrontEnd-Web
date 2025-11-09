'use client';

import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { MessagesService } from '@/services/messages/messages.service';
import type { Message } from '@/types/messages/messages.type';
import { useAdminChat } from '@/hooks/useAdminChat';

interface Props {
  conversationId: string | null;
  messageMode: 'group' | 'individual';
  selectedConversations: Set<string>;
}

export const MessageDetailPanel: React.FC<Props> = ({
  conversationId,
  messageMode,
  selectedConversations,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const {
    socketConnected,
    messages: socketMessages,
    joinConversation,
    sendMessage,
    clearMessages,
  } = useAdminChat();

  // --- Lấy adminId từ localStorage ---
  const [adminId, setAdminId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('userId');
      setAdminId(storedId);
    }
  }, []);

  // --- Fetch + join socket khi chọn conversation ---
  useEffect(() => {
    if (!conversationId || messageMode === 'group') return;
    clearMessages();
    joinConversation(conversationId);

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await MessagesService.getMessagesByConversation(conversationId);
        setMessages(res.data.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId, messageMode]);

  // --- Merge tin nhắn cũ + realtime ---
  const combinedMessages = [...messages, ...socketMessages];

  // --- Gửi tin ---
  const handleSend = () => {
    if (!input.trim()) return;

    if (messageMode === 'group') {
      console.log('📢 Gửi tin nhắn hàng loạt:', Array.from(selectedConversations));
      // TODO: gọi API gửi hàng loạt ở đây
    } else if (conversationId) {
      sendMessage(input.trim());
    }

    setInput('');
  };

  // --- Tab nhắn nhiều người ---
  if (messageMode === 'group') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-600 dark:text-gray-300">
        {selectedConversations.size > 0 ? (
          <>
            <p className="mb-3 text-sm">Đã chọn {selectedConversations.size} người nhận</p>
            <div className="flex p-3 border-t bg-white dark:bg-gray-900 w-2/3 rounded-xl shadow">
              <input
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-3 py-2 text-sm dark:bg-gray-800"
                placeholder="Nhập nội dung tin nhắn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                className="ml-2 w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white flex items-center justify-center hover:scale-105 transition"
                onClick={handleSend}
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Hãy chọn người nhận để bắt đầu gửi tin hàng loạt
          </p>
        )}
      </div>
    );
  }

  // --- Tab nhắn 1 người ---
  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Chọn một hội thoại để bắt đầu
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex justify-between items-center">
        <span className="text-sm font-medium">Hội thoại ID: {conversationId}</span>
        <span className="text-xs">{socketConnected ? '🟢 Online' : '🔴 Offline'}</span>
      </div>

      {/* Chat content */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 space-y-3">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Đang tải tin nhắn...</p>
        ) : combinedMessages.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Chưa có tin nhắn nào</p>
        ) : (
          combinedMessages.map((msg) => {
            const isAdmin = msg.senderId === adminId;
            return (
              <div
                key={msg.id || msg.createdAt}
                className={`flex items-end gap-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar người nhận */}
                {!isAdmin && (
                  <img
                    src={msg.customerAvatar || '/default_avatar.jpg'}
                    alt={msg.customerName}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    onError={(e) => (e.currentTarget.src = '/default_avatar.jpg')}
                  />
                )}

                {/* Bubble */}
                <div
                  className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                    isAdmin
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none shadow'
                  }`}
                >
                  <p className="text-sm">{msg.textContent}</p>
                  <p className="text-[10px] mt-1 opacity-70 text-right">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : new Date().toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                  </p>
                </div>

                {/* Avatar admin */}
                {isAdmin && (
                  <img
                    src={msg.seerAvatar || '/default_avatar.jpg'}
                    alt={msg.seerName}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    onError={(e) => (e.currentTarget.src = '/default_avatar.jpg')}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Input box */}
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
    </div>
  );
};
