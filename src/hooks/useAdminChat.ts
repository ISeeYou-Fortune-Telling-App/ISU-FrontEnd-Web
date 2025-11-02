'use client';
import { useEffect, useRef, useState } from 'react';
import { createChatSocket } from '@/services/socket/chat.socket';

interface ChatMessage {
  conversationId: string;
  senderId: string;
  textContent: string;
  createdAt: string;
}

export const useAdminChat = () => {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const socketRef = useRef<any>(null);

  // ✅ Lấy adminId từ localStorage sau khi component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('userId');
      if (storedId) setAdminId(storedId);
    }
  }, []);

  // ✅ Khởi tạo socket chỉ khi có adminId
  useEffect(() => {
    if (!adminId) return;

    const socket = createChatSocket(adminId);
    socketRef.current = socket;

    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));

    socket.on('receive_message', (msg: ChatMessage) => {
      if (msg.conversationId === currentConversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [adminId, currentConversationId]);

  // ✅ Join conversation
  const joinConversation = (conversationId: string) => {
    if (!socketRef.current) return;
    setCurrentConversationId(conversationId);
    socketRef.current.emit('join_conversation', conversationId);
  };

  // ✅ Send message
  const sendMessage = (text: string) => {
    if (!socketRef.current || !currentConversationId) return;
    socketRef.current.emit('send_message', {
      conversationId: currentConversationId,
      textContent: text,
    });
  };

  return { socketConnected, messages, joinConversation, sendMessage };
};
