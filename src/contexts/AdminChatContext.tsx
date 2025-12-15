'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
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

interface AdminChatContextType {
  socketConnected: boolean;
  subscribeToMessages: (callback: (msg: ChatMessage) => void) => () => void;
  joinConversation: (conversationId: string) => void;
  sendMessage: (
    text: string,
    conversationIds?: string[],
    imagePath?: string,
    videoPath?: string,
  ) => void;
  getMessages: (conversationId: string) => Message[];
  clearMessages: () => void;
}

const AdminChatContext = createContext<AdminChatContextType | null>(null);

export const AdminChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const socketRef = useRef<ReturnType<typeof createChatSocket> | null>(null);
  const messageCallbacksRef = useRef<Set<(msg: ChatMessage) => void>>(new Set());
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Lấy adminId
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      console.log('🔑 [AdminChatContext] Admin ID from storage:', storedId);
      if (storedId) setAdminId(storedId);
    }
  }, []);

  // Kết nối socket 1 LẦN duy nhất
  useEffect(() => {
    if (!adminId || socketRef.current) {
      return;
    }

    console.log('🔌 [AdminChatContext] Creating SINGLE socket connection for admin:', adminId);
    const socket = createChatSocket(adminId);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ [AdminChatContext] Socket connected!');
      setSocketConnected(true);
      socket.emit('admin_join_all_conversations', adminId, (res: any) => {
        console.log(`✅ [AdminChatContext] Joined ${res.totalJoined} conversations`);
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ [AdminChatContext] Socket disconnected');
      setSocketConnected(false);
    });

    socket.on('connect_error', (error: any) => {
      console.error('❌ [AdminChatContext] Socket connection error:', error);
    });

    socket.on('receive_message', (raw: Partial<Message> & { conversationId?: string }) => {
      console.log('🔔 [AdminChatContext] receive_message event:', raw);

      const msg: ChatMessage = {
        id: raw.id ?? `sock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        conversationId: raw.conversationId as string,
        senderId: raw.senderId as string,
        textContent: raw.textContent as string,
        createdAt: raw.createdAt ?? new Date().toISOString(),
        ...(raw as any),
      };

      // Update messagesMap
      setMessagesMap((prev) => {
        const convId = msg.conversationId;
        const oldMsgs = prev[convId] || [];

        // Check duplicate
        const isDup = oldMsgs.some(
          (m) =>
            m.id === msg.id ||
            (m.textContent === msg.textContent &&
              Math.abs(new Date(msg.createdAt).getTime() - new Date(m.createdAt).getTime()) < 3000),
        );
        if (isDup) {
          console.log('⚠️ [AdminChatContext] Duplicate message detected, skipping');
          return prev;
        }

        return { ...prev, [convId]: [...oldMsgs, msg] };
      });

      console.log(
        '📨 [AdminChatContext] Broadcasting to',
        messageCallbacksRef.current.size,
        'subscribers',
      );

      // Broadcast tới TẤT CẢ subscribers
      messageCallbacksRef.current.forEach((callback) => {
        try {
          callback(msg);
        } catch (error) {
          console.error('❌ [AdminChatContext] Error in message callback:', error);
        }
      });
    });

    return () => {
      console.log('🔌 [AdminChatContext] Cleaning up socket connection');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [adminId]);

  const subscribeToMessages = useCallback((callback: (msg: ChatMessage) => void) => {
    console.log(
      '📝 [AdminChatContext] Adding message subscriber, total:',
      messageCallbacksRef.current.size + 1,
    );
    messageCallbacksRef.current.add(callback);

    return () => {
      console.log(
        '📝 [AdminChatContext] Removing message subscriber, remaining:',
        messageCallbacksRef.current.size - 1,
      );
      messageCallbacksRef.current.delete(callback);
    };
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    if (!socketRef.current) {
      console.warn('⚠️ [AdminChatContext] Socket not connected, cannot join conversation');
      return;
    }
    console.log('🚪 [AdminChatContext] Joining conversation:', conversationId);
    setCurrentConversationId(conversationId);
    socketRef.current.emit('join_conversation', conversationId);

    setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit('mark_read', conversationId, (response: string) => {
          console.log('✅ [AdminChatContext] Mark read response:', response);
        });
      }
    }, 500);
  }, []);

  const sendMessage = useCallback(
    (text: string, conversationIds?: string[], imagePath?: string, videoPath?: string) => {
      if (!socketRef.current) {
        console.error('❌ [AdminChatContext] No socket connection!');
        return;
      }

      if (conversationIds && conversationIds.length > 0) {
        socketRef.current.emit(
          'send_messages',
          { conversationIds, textContent: text, imagePath, videoPath },
          (res: boolean) => console.log('📩 [AdminChatContext] send_messages ack:', res),
        );
        return;
      }

      if (!currentConversationId) {
        console.error('❌ [AdminChatContext] No current conversation ID!');
        return;
      }

      socketRef.current.emit(
        'send_message',
        { conversationId: currentConversationId, textContent: text, imagePath, videoPath },
        (res: string | { status: string }) =>
          console.log('📩 [AdminChatContext] send_message ack:', res),
      );
    },
    [currentConversationId],
  );

  const clearMessages = useCallback(() => setMessagesMap({}), []);

  const getMessages = useCallback(
    (conversationId: string): Message[] =>
      (messagesMap[conversationId] as unknown as Message[]) || [],
    [messagesMap],
  );

  return (
    <AdminChatContext.Provider
      value={{
        socketConnected,
        subscribeToMessages,
        joinConversation,
        sendMessage,
        getMessages,
        clearMessages,
      }}
    >
      {children}
    </AdminChatContext.Provider>
  );
};

export const useAdminChatContext = () => {
  const context = useContext(AdminChatContext);
  if (!context) {
    throw new Error('useAdminChatContext must be used within AdminChatProvider');
  }
  return context;
};
