'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { AIService } from '@/services/ai/ai.service';

export const AIChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🧠 Gửi tin nhắn bằng streaming
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const question = input.trim();

    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setInput('');
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'ai', text: '' }]);

    try {
      await AIService.chat(
        { question },
        (chunk) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === 'ai') {
              return [...prev.slice(0, -1), { role: 'ai', text: last.text + chunk }];
            }
            return prev;
          });
        },
        () => {
          setIsLoading(false);
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        },
        (err) => {
          console.error('❌ Stream error:', err);
          setMessages((prev) => [
            ...prev,
            { role: 'ai', text: '⚠️ Đã xảy ra lỗi khi kết nối với AI.' },
          ]);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('❌ Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: '❌ Không thể nhận phản hồi từ AI.' },
      ]);
      setIsLoading(false);
    }
  };

  // 🚀 Auto-scroll khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✨ Hiệu ứng bong bóng mở/đóng
  const bubbleClass = open
    ? 'bottom-5 right-5 scale-90 opacity-0 pointer-events-none'
    : 'bottom-24 right-3 scale-100 opacity-100';

  return (
    <>
      {/* Nút bong bóng chat */}
      <button onClick={() => setOpen(!open)} className="fixed bottom-5 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition" > {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />} </button>

      {/* Khung chat */}
      {open && (
        <div
          className={`fixed bottom-20 right-3 w-80 h-[420px] bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl 
            flex flex-col overflow-hidden animate-fade-in-up z-40`}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white text-center py-2 font-semibold">
            ISU chatbot
          </div>

          {/* Tin nhắn */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400 text-center px-4">
                Hãy gửi tin nhắn đầu tiên để bắt đầu trò chuyện nhé!
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[75%] whitespace-pre-wrap break-words leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    }`}
                  >
                    {msg.text || (isLoading && msg.role === 'ai' ? '▍' : '')}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Ô nhập */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập câu hỏi..."
              disabled={isLoading}
              className={`flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none 
                focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-70`}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className={`ml-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full 
                disabled:opacity-50 disabled:cursor-not-allowed transition`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hiệu ứng mở khung chat */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
