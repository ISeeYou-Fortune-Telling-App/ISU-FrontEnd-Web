'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Conversation } from '@/types/chatHistory/chatHistory.type';

export const ChatHistoryModal: React.FC<{
  conversation: Conversation;
  onClose: () => void;
}> = ({ conversation, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Chi tiết hội thoại
        </h2>

        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p>
            <b>Loại:</b> {conversation.conversationType}
          </p>
          <p>
            <b>Người dùng:</b> {conversation.customerName || 'Ẩn danh'}
          </p>
          <p>
            <b>Nhà tiên tri:</b> {conversation.seerName || 'Không rõ'}
          </p>
          <p>
            <b>Trạng thái:</b> {conversation.status}
          </p>
          <p>
            <b>Tin nhắn gần nhất:</b> {conversation.lastMessageContent || '(Chưa có tin nhắn)'}
          </p>
          <p>
            <b>Thời gian bắt đầu:</b>{' '}
            {conversation.sessionStartTime
              ? new Date(conversation.sessionStartTime).toLocaleString()
              : '-'}
          </p>
        </div>
      </div>
    </div>
  );
};
