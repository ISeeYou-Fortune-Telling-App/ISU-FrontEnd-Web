'use client'
import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown, Check, X, MessageSquare, Send, XCircle, FilePlus } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cơ bản
type UserType = 'Khách hàng' | 'Nhà tiên tri' | 'AI Hỗ trợ';
interface Sender {
    id: number;
    name: string;
    type: UserType;
    lastActive: string;
    isSelected: boolean;
    isOnline: boolean;
}

// Dữ liệu giả lập
const mockSenders: Sender[] = [
    { id: 1, name: 'Thầy Minh Tuệ', type: 'Nhà tiên tri', lastActive: '', isSelected: true, isOnline: true },
    { id: 2, name: 'Trần Văn Long', type: 'Khách hàng', lastActive: '5 phút trước', isSelected: false, isOnline: false },
    { id: 3, name: 'Trần Văn Long', type: 'Khách hàng', lastActive: '5 phút trước', isSelected: true, isOnline: false },
    { id: 4, name: 'Trần Văn Long', type: 'Khách hàng', lastActive: '5 phút trước', isSelected: true, isOnline: false },
    { id: 5, name: 'Trần Văn Long', type: 'Khách hàng', lastActive: '5 phút trước', isSelected: false, isOnline: false },
    { id: 6, name: 'Nguyễn Văn A', type: 'Khách hàng', lastActive: '10 phút trước', isSelected: false, isOnline: true },
    { id: 7, name: 'Lê Thị B', type: 'Nhà tiên tri', lastActive: '1 giờ trước', isSelected: true, isOnline: false },
    { id: 8, name: 'AI Hỗ trợ C', type: 'AI Hỗ trợ', lastActive: 'Vừa xong', isSelected: false, isOnline: true },
    { id: 9, name: 'Đoàn Văn D', type: 'Khách hàng', lastActive: '2 ngày trước', isSelected: true, isOnline: false },
    { id: 10, name: 'Phạm Thị E', type: 'Khách hàng', lastActive: '10 phút trước', isSelected: false, isOnline: false },
    { id: 11, name: 'Vũ Đình G', type: 'Khách hàng', lastActive: '30 phút trước', isSelected: false, isOnline: true },
];

type MessageTab = 'group' | 'single';

const ITEMS_PER_PAGE = 10;

// Helper Component: Sender Avatar
const SenderAvatar: React.FC<{ name: string; isOnline: boolean; type: UserType }> = ({ name, isOnline, type }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    let bgColor = 'bg-gray-300 dark:bg-gray-600';
    if (type === 'Nhà tiên tri') bgColor = 'bg-blue-200 dark:bg-blue-900';
    if (type === 'Khách hàng') bgColor = 'bg-green-200 dark:bg-green-900';

    return (
        <div className={`relative w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-sm font-semibold text-white dark:text-gray-100`}>
            {initials}
            {isOnline && (
                <div className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
        </div>
    );
}

// Helper Component: Type Badge
const TypeBadge: React.FC<{ type: UserType }> = ({ type }) => {
    let color = 'text-gray-500 dark:text-gray-400';
    if (type === 'Nhà tiên tri') color = 'text-blue-500 dark:text-blue-400';
    if (type === 'Khách hàng') color = 'text-green-500 dark:text-green-400';

    return <span className={`text-xs ${color}`}>{type}</span>;
}

// --- MAIN COMPONENT ---
export const MessageTable: React.FC = () => {
    const [activeTab, setActiveTab] = useState<MessageTab>('group');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSenders, setSelectedSenders] = useState<Sender[]>(mockSenders.filter(s => s.isSelected));

    // Lọc người dùng
    const filteredSenders = mockSenders.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalItems = filteredSenders.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentSenders = filteredSenders.slice(startIndex, endIndex);

    const goToNextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    const goToPrevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));

    const handleSelectSender = (sender: Sender, isChecked: boolean) => {
        if (isChecked) {
            if (!selectedSenders.some(s => s.id === sender.id)) {
                setSelectedSenders([...selectedSenders, sender]);
            }
        } else {
            setSelectedSenders(selectedSenders.filter(s => s.id !== sender.id));
        }
    };

    const handleSelectAll = (select: boolean) => {
        if (select) {
            setSelectedSenders(filteredSenders);
        } else {
            setSelectedSenders([]);
        }
    };

    const isAllSelected = selectedSenders.length === filteredSenders.length && filteredSenders.length > 0;
    
    // Tìm người dùng đầu tiên đã chọn để hiển thị trong tab 'single'
    const defaultSingleUser = selectedSenders[0] || mockSenders[0];


    // --- RENDER COMPONENT CON ---
    
    const SenderList = () => (
        <div className="flex flex-col h-full p-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chọn người nhận</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tìm và chọn người dùng để gửi tin nhắn</p>
            
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email, SĐT,..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>
            
            {/* Filter */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tất cả người dùng</span>
                <button className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700">
                    Lọc theo loại <ChevronDown className="w-4 h-4 ml-1" />
                </button>
            </div>

            {/* Selection Status */}
            <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                Đã chọn - {selectedSenders.filter(s => s.type === 'Nhà tiên tri').length} Nhà tiên tri - {selectedSenders.filter(s => s.type === 'Khách hàng').length} Khách hàng
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
                <button 
                    onClick={() => handleSelectAll(true)}
                    disabled={isAllSelected}
                    className="flex-1 flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
                    <Check className="w-4 h-4 mr-1" /> Chọn tất cả
                </button>
                <button 
                    onClick={() => handleSelectAll(false)}
                    disabled={selectedSenders.length === 0}
                    className="flex-1 flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 transition-colors">
                    <X className="w-4 h-4 mr-1" /> Bỏ chọn tất cả
                </button>
            </div>

            {/* SENDER LIST */}
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {currentSenders.map((sender) => (
                    <div 
                        key={sender.id} 
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors 
                                ${selectedSenders.some(s => s.id === sender.id) 
                                    ? 'bg-blue-50 dark:bg-blue-900/50' 
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        onClick={() => handleSelectSender(sender, !selectedSenders.some(s => s.id === sender.id))}
                    >
                        <div className="flex items-center space-x-3">
                            <SenderAvatar name={sender.name} isOnline={sender.isOnline} type={sender.type} />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                    {sender.name}
                                    {sender.type === 'Nhà tiên tri' && sender.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>}
                                </span>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <TypeBadge type={sender.type} />
                                    {sender.lastActive && <span className="ml-2">• {sender.lastActive}</span>}
                                </div>
                            </div>
                        </div>
                        
                        {/* Checkbox (Replicated from the image) */}
                        <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${
                            selectedSenders.some(s => s.id === sender.id) 
                                ? 'bg-blue-600 border-blue-600' 
                                : 'border-gray-400 dark:border-gray-500'
                        }`}>
                            {selectedSenders.some(s => s.id === sender.id) && <Check className="w-4 h-4 text-white" />}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
                </span>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {currentPage}/{totalPages}
                    </span>
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

    const MessageComposeArea = () => {
        if (activeTab === 'group') {
            return (
                <div className="p-6 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Soạn tin nhắn</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Nhập nội dung tin nhắn gửi cho nhiều người</p>

                        {/* Tiêu đề tin nhắn */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề tin nhắn</label>
                            <input
                                type="text"
                                placeholder="Thông báo cập nhật"
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            />
                        </div>

                        {/* Nội dung tin nhắn */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nội dung tin nhắn</label>
                            <textarea
                                placeholder="Tháng 8 này, hệ thống sẽ tăng cường kiểm duyệt."
                                rows={4}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 resize-none"
                            ></textarea>
                            <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                                121/1000 ký tự
                            </div>
                        </div>
                        
                        {/* Media Placeholder */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Media</label>
                            <div className="w-full h-40 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-center">
                                <FilePlus className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                            <Send className="w-4 h-4 mr-2" /> Gửi tin nhắn
                        </button>
                        <button className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors">
                            <XCircle className="w-4 h-4 mr-2" /> Soạn lại
                        </button>
                    </div>
                </div>
            );
        }

        // Tab 'single' - Giao diện chi tiết hội thoại
        return (
            <div className="p-4 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700 mb-4">
                    <div className="flex items-center space-x-3">
                        <SenderAvatar name={defaultSingleUser.name} isOnline={defaultSingleUser.isOnline} type={defaultSingleUser.type} />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{defaultSingleUser.name}</h2>
                    </div>
                    <button onClick={() => setActiveTab('group')} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Message Display Area */}
                <div className="flex-grow overflow-y-auto space-y-3 pb-4">
                    {/* Receiver Bubble */}
                    <div className="flex justify-start">
                        <div className="max-w-xs lg:max-w-md p-3 rounded-xl rounded-tl-none bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        Chào thầy! Thầy vui lòng cập nhật ngày của chứng chỉ ABCXYZ của thầy nhé.
                        </div>
                    </div>

                    {/* Sender Bubble */}
                    <div className="flex justify-end">
                        <div className="max-w-xs lg:max-w-md p-3 rounded-xl rounded-br-none bg-blue-600 text-white">
                            Tôi đã cập nhật
                        </div>
                    </div>
                    
                    {/* ... Thêm nhiều tin nhắn mock khác nếu cần ... */}
                </div>

                {/* Input Area */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                    <button className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 p-2">
                        <FilePlus className="w-6 h-6" />
                    </button>
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        className="flex-grow px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    />
                    <button className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        <Send className="w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    }
    
    // --- MAIN RENDER ---
    return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                <button
                    onClick={() => setActiveTab('group')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'group'
                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                >
                    Soạn tin nhắn nhiều người
                </button>
                <button
                    onClick={() => setActiveTab('single')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'single'
                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                >
                    Soạn tin nhắn một người
                </button>
            </div>

            {/* Content Area - Split 2 columns */}
            <div className="flex h-[700px] -mt-4"> {/* Điều chỉnh chiều cao cho phù hợp */}
                {/* Column 1: Sender List (Luôn hiển thị) */}
                <div className="w-2/5 border-r border-gray-200 dark:border-gray-700">
                    <SenderList />
                </div>

                {/* Column 2: Message/Compose Area (Hiển thị theo Tab) */}
                <div className="w-3/5">
                    <MessageComposeArea />
                </div>
            </div>
        </div>
    );
};