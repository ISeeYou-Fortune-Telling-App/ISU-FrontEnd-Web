'use client'
import React, { useState } from 'react';
import { Search, Eye, X, ChevronLeft, ChevronRight, ChevronDown, MessageSquare } from 'lucide-react';

// Định nghĩa kiểu dữ liệu
interface Conversation {
    id: number;
    type: 'Nhà tiên tri' | 'AI Hỗ trợ';
    customer: string;
    seer: string;
    lastMessage: string;
    lastMessageTime: string;
    duration: string;
    messagesCount: number;
    status: 'Đang hoạt động' | 'Đã kết thúc' | 'Bị hủy';
    startTime: string;
}
type ConversationStatusFilter = 'Tất cả' | 'Đang hoạt động' | 'Đã kết thúc' | 'Bị hủy';

// Dữ liệu giả lập
const mockConversations: Conversation[] = Array.from({ length: 97 }).map((_, i) => ({
    id: i + 1,
    type: i % 3 === 0 ? 'Nhà tiên tri' : 'AI Hỗ trợ',
    customer: 'Minh Tuệ',
    seer: 'Nguyễn Thị Mai',
    lastMessage: i % 5 === 0 ? 'Nếu mình đánh thuốc thì thằng đó có yêu mình không?' : 'Cảm ơn thầy rất nhiều! Tối nay em qua nhà thầy trả bài...',
    lastMessageTime: `22:45 13/08/2024`,
    duration: '45 phút',
    messagesCount: 142,
    status: (i % 3 === 0
      ? 'Đang hoạt động'
      : i % 3 === 1
      ? 'Đã kết thúc'
      : 'Bị hủy') as Conversation['status'],
    startTime: `16:30 10/0${(i % 9) + 1}/2020`,
  }));

const ITEMS_PER_PAGE = 10;

// Giả lập component Badge (Sử dụng style của PaymentTable)
const ConversationBadge = ({ value }: { value: string }) => {
    let colorClass = 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
    if (value === 'Đang hoạt động') colorClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (value === 'Đã kết thúc') colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (value === 'Bị hủy') colorClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';

    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colorClass}`}>{value}</span>;
}


export const ConversationTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<ConversationStatusFilter>('Tất cả');
    const [currentPage, setCurrentPage] = useState(1);
    // const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null); // Có thể dùng cho Modal chi tiết

    // 1. Lọc Logic... (Giữ nguyên)
    const filteredConversations = mockConversations.filter(conv => {
      const matchesSearch =
        conv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.seer.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = selectedFilter === 'Tất cả' || conv.status === selectedFilter;
      return matchesSearch && matchesStatus;
    });

    const totalItems = filteredConversations.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentConversations = filteredConversations.slice(startIndex, endIndex);

    // 2. Phân trang Logic... (Giữ nguyên)
    const goToNextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    const goToPrevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            
            {/* HEADER: Search (Giống PaymentTable) */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên Người tham gia..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                      focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 
                      text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>

            {/* FILTER TABS (Giống PaymentTable: group button) */}
            <div className="flex space-x-2 mb-4">
                <div className="inline-flex border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
                    {['Tất cả', 'Đang hoạt động', 'Đã kết thúc', 'Bị hủy'].map(status => (
                        <button
                            key={status}
                            onClick={() => { setSelectedFilter(status as ConversationStatusFilter); setCurrentPage(1); }}
                            className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors 
                                ${selectedFilter === status
                                    ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 font-semibold'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* TABLE (Thêm border bao quanh) */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {['Loại', 'Người tham gia', 'Tin nhắn gần nhất', 'Thời lượng', 'Tin nhắn', 'Trạng thái', 'Thời gian', 'Thao tác'].map(header => (
                                <th 
                                    key={header} 
                                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${header === 'Thao tác' ? 'text-right' : ''}`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentConversations.map((conv) => (
                            <tr key={conv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                                
                                {/* Loại */}
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="flex items-center">
                                        <MessageSquare className="w-4 h-4 mr-1 text-blue-500" /> {conv.type}
                                    </span>
                                </td>
                                
                                {/* Người tham gia */}
                                <td className="px-4 py-3 text-sm">
                                    <div className="font-medium text-gray-900 dark:text-white">{conv.customer}</div>
                                    <div className="text-gray-500 dark:text-gray-400 text-xs italic">{conv.seer}</div>
                                </td>
                                
                                {/* Tin nhắn gần nhất */}
                                <td className="px-4 py-3 text-sm">
                                    <div className="text-gray-800 dark:text-gray-100 line-clamp-1 max-w-xs">{conv.lastMessage}</div>
                                    <div className="text-gray-500 dark:text-gray-400 text-xs italic">{conv.lastMessageTime}</div>
                                </td>
                                
                                {/* Thời lượng */}
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{conv.duration}</td>
                                
                                {/* Tin nhắn */}
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{conv.messagesCount}</td>
                                
                                {/* Trạng thái */}
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                    <ConversationBadge value={conv.status} />
                                </td>
                                
                                {/* Thời gian */}
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{conv.startTime}</td>
                                
                                {/* Thao tác */}
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        // onClick={() => setSelectedConversation(conv)} // Mở Modal Chi tiết
                                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 p-1 transition-colors"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-1 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION (Giữ nguyên) */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
                </span>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {currentPage}/{totalPages}
                    </span>
                    {/* Navigations */}
                    <button onClick={goToPrevPage} disabled={currentPage === 1}
                        className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
                            currentPage === 1
                                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}>
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages}
                        className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
                            currentPage === totalPages
                                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};