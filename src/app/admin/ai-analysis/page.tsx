'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { sendVannaMessageV2, ChatEvent } from '@/services/ai/ai.service';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'ai';
  type: 'text' | 'dataframe' | 'chart' | 'html' | 'image' | 'status' | 'error';
  text?: string;
  data?: any;
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dọn session khi reload
  useEffect(() => {
    const clearStorage = () => {
      localStorage.removeItem('conversation_id');
      localStorage.removeItem('request_id');
    };
    window.addEventListener('beforeunload', clearStorage);
    return () => window.removeEventListener('beforeunload', clearStorage);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setMessages((prev) => [...prev, { role: 'user', type: 'text', text: question }]);
    setInput('');
    setIsLoading(true);
    setIsThinking(true);

    try {
      await sendVannaMessageV2(
        question,
        (event: ChatEvent) => {
          switch (event.type) {
            case 'text':
              setMessages((prev) => {
                const content = event.content ?? '';
                const last = prev[prev.length - 1];
                if (last && last.role === 'ai' && last.type === 'text') {
                  return [...prev.slice(0, -1), { ...last, text: (last.text || '') + content }];
                }
                return [...prev, { role: 'ai', type: 'text', text: content }];
              });
              break;

            case 'dataframe':
              setMessages((prev) => [...prev, { role: 'ai', type: 'dataframe', data: event.data }]);
              break;

            case 'chart':
              setMessages((prev) => [...prev, { role: 'ai', type: 'chart', data: event.data }]);
              break;

            case 'html':
              setMessages((prev) => [
                ...prev,
                { role: 'ai', type: 'html', data: event.data?.content },
              ]);
              break;

            case 'image':
              setMessages((prev) => [...prev, { role: 'ai', type: 'image', data: event.data }]);
              break;

            case 'status':
              setIsThinking(true);
              break;

            case 'error':
              setMessages((prev) => [
                ...prev,
                { role: 'ai', type: 'error', text: event.content || 'Đã xảy ra lỗi từ server.' },
              ]);
              break;

            default:
              console.warn('Unknown event type:', event);
          }
        },
        () => {
          setIsThinking(false);
          setIsLoading(false);
        },
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', type: 'text', text: '⚠️ Lỗi kết nối tới máy chủ AI.' },
      ]);
      setIsThinking(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="py-4 border-b dark:border-gray-800 bg-white dark:bg-gray-900">
        <h1 className="text-center text-xl font-semibold text-blue-600 dark:text-blue-400">
          ISU Chatbot
        </h1>
      </header>

      {/* Nội dung chat */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="max-w-4xl mx-auto p-4 pb-28">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
              Gửi tin nhắn để bắt đầu cuộc trò chuyện nhé!
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                {/* --- TEXT --- */}
                {m.type === 'text' && (
                  <div
                    className={`px-4 py-3 rounded-lg inline-block max-w-[80%] leading-relaxed shadow ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <ReactMarkdown>{m.text || ''}</ReactMarkdown>
                  </div>
                )}

                {/* --- DATAFRAME --- */}
                {m.type === 'dataframe' && (
                  <div className="overflow-x-auto border rounded-lg bg-white dark:bg-gray-800 mt-2 shadow">
                    <div className="border-b px-4 py-2 text-left font-semibold text-sm bg-gray-100 dark:bg-gray-700">
                      {m.data?.title || 'Query Results'}
                    </div>
                    <table className="min-w-full text-sm border-collapse">
                      <thead>
                        <tr>
                          {m.data?.columns?.map((col: string) => (
                            <th
                              key={col}
                              className="border px-3 py-2 font-semibold text-left bg-gray-50 dark:bg-gray-700"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {m.data?.data?.map((row: any, idx: number) => (
                          <tr key={idx} className="border-t">
                            {m.data.columns.map((col: string) => (
                              <td key={col} className="border px-3 py-1">
                                {row[col]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="text-xs text-gray-500 dark:text-gray-400 px-4 py-2">
                      {m.data?.description || ''}
                    </div>
                  </div>
                )}

                {/* --- HTML --- */}
                {m.type === 'html' && (
                  <div
                    className="p-4 mt-2 rounded-lg bg-white dark:bg-gray-800 text-sm prose dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: m.data }}
                  />
                )}

                {/* --- IMAGE --- */}
                {m.type === 'image' && m.data?.url && (
                  <div className="mt-3">
                    <img
                      src={m.data.url}
                      alt="AI generated"
                      className="max-w-full rounded-lg shadow"
                    />
                  </div>
                )}

                {/* --- ERROR --- */}
                {m.type === 'error' && (
                  <div className="mt-2 text-red-500 text-sm font-medium">
                    ⚠️ {m.text || 'Đã xảy ra lỗi.'}
                  </div>
                )}
              </div>
            ))
          )}

          {isThinking && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-2">
              <span className="animate-pulse">🤔 AI đang suy nghĩ...</span>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      {/* Thanh nhập tin nhắn */}
      <div className="fixed bottom-0 left-0 right-0 ml-64 z-10 bg-gradient-to-t from-gray-50 via-gray-50 dark:from-gray-900 dark:via-gray-900 pt-6 pb-4">
        <div className="max-w-3xl mx-auto px-4 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isLoading ? '⏳ Đang chờ phản hồi...' : 'Nhập câu hỏi...'}
            disabled={isLoading}
            className="flex-1 px-6 py-4 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white border-gray-300 text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 shadow-lg disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="ml-2 p-4 rounded-full transition bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
