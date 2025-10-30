'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Image as ImageIcon } from 'lucide-react';
import { AIService } from '@/services/ai/ai.service';

export const AIChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🧩 Format text chunk cho dễ đọc
  const formatChunk = (text: string) => {
    let t = text;

    // Tách các từ dính liền không có khoảng trắng
    t = t.replace(/([a-z])([A-Z])/g, '$1 $2'); // thêm khoảng trắng giữa chữ thường + hoa
    t = t.replace(/([.,!?])([A-Za-z])/g, '$1 $2'); // thêm khoảng trắng sau dấu câu
    t = t.replace(/([a-z])([A-Z])/g, '$1 $2');

    // Viết hoa chữ đầu câu
    t = t.replace(/(^\s*[a-z])|(\.\s*[a-z])/g, (m) => m.toUpperCase());

    // Thêm khoảng trắng cuối nếu thiếu
    if (!t.endsWith(' ') && !t.endsWith('\n')) t += ' ';

    return t;
  };

  // 🧠 Gửi tin nhắn text với typing effect
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const question = input.trim();

    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setInput('');
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'ai', text: '' }]);

    let buffer = '';
    let typingTimer: NodeJS.Timeout | null = null;
    const typingDelay = 60; // gõ chậm hơn

    try {
      await AIService.chatQueryStream(
        { question },
        (chunk) => {
          buffer += formatChunk(chunk);

          if (!typingTimer) {
            typingTimer = setInterval(() => {
              if (buffer.length === 0) return;
              const piece = buffer.slice(0, 2); // gõ 2 ký tự mỗi lần
              buffer = buffer.slice(2);

              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === 'ai') {
                  return [...prev.slice(0, -1), { role: 'ai', text: last.text + piece }];
                }
                return prev;
              });

              if (buffer.length === 0 && typingTimer) {
                clearInterval(typingTimer);
                typingTimer = null;
              }
            }, typingDelay);
          }
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
        },
      );
    } catch (error) {
      console.error('❌ Chat error:', error);
      setMessages((prev) => [...prev, { role: 'ai', text: '❌ Không thể nhận phản hồi từ AI.' }]);
      setIsLoading(false);
    }
  };

  // 📸 Phân tích ảnh (khuôn mặt hoặc lòng bàn tay)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPalm =
      file.name.toLowerCase().includes('palm') || confirm('Ảnh này là lòng bàn tay chứ?');

    setMessages((prev) => [...prev, { role: 'user', text: `📸 Đã tải lên: ${file.name}` }]);
    setIsLoading(true);

    try {
      const res = isPalm ? await AIService.analyzePalm(file) : await AIService.analyzeFace(file);

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `🔍 **Phân tích ${isPalm ? 'lòng bàn tay' : 'khuôn mặt'}:**\n${
            res.analysisResult
          }\n\n🕒 Thời gian xử lý: ${res.processingTime}s`,
        },
      ]);
    } catch (error) {
      console.error('❌ Image analysis error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: '⚠️ Không thể phân tích ảnh, vui lòng thử lại.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Nút bật/tắt chatbot */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Cửa sổ chat */}
      {open && (
        <div
          className={`fixed bottom-20 right-3 w-[500px] h-[440px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up z-40`}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white text-center py-2 font-semibold flex justify-between items-center px-4">
            <span>ISU Chatbot</span>
            <label htmlFor="upload-image" className="cursor-pointer flex items-center gap-1">
              <ImageIcon className="w-4 h-4" />
              <span className="text-xs">Gửi ảnh</span>
              <input
                id="upload-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Khu vực tin nhắn */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400 text-center px-4">
                Hãy gửi tin nhắn đầu tiên hoặc tải ảnh để bắt đầu trò chuyện nhé!
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

          {/* Ô nhập tin nhắn */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập câu hỏi..."
              disabled={isLoading}
              className={`flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-70`}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className={`ml-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Animation */}
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
