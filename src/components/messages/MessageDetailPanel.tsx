'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send, Image as ImageIcon, X, Video, Phone } from 'lucide-react';
import { MessagesService } from '@/services/messages/messages.service';
import type { Message, ConversationSession } from '@/types/messages/messages.type';
import { VideoCall } from './VideoCall';

interface Props {
  conversationId: string | null;
  messageMode: 'group' | 'individual';
  selectedConversations: Set<string>;
  joinConversation: (id: string) => void;
  // ⭐ clearMessages() cần được gọi thủ công để kiểm soát thời điểm
  sendMessage: (text: string, conversationIds?: string[]) => void;
  clearMessages: () => void;
  messages: Message[];
  socketConnected: boolean;
  convInfo?: ConversationSession | null;
  showIncomingCall?: boolean;
  onCloseIncomingCall?: () => void;
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
  convInfo,
  showIncomingCall = false,
  onCloseIncomingCall,
}) => {
  const [dbMessages, setDbMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sendingMedia, setSendingMedia] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAdminId(localStorage.getItem('userId'));
  }, []);

  // Mở modal khi có incoming call từ parent
  useEffect(() => {
    if (showIncomingCall) {
      setShowVideoCall(true);
    }
  }, [showIncomingCall]);

  // ⭐ THAY ĐỔI LỚN Ở ĐÂY:
  // 1. Bỏ clearMessages() ra khỏi useEffect.
  // 2. Dùng cleanup function để hủy fetch (tránh lỗi race condition)
  useEffect(() => {
    if (!conversationId || messageMode === 'group') return;

    // Đảm bảo kết nối socket cho conversation mới
    joinConversation(conversationId);
    setLoading(true);

    let isCancelled = false;

    // ⭐ Xóa tin nhắn realtime CŨng chỉ xảy ra sau khi fetch thành công
    // Nếu bạn muốn hiển thị tin nhắn ngay, bỏ clearMessages() ra khỏi đây.

    const fetchMessages = async (convId: string) => {
      try {
        const res = await MessagesService.getMessagesByConversation(convId);
        if (!isCancelled && convId === conversationId) {
          // ⭐ Khi tin nhắn DB mới về:
          setDbMessages(res.data.reverse()); // Cập nhật tin nhắn DB mới
          clearMessages(); // ⭐ Xóa tin nhắn realtime (messages) CŨ của hội thoại trước.
        }
      } catch (err) {
        console.error('Lỗi tải tin nhắn:', err);
        if (!isCancelled && convId === conversationId) {
          setDbMessages([]);
          clearMessages();
        }
      } finally {
        if (!isCancelled && convId === conversationId) {
          setLoading(false);
        }
      }
    };

    // Gọi fetch với ID hiện tại
    fetchMessages(conversationId);

    // Dùng cleanup function để handle Race Condition
    return () => {
      isCancelled = true;
      // Không clearMessages() ở đây, vì có thể xóa messages của conversation mới
      // nếu nó đến ngay sau khi click
    };
  }, [conversationId, messageMode]);

  // ⭐ combined BÂY GIỜ CHỨA:
  // - Khi chuyển đổi: dbMessages A + messages A (cho đến khi fetch B xong)
  // - Khi tải xong: dbMessages B + messages B (messages B lúc này đã được reset)
  const combined = [...dbMessages, ...messages];

  // 1️⃣ Khi load xong tin nhắn (vừa fetch từ DB xong) → cuộn ngay xuống cuối, không animation
  // Chỉ cuộn auto khi loading hoàn tất
  useEffect(() => {
    if (!conversationId) return;
    // Scroll ngay lập tức khi chuyển conversation, không chờ loading
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [conversationId]);

  // Scroll lại sau khi loading xong để đảm bảo xuống cuối
  useEffect(() => {
    if (!conversationId || loading) return;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [loading]);

  // 2️⃣ Khi có tin nhắn mới (messages thêm) → cuộn mượt xuống cuối
  useEffect(() => {
    // Chỉ cuộn smooth khi tin nhắn mới được thêm vào (combined.length tăng)
    if (!conversationId || loading) return;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [combined.length]);

  // ... (Các hàm handleSend, handleFileSelect không đổi)
  const handleSend = async () => {
    if (!input.trim() && (!file || messageMode === 'group')) return;
    const text = input.trim();
    setInput('');

    let imagePath = '';
    let videoPath = '';

    try {
      if (file) {
        setSendingMedia(true);

        const formData = new FormData();
        if (file.type.startsWith('image')) formData.append('image', file);
        else if (file.type.startsWith('video')) formData.append('video', file);

        const res = await MessagesService.uploadChatFile(formData);
        imagePath = res.data.imagePath || '';
        videoPath = res.data.videoPath || '';

        setFile(null);
        setPreview(null);
        setSendingMedia(false);
      }

      if (conversationId) {
        sendMessage(text || imagePath || videoPath);
      }
    } catch (err) {
      console.error('❌ Upload lỗi:', err);
      setSendingMedia(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };
  // ... (Kết thúc các hàm handleSend, handleFileSelect)

  if (messageMode === 'group') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-600 dark:text-gray-300">
        {selectedConversations.size > 0 ? (
          <>
            <p className="mb-3 text-sm">Đã chọn {selectedConversations.size} người nhận</p>
            <div className="flex p-3 border-t bg-white dark:bg-gray-900 w-2/3 rounded-xl shadow">
              <input
                className="flex-1 border border-gray-400 dark:border-gray-600 rounded-full px-3 py-2 text-sm dark:bg-gray-800"
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
      {/* Header with Video Call button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <img
            src={convInfo?.customerAvatarUrl || convInfo?.seerAvatarUrl || '/default_avatar.jpg'}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-400"
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {convInfo?.customerName || convInfo?.seerName || 'Người dùng'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {socketConnected ? 'Đang kết nối' : 'Ngoại tuyến'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCallType('audio');
              setShowVideoCall(true);
            }}
            title="Gọi thoại"
            className="p-2.5 rounded-full bg-blue-500 hover:bg-blue-600 
                       text-white hover:shadow-lg hover:scale-110 transition-all"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setCallType('video');
              setShowVideoCall(true);
            }}
            title="Gọi video"
            className="p-2.5 rounded-full bg-green-500 hover:bg-green-600 
                       text-white hover:shadow-lg hover:scale-110 transition-all"
          >
            <Video className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-3 dark:bg-gray-800 space-y-3"
        ref={scrollContainerRef}
      >
        {/* ⭐ LOGIC RENDER: Đảm bảo luôn hiển thị data nếu có, chỉ hiện loading khi không có data */}
        {loading && combined.length === 0 ? (
          // Trường hợp 1: Đang tải VÀ CHƯA CÓ DATA NÀO (Lần đầu tiên tải hoặc tải thất bại)
          <p className="text-center text-gray-500 mt-10">Đang tải tin nhắn...</p>
        ) : (
          <>
            {combined.length === 0 ? (
              // Trường hợp 2: Đã tải xong VÀ KHÔNG CÓ DATA
              <p className="text-center text-gray-500 mt-10">Chưa có tin nhắn nào</p>
            ) : (
              // Trường hợp 3: Có data (data cũ khi đang tải mới hoặc data mới tải xong)
              combined.map((msg) => {
                const isAdmin = msg.senderId === adminId;
                const isImage = msg.textContent?.match(/\.(jpg|jpeg|png|gif)$/i);
                const isVideo = msg.textContent?.match(/\.(mp4|mov|webm)$/i);
                return (
                  <div
                    key={msg.id || msg.createdAt}
                    className={`flex items-end gap-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isAdmin && (
                      <img
                        src={msg.customerAvatar || '/default_avatar.jpg'}
                        alt={msg.customerName}
                        className="w-8 h-8 rounded-full object-cover border border-gray-400"
                      />
                    )}

                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                        isAdmin
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none'
                          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none shadow'
                      }`}
                    >
                      {isImage ? (
                        <img
                          src={msg.textContent}
                          alt="media"
                          className="max-w-[250px] max-h-[180px] rounded-lg cursor-pointer border border-gray-400 dark:border-gray-600"
                          onLoad={() => {
                            // Scroll xuống khi ảnh load xong
                            if (scrollContainerRef.current) {
                              scrollContainerRef.current.scrollTop =
                                scrollContainerRef.current.scrollHeight;
                            }
                          }}
                          onClick={() => {
                            setPreview(msg.textContent);
                            setFile(null);
                          }}
                        />
                      ) : isVideo ? (
                        <video
                          controls
                          className="max-w-[250px] max-h-[180px] rounded-lg border border-gray-400 dark:border-gray-600"
                          src={msg.textContent}
                          onLoadedMetadata={() => {
                            // Scroll xuống khi video metadata load xong
                            if (scrollContainerRef.current) {
                              scrollContainerRef.current.scrollTop =
                                scrollContainerRef.current.scrollHeight;
                            }
                          }}
                        />
                      ) : (
                        <p className="text-sm">{msg.textContent}</p>
                      )}

                      <div className="text-[10px] mt-1 opacity-80 text-right space-x-1">
                        <span>
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <img
                        src={msg.seerAvatar || '/default_avatar.jpg'}
                        alt={msg.seerName}
                        className="w-8 h-8 rounded-full object-cover border border-gray-400"
                      />
                    )}
                  </div>
                );
              })
            )}

            {sendingMedia && (
              <div className="flex justify-end pr-3">
                <div className="animate-spin h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full mt-1"></div>
              </div>
            )}
            {/* Indicator Loading nhỏ khi đang tải nhưng đã có tin nhắn hiển thị */}
            {loading && combined.length > 0 && (
              <p className="text-center text-gray-500 text-sm italic">Đang tải tin nhắn...</p>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Preview ảnh/video trước khi gửi */}
      {preview && file && !sendingMedia && (
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

      {/* Thanh nhập */}
      <div className="flex p-3 border-t border-gray-400 bg-white dark:bg-gray-900 items-center">
        <input
          className="flex-1 border border-gray-400 dark:border-gray-600 rounded-full px-4 py-2 text-sm dark:bg-gray-800"
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
          className="ml-2 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-400"
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

      {/* Modal xem ảnh full (khi click vào ảnh trong chat) */}
      {preview && !file && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            alt="preview"
            className="max-w-[90vw] max-h-[85vh] rounded-lg border border-gray-500 shadow-lg"
          />
          <button
            className="absolute top-4 right-4 text-white hover:text-red-400"
            onClick={() => setPreview(null)}
          >
            <X size={28} />
          </button>
        </div>
      )}

      {/* Video Call Modal */}
      {showVideoCall && conversationId && adminId && convInfo && (
        <VideoCall
          conversationId={conversationId}
          currentUserId={adminId}
          currentUserName="Admin"
          currentUserAvatar="https://res.cloudinary.com/dzpv3mfjt/image/upload/v1755570460/dummy_avatar_3_ycoboh.jpg"
          targetUserId={convInfo.customerId?.toString() || convInfo.seerId?.toString() || ''}
          targetUserName={convInfo.customerName || convInfo.seerName || 'User'}
          targetUserAvatar={convInfo.customerAvatarUrl || convInfo.seerAvatarUrl || undefined}
          callType={callType}
          onClose={() => {
            setShowVideoCall(false);
            onCloseIncomingCall?.();
          }}
        />
      )}
    </div>
  );
};
