'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send, Image as ImageIcon, Video, X } from 'lucide-react';
import { MessagesService } from '@/services/messages/messages.service';
import type { Message } from '@/types/messages/messages.type';

interface Props {
  conversationId: string | null;
  messageMode: 'group' | 'individual';
  selectedConversations: Set<string>;
  joinConversation: (id: string) => void;
  sendMessage: (text: string, conversationIds?: string[]) => void;
  clearMessages: () => void;
  messages: Message[];
  socketConnected: boolean;
}

export const MessageDetailPanel: React.FC<Props> = ({
  conversationId,
  messageMode,
  selectedConversations,
  joinConversation,
  sendMessage,
  clearMessages,
  messages,
  socketConnected,
}) => {
  const [dbMessages, setDbMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAdminId(localStorage.getItem('userId'));
    }
  }, []);

  useEffect(() => {
    if (!conversationId || messageMode === 'group') return;
    clearMessages();
    joinConversation(conversationId);

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await MessagesService.getMessagesByConversation(conversationId);
        setDbMessages(res.data.reverse());
      } catch (err) {
        console.error('Lỗi tải tin nhắn:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, messageMode]);

  const combined = [...dbMessages, ...messages];

  // cuộn xuống khi load lần đầu
  useEffect(() => {
    if (!bottomRef.current || !conversationId) return;
    if (!loading && dbMessages.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [conversationId, loading]);

  // cuộn mượt khi nhận tin mới
  useEffect(() => {
    if (!bottomRef.current) return;
    if (messages.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && (!file || messageMode === 'group')) return;
    const text = input.trim();
    setInput('');

    let imagePath = '';
    let videoPath = '';

    // ❌ Không cho group upload file
    if (messageMode === 'group') {
      const ids = Array.from(selectedConversations);
      if (ids.length > 0) sendMessage(text, ids);
      return;
    }

    // ✅ Chỉ upload file nếu là gửi đơn
    if (file) {
      const formData = new FormData();
      if (file.type.startsWith('image')) formData.append('image', file);
      else if (file.type.startsWith('video')) formData.append('video', file);

      try {
        const res = await MessagesService.uploadChatFile(formData);
        imagePath = res.data.imagePath || '';
        videoPath = res.data.videoPath || '';
      } catch (err) {
        console.error('❌ Upload file lỗi:', err);
      }

      setFile(null);
      setPreview(null);
    }

    if (conversationId) {
      sendMessage(text || imagePath || videoPath);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

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

  if (!conversationId)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Chọn một hội thoại để bắt đầu
      </div>
    );

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-3 text-black flex justify-between items-center">
        <span className="text-xs">{socketConnected ? '🟢 Online' : '🔴 Offline'}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 space-y-3">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Đang tải tin nhắn...</p>
        ) : combined.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Chưa có tin nhắn nào</p>
        ) : (
          combined.map((msg) => {
            const isAdmin = msg.senderId === adminId;
            const isMedia = msg.textContent?.match(/\.(jpg|jpeg|png|gif|mp4|mov|webm)$/i);
            return (
              <div
                key={msg.id || msg.createdAt}
                className={`flex items-end gap-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}
              >
                {!isAdmin && (
                  <img
                    src={msg.customerAvatar || '/default_avatar.jpg'}
                    alt={msg.customerName}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                )}

                <div
                  className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                    isAdmin
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none shadow'
                  }`}
                >
                  {isMedia ? (
                    msg.textContent.match(/\.(mp4|mov|webm)$/i) ? (
                      <video
                        controls
                        className="max-w-[250px] max-h-[180px] rounded-md"
                        src={msg.textContent}
                      />
                    ) : (
                      <img
                        src={msg.textContent}
                        alt="media"
                        className="max-w-[250px] max-h-[180px] rounded-md"
                      />
                    )
                  ) : (
                    <p className="text-sm">{msg.textContent}</p>
                  )}
                  <p className="text-[10px] mt-1 opacity-70 text-right">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </p>
                </div>

                {isAdmin && (
                  <img
                    src={msg.seerAvatar || '/default_avatar.jpg'}
                    alt={msg.seerName}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* preview ảnh/video trước khi gửi */}
      {preview && (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 flex items-center gap-3">
          {file?.type.startsWith('video') ? (
            <video src={preview} className="max-h-[100px] rounded-md" controls />
          ) : (
            <img src={preview} className="h-[100px] rounded-md" alt="preview" />
          )}
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => {
              setFile(null);
              setPreview(null);
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex p-3 border-t bg-white dark:bg-gray-900 items-center">
        <input
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-3 py-2 text-sm dark:bg-gray-800"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          className="ml-2 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon size={18} />
        </button>
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
