'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, BarChart3, AlertCircle, Sparkles } from 'lucide-react';
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
    <div className="h-[calc(100vh-64px)] flex flex-col from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20">
      {/* Header với gradient */}
      <header className="relative dark:border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              ISU AI Assistant
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Phân tích dữ liệu thông minh</p>
          </div>
        </div>
      </header>

      {/* Nội dung chat */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="max-w-4xl mx-auto p-6 pb-32">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-xl">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Xin chào! Tôi là AI Assistant
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Hãy đặt câu hỏi về dữ liệu, tôi sẽ phân tích và trả lời bạn với biểu đồ, bảng số
                liệu chi tiết
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`mb-6 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex gap-3 max-w-[85%] ${
                    m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      m.role === 'user'
                        ? 'bg-blue-600 dark:bg-blue-500'
                        : 'bg-gradient-to-br from-purple-500 to-blue-600'
                    } shadow-md`}
                  >
                    {m.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <div className="flex-1">
                    {/* --- TEXT --- */}
                    {m.type === 'text' && (
                      <div
                        className={`px-5 py-3 rounded-2xl shadow-sm ${
                          m.role === 'user'
                            ? 'bg-blue-600 text-white dark:bg-blue-500 rounded-tr-sm'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm border border-gray-200/50 dark:border-gray-700/50'
                        }`}
                      >
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{m.text || ''}</ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {/* --- DATAFRAME --- */}
                    {m.type === 'dataframe' && (
                      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                        <div className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          <span className="font-semibold text-sm">
                            {m.data?.title || 'Kết quả truy vấn'}
                          </span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50 dark:bg-gray-700/50">
                                {m.data?.columns?.map((col: string) => (
                                  <th
                                    key={col}
                                    className="px-4 py-3 font-semibold text-left text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
                                  >
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {m.data?.data?.map((row: any, idx: number) => (
                                <tr
                                  key={idx}
                                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                                >
                                  {m.data.columns.map((col: string) => (
                                    <td
                                      key={col}
                                      className="px-4 py-3 text-gray-900 dark:text-gray-100"
                                    >
                                      {row[col]}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {m.data?.description && (
                          <div className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
                            {m.data.description}
                          </div>
                        )}
                      </div>
                    )}

                    {/* --- HTML --- */}
                    {m.type === 'html' && (
                      <div
                        className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: m.data }}
                      />
                    )}

                    {/* --- IMAGE --- */}
                    {m.type === 'image' && m.data?.url && (
                      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                        <img src={m.data.url} alt="AI generated" className="max-w-full" />
                      </div>
                    )}

                    {/* --- ERROR --- */}
                    {m.type === 'error' && (
                      <div className="flex items-start gap-2 px-5 py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{m.text || 'Đã xảy ra lỗi.'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {isThinking && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-5 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></span>
                  </div>
                  <span>Đang suy nghĩ...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      {/* Thanh nhập tin nhắn */}
      <div className="fixed bottom-0 left-0 right-0 ml-64 z-10 bg-gradient-to-t from-white via-white/95 dark:from-gray-900 dark:via-gray-900/95 pt-8 pb-6 dark:border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-400 dark:border-gray-700 p-2 transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isLoading ? 'Đang chờ phản hồi...' : 'Đặt câu hỏi về dữ liệu...'}
              disabled={isLoading}
              className="flex-1 px-5 py-4 bg-transparent text-sm focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 p-3 rounded-xl transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
