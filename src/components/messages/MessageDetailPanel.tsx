'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send, Image as ImageIcon, X, Video, Phone, MoreVertical } from 'lucide-react';
import { MessagesService } from '@/services/messages/messages.service';
import type { Message, ConversationSession } from '@/types/messages/messages.type';
import { VideoCall } from './VideoCall';
import Swal from 'sweetalert2';

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
  const [adminAvatar, setAdminAvatar] = useState<string>('/default_avatar.jpg');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Thử lấy từ localStorage trước, sau đó sessionStorage
    const id = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    setAdminId(id);
    console.log('🔑 Admin ID from storage:', id);
    console.log('🔑 localStorage userId:', localStorage.getItem('userId'));
    console.log('🔑 sessionStorage userId:', sessionStorage.getItem('userId'));

    // Lấy avatar admin từ AccountService
    const fetchAdminAvatar = async () => {
      try {
        const { AccountService } = await import('@/services/account/account.service');
        const response = await AccountService.getCurrentUser();
        if (response.data?.avatarUrl) {
          setAdminAvatar(response.data.avatarUrl);
          console.log('👤 Admin avatar loaded:', response.data.avatarUrl);
        }
      } catch (error) {
        console.error('❌ Failed to fetch admin avatar:', error);
      }
    };

    fetchAdminAvatar();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteMessage = async (messageId: string) => {
    const result = await Swal.fire({
      title: 'Xóa tin nhắn?',
      text: 'Bạn có chắc chắn muốn xóa tin nhắn này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        await MessagesService.deleteMessage(messageId);
        setDbMessages((prev) => prev.filter((m) => m.id !== messageId));
        setOpenMenuId(null);
        Swal.fire('Đã xóa!', 'Tin nhắn đã được xóa.', 'success');
      } catch (error) {
        console.error('Error deleting message:', error);
        Swal.fire('Lỗi!', 'Không thể xóa tin nhắn.', 'error');
      }
    }
  };

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

    console.log('📤 Sending message:', {
      text,
      conversationId,
      socketConnected,
      adminId,
    });

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

      if (messageMode === 'group' && selectedConversations.size > 0) {
        // Gửi tin nhắn cho nhiều người
        const conversationIds = Array.from(selectedConversations);
        console.log('📤 Sending to group:', conversationIds);
        sendMessage(text || imagePath || videoPath, conversationIds);
      } else if (conversationId) {
        // Gửi tin nhắn cho 1 người
        console.log('📤 Sending to conversation:', conversationId);
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
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
              {socketConnected ? (
                <span className="text-green-600 dark:text-green-400">● Đang kết nối</span>
              ) : (
                <span className="text-red-600 dark:text-red-400">● Ngoại tuyến</span>
              )}
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
                // So sánh cả string và number để đảm bảo
                const isAdmin =
                  msg.senderId === adminId || msg.senderId?.toString() === adminId?.toString();

                // Debug log
                console.log('📨 Message:', {
                  id: msg.id,
                  senderId: msg.senderId,
                  adminId: adminId,
                  isAdmin: isAdmin,
                  content: msg.textContent?.substring(0, 20),
                });

                const isImage = msg.textContent?.match(/\.(jpg|jpeg|png|gif)$/i);
                const isVideo = msg.textContent?.match(/\.(mp4|mov|webm)$/i);
                return (
                  <div
                    key={msg.id || msg.createdAt}
                    className={`flex items-end gap-2 group relative ${
                      isAdmin ? 'justify-end' : 'justify-start'
                    }`}
                    onMouseLeave={() => {
                      // Đóng menu khi hover ra khỏi tin nhắn
                      if (openMenuId === msg.id) {
                        setOpenMenuId(null);
                      }
                    }}
                  >
                    {!isAdmin && (
                      <img
                        src={msg.customerAvatar || msg.seerAvatar || adminAvatar}
                        alt={msg.customerName || msg.seerName}
                        className="w-8 h-8 rounded-full object-cover border border-gray-400"
                      />
                    )}

                    <div className="relative flex items-center gap-2">
                      {/* Menu 3 chấm và Timestamp cho admin - bên trái */}
                      {isAdmin && (
                        <div
                          className={`flex items-center gap-1 transition-opacity ${
                            openMenuId === msg.id
                              ? 'opacity-100'
                              : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === msg.id ? null : msg.id);
                              }}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                              title="Tùy chọn"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {openMenuId === msg.id && (
                              <div
                                ref={menuRef}
                                className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMessage(msg.id);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                  Xóa tin nhắn
                                </button>
                              </div>
                            )}
                          </div>
                          <span
                            className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap"
                            title={
                              msg.createdAt ? new Date(msg.createdAt).toLocaleString('vi-VN') : ''
                            }
                          >
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </span>
                        </div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`px-3 py-2 rounded-2xl ${
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
                              if (scrollContainerRef.current) {
                                scrollContainerRef.current.scrollTop =
                                  scrollContainerRef.current.scrollHeight;
                              }
                            }}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="text-sm">{msg.textContent}</p>
                            {isAdmin && (
                              <span className="text-[10px] opacity-80">
                                {msg.status === 'READ' ? '✓✓' : '✓'}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Timestamp cho user - bên phải */}
                      {!isAdmin && (
                        <span
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap"
                          title={
                            msg.createdAt ? new Date(msg.createdAt).toLocaleString('vi-VN') : ''
                          }
                        >
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <img
                        src={adminAvatar}
                        alt="Admin"
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
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
