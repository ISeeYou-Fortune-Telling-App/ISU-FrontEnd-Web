'use client';
import { useEffect, useRef, useState } from 'react';
import { createChatSocket } from '@/services/socket/chat.socket';
import type { Message } from '@/types/messages/messages.type';

type ChatMessage = Partial<Message> & {
  id: string;
  conversationId: string;
  senderId: string;
  textContent: string;
  createdAt: string;
  senderRole?: 'ADMIN' | 'CUSTOMER' | 'SEER';
};

interface UseAdminChatProps {
  onNewMessage?: (msg: ChatMessage) => void;
}

export const useAdminChat = ({ onNewMessage }: UseAdminChatProps = {}) => {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const socketRef = useRef<ReturnType<typeof createChatSocket> | null>(null);

  // Lấy adminId
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('userId');
      if (storedId) setAdminId(storedId);
    }
  }, []);

  // Kết nối socket
  useEffect(() => {
    if (!adminId) return;
    const socket = createChatSocket(adminId);
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('admin_join_all_conversations', adminId, (res: any) => {
        console.log(`✅ Joined ${res.totalJoined} conversations`);
      });
    });

    socket.on('disconnect', () => setSocketConnected(false));

    socket.on('receive_message', (raw: Partial<Message> & { conversationId?: string }) => {
      console.log('🔔 [useAdminChat] receive_message event:', raw);

      const msg: ChatMessage = {
        id: raw.id ?? `sock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        conversationId: raw.conversationId as string,
        senderId: raw.senderId as string,
        textContent: raw.textContent as string,
        createdAt: raw.createdAt ?? new Date().toISOString(),
        ...(raw as any),
      };

      console.log('📨 [useAdminChat] Processed message:', msg);

      setMessagesMap((prev) => {
        const convId = msg.conversationId;
        const oldMsgs = prev[convId] || [];
        const isDup = oldMsgs.some(
          (m) =>
            m.textContent === msg.textContent &&
            Math.abs(new Date(msg.createdAt).getTime() - new Date(m.createdAt).getTime()) < 3000,
        );
        if (isDup) {
          console.log('⚠️ [useAdminChat] Duplicate message detected, skipping');
          return prev;
        }

        // ✅ Nếu tin nhắn từ customer/seer (không phải admin), đánh dấu tất cả tin nhắn admin trước đó là READ
        const isFromOther = msg.senderId !== adminId;
        const updatedMsgs = isFromOther
          ? oldMsgs.map((m) => (m.senderId === adminId ? { ...m, status: 'READ' } : m))
          : oldMsgs;

        return { ...prev, [convId]: [...updatedMsgs, msg] };
      });

      console.log('✅ [useAdminChat] Calling onNewMessage callback');
      onNewMessage?.(msg);
    });

    // Listen for message read status updates
    socket.on('message_read', (data: { conversationId: string; messageIds: string[] }) => {
      console.log('👁️ [useAdminChat] message_read event:', data);
      setMessagesMap((prev) => {
        const convId = data.conversationId;
        const msgs = prev[convId] || [];
        const updated = msgs.map((m) =>
          data.messageIds.includes(m.id) ? { ...m, status: 'READ' } : m,
        );
        return { ...prev, [convId]: updated };
      });
    });

    return () => socket.disconnect();
  }, [adminId]);

  // Join 1 conversation
  const joinConversation = (conversationId: string) => {
    if (!socketRef.current) return;
    setCurrentConversationId(conversationId);
    socketRef.current.emit('join_conversation', conversationId);

    // Mark messages as read when joining conversation
    setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit('mark_read', conversationId, (response: string) => {
          console.log('✅ Mark read response:', response);
        });
      }
    }, 500); // Delay để đảm bảo đã join room
  };

  // Gửi tin nhắn
  const sendMessage = async (
    text: string,
    conversationIds?: string[],
    imagePath?: string,
    videoPath?: string,
  ) => {
    if (!socketRef.current) return;

    if (conversationIds && conversationIds.length > 0) {
      socketRef.current.emit(
        'send_messages',
        { conversationIds, textContent: text, imagePath, videoPath },
        (res: boolean) => console.log('📩 send_messages ack:', res),
      );
      return;
    }

    if (!currentConversationId) return;

    // Optimistic update
    const tempId = `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const optimistic: ChatMessage = {
      id: tempId,
      conversationId: currentConversationId,
      senderId: adminId || 'me',
      textContent: text,
      createdAt: new Date().toISOString(),
      senderRole: 'ADMIN',
    };

    setMessagesMap((prev) => ({
      ...prev,
      [currentConversationId]: [...(prev[currentConversationId] || []), optimistic],
    }));
    onNewMessage?.(optimistic);

    try {
      // Gọi API để lưu vào database
      const { MessagesService } = await import('@/services/messages/messages.service');
      await MessagesService.sendMessage({
        conversationId: currentConversationId,
        textContent: text,
        imagePath,
        videoPath,
      });
      console.log('✅ Message saved to database');
    } catch (error) {
      console.error('❌ Failed to save message to database:', error);
    }

    // Emit socket để real-time
    socketRef.current.emit(
      'send_message',
      { conversationId: currentConversationId, textContent: text, imagePath, videoPath },
      (res: string | { status: string }) => console.log('📩 send_message ack:', res),
    );
  };

  const clearMessages = () => setMessagesMap({});

  // ✅ Fix lỗi type Message
  const getMessages = (conversationId: string): Message[] =>
    (messagesMap[conversationId] as unknown as Message[]) || [];

  return {
    socketConnected,
    getMessages,
    joinConversation,
    sendMessage,
    clearMessages,
  };
};
