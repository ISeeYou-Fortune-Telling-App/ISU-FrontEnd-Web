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
};

interface UseAdminChatProps {
  onNewMessage?: (msg: ChatMessage) => void;
}

export const useAdminChat = ({ onNewMessage }: UseAdminChatProps = {}) => {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const socketRef = useRef<ReturnType<typeof createChatSocket> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('userId');
      if (storedId) setAdminId(storedId);
    }
  }, []);

  useEffect(() => {
    if (!adminId) return;
    const socket = createChatSocket(adminId);
    socketRef.current = socket;

    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));

    socket.on('receive_message', (raw: Partial<Message> & { conversationId?: string }) => {
      const msg: ChatMessage = {
        id: (raw.id as string) ?? `sock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        conversationId: raw.conversationId as string,
        senderId: raw.senderId as string,
        textContent: raw.textContent as string,
        createdAt: (raw.createdAt as string) ?? new Date().toISOString(),
        ...(raw as any),
      };
      setMessages((prev) => {
        const isDup = prev.some(
          (m) =>
            m.textContent === msg.textContent &&
            m.conversationId === msg.conversationId &&
            Math.abs(new Date(msg.createdAt).getTime() - new Date(m.createdAt).getTime()) < 3000,
        );
        if (isDup) return prev;
        return [...prev, msg];
      });
      onNewMessage?.(msg);
    });

    return () => socket.disconnect();
  }, [adminId]);

  const joinConversation = (conversationId: string) => {
    if (!socketRef.current) return;
    setCurrentConversationId(conversationId);
    socketRef.current.emit('join_conversation', conversationId);
  };

  const sendMessage = (
    text: string,
    conversationIds?: string[],
    imagePath?: string,
    videoPath?: string,
  ) => {
    if (!socketRef.current) return;

    // Multi send
    if (conversationIds && conversationIds.length > 0) {
      socketRef.current.emit(
        'send_messages',
        { conversationIds, textContent: text, imagePath, videoPath },
        (res: boolean) => console.log('📩 send_messages ack:', res),
      );
      return;
    }

    // Single conversation
    if (!currentConversationId) return;
    const tempId = `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const optimistic: ChatMessage = {
      id: tempId,
      conversationId: currentConversationId,
      senderId: adminId || 'me',
      textContent: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    onNewMessage?.(optimistic);

    socketRef.current.emit(
      'send_message',
      {
        conversationId: currentConversationId,
        textContent: text,
        imagePath,
        videoPath,
      },
      (res: string | { status: string }) => console.log('📩 send_message ack:', res),
    );
  };

  const clearMessages = () => setMessages([]);

  return {
    socketConnected,
    messages: messages as Message[],
    joinConversation,
    sendMessage,
    clearMessages,
  };
};
