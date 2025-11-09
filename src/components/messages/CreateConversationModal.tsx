'use client';

import React, { useEffect, useState } from 'react';
import { X, Loader2, Send } from 'lucide-react';
import { getSimpleUserList, MessagesService } from '@/services/messages/messages.service';
import type { SimpleUserInfo, ConversationData } from '@/types/messages/messages.type';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (conversation: ConversationData) => void;
}

export const CreateConversationModal: React.FC<Props> = ({ open, onClose, onCreated }) => {
  const [users, setUsers] = useState<SimpleUserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SimpleUserInfo | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // ✅ reset state mỗi khi modal đóng
  useEffect(() => {
    if (!open) {
      setSelectedUser(null);
      setMessage('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getSimpleUserList();
        setUsers(data);
      } catch (err) {
        console.error('Lỗi tải danh sách user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [open]);

  const handleSend = async () => {
    if (!selectedUser || !message.trim()) return;
    setSending(true);
    try {
      const res = await MessagesService.create({
        targetUserId: selectedUser.id,
        initialMessage: message.trim(),
      });

      // ✅ reset sau khi gửi
      setSelectedUser(null);
      setMessage('');

      onCreated(res);
      onClose();
    } catch (err) {
      console.error('❌ Lỗi tạo hội thoại:', err);
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-[460px] max-h-[620px] p-4 shadow-lg flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {selectedUser ? 'Nhập tin nhắn đầu tiên' : 'Chọn người để tạo hội thoại'}
          </h2>
          <button
            onClick={() => {
              setSelectedUser(null);
              setMessage('');
              onClose();
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {!selectedUser ? (
          <div className="flex-1 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex justify-center items-center h-40 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Đang tải danh sách...
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">Không có người dùng nào.</p>
            ) : (
              users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                  onClick={() => setSelectedUser(u)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={u.avatarUrl || '/default_avatar.jpg'}
                      alt={u.fullName}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {u.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-indigo-500 font-semibold">{u.role}</span>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <div className="flex items-center space-x-3 mb-3 border-b pb-2">
              <img
                src={selectedUser.avatarUrl || '/default_avatar.jpg'}
                alt={selectedUser.fullName}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedUser.fullName}
                </p>
                <p className="text-xs text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn đầu tiên..."
              className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm dark:bg-gray-700 dark:text-white"
            />

            <div className="flex justify-end mt-3 space-x-2">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setMessage('');
                }}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Quay lại
              </button>
              <button
                onClick={handleSend}
                disabled={sending || !message.trim()}
                className="px-4 py-2 text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:opacity-90 flex items-center"
              >
                {sending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                <Send className="w-4 h-4 mr-1" /> Gửi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
