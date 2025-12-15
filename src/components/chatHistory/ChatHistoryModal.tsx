'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Conversation } from '@/types/chatHistory/chatHistory.type';
import { MessagesService } from '@/services/messages/messages.service';
import { Message } from '@/types/messages/messages.type';
import { useAdminChatContext } from '@/contexts/AdminChatContext';

export const ChatHistoryModal: React.FC<{
  conversation: Conversation;
  onClose: () => void;
}> = ({ conversation, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Use shared socket context
  const { socketConnected, subscribeToMessages, joinConversation } = useAdminChatContext();

  // ✅ Subscribe to messages
  useEffect(() => {
    console.log(
      '📝 [ChatHistoryModal] Subscribing to messages for conversation:',
      conversation.conversationId,
    );
    const unsubscribe = subscribeToMessages((msg) => {
      console.log('🔔 [ChatHistoryModal] New message received:', msg);

      // Chỉ thêm tin nhắn nếu thuộc conversation đang xem
      if (msg.conversationId === conversation.conversationId) {
        setMessages((prev) => {
          // Kiểm tra duplicate
          const exists = prev.some((m) => m.id === msg.id);
          if (exists) return prev;

          return [...prev, msg as unknown as Message];
        });
      }
    });

    return unsubscribe;
  }, [socketConnected, subscribeToMessages, conversation.conversationId]);

  useEffect(() => {
    // Disable body scroll khi modal mở
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await MessagesService.getMessagesByConversation(
          conversation.conversationId,
          1,
          100,
        );
        // API trả về desc, reverse để hiển thị từ cũ đến mới
        setMessages(response.data.reverse());
      } catch (err) {
        console.error('Lỗi khi tải tin nhắn:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // ✅ Join conversation để nhận real-time updates
    console.log('🔌 [ChatHistoryModal] Joining conversation:', conversation.conversationId);
    joinConversation(conversation.conversationId);
  }, [conversation.conversationId, joinConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl h-[80vh] rounded-xl shadow-lg flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Lịch sử hội thoại
          </h2>
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <img
                src={conversation.seerAvatarUrl || '/default_avatar.jpg'}
                alt={conversation.seerName || 'Seer'}
                className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
              <span className="font-medium">{conversation.seerName || 'Không rõ'}</span>
              <span className="text-xs">(Nhà tiên tri)</span>
            </div>
            <span>↔</span>
            <div className="flex items-center gap-2">
              <img
                src={conversation.customerAvatarUrl || '/default_avatar.jpg'}
                alt={conversation.customerName || 'Customer'}
                className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
              <span className="font-medium">{conversation.customerName || 'Ẩn danh'}</span>
              <span className="text-xs">(Khách hàng)</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
              Chưa có tin nhắn nào
            </div>
          ) : (
            messages.map((msg) => {
              const isSeer = msg.senderId === conversation.seerId;
              const isCustomer = msg.senderId === conversation.customerId;

              return (
                <div key={msg.id} className={`flex gap-3 ${isCustomer ? 'flex-row-reverse' : ''}`}>
                  <img
                    src={
                      isSeer
                        ? conversation.seerAvatarUrl || '/default_avatar.jpg'
                        : conversation.customerAvatarUrl || '/default_avatar.jpg'
                    }
                    alt={isSeer ? 'Seer' : 'Customer'}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div
                    className={`flex flex-col ${
                      isCustomer ? 'items-end' : 'items-start'
                    } max-w-[70%]`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isCustomer
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {msg.textContent && <p>{msg.textContent}</p>}
                      {msg.imageUrl && (
                        <img src={msg.imageUrl} alt="Image" className="mt-2 rounded-lg max-w-xs" />
                      )}
                      {msg.videoUrl && (
                        <video src={msg.videoUrl} controls className="mt-2 rounded-lg max-w-xs" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};
