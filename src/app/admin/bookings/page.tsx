/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { sendVannaMessageV2 } from '@/services/ai/ai.service';
import ReactMarkdown from 'react-markdown';
import { Send } from 'lucide-react';

export default function ChatNotebookPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setEvents((prev) => [...prev, { type: 'user', data: { content: input } }]);
    const userInput = input;
    setInput('');

    await sendVannaMessageV2(userInput, (rich) => {
      setEvents((prev) => [...prev, rich]);
    });

    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  const renderEvent = (event: any, i: number) => {
    const { type, data } = event;

    if (type === 'user')
      return (
        <div key={i} className="flex justify-end">
          <div className="max-w-[75%] bg-blue-500 text-white p-3 rounded-2xl rounded-br-none shadow">
            {data.content}
          </div>
        </div>
      );

    if (type === 'text')
      return (
        <div key={i} className="flex justify-start">
          <div className="max-w-[75%] bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-3 rounded-2xl rounded-bl-none shadow">
            <ReactMarkdown>{data.content}</ReactMarkdown>
          </div>
        </div>
      );

    if (type === 'status_bar_update')
      return (
        <div key={i} className="text-xs text-gray-400 text-center italic">
          {data.message}
        </div>
      );

    if (type === 'dataframe')
      return (
        <div
          key={i}
          className="overflow-auto border rounded p-2 bg-gray-50 dark:bg-gray-900 text-sm"
        >
          <table className="w-full border-collapse text-gray-800 dark:text-gray-100">
            <thead>
              <tr>
                {data.columns.map((col: string) => (
                  <th key={col} className="border px-2 py-1 bg-gray-100 dark:bg-gray-800">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((row: any, j: number) => (
                <tr key={j}>
                  {data.columns.map((col: string) => (
                    <td key={col} className="border px-2 py-1">
                      {String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    return (
      <div key={i} className="text-gray-400 italic text-center">
        Unhandled type: {type}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[85vh] w-full bg-white dark:bg-gray-950 rounded-2xl shadow border border-gray-200 dark:border-gray-800">
      {/* Khu chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {events.map((ev, i) => renderEvent(ev, i))}
        <div ref={chatEndRef} />
      </div>

      {/* Ô nhập chat */}
      <div className="flex items-center gap-2 p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-500 p-2 rounded-full hover:bg-blue-400 transition disabled:opacity-50"
        >
          <Send size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
