'use client'
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Bell, Trash2, XCircle, ChevronDown, FileText } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cơ bản
type NotificationType = 'Đăng ký tài khoản' | 'Yêu cầu rút tiền' | 'Bài viết mới';
interface Notification {
    id: number;
    title: string;
    excerpt: string;
    type: NotificationType;
    isRead: boolean;
    isSelected: boolean;
    content: string;
    media: string; // Placeholder cho URL Media
}

// Dữ liệu giả lập
const mockNotifications: Notification[] = Array.from({ length: 97 }).map((_, i) => ({
    id: i + 1,
    title: 'Đăng ký tài khoản Nhà tiên tri',
    excerpt: 'Minh Tuệ đã đăng ký tài khoản Nhà tiên tri mới trong hệ thống của bạn.',
    type: 'Đăng ký tài khoản',
    isRead: i % 4 !== 0, // 3/4 là đã đọc, 1/4 là chưa đọc
    isSelected: false,
    content: 'Tháng 8 này, Minh Tuệ đã chính thức trở thành một Nhà Tiên Tri trên hệ thống. Vui lòng xác minh và cung cấp tài liệu chứng nhận cho tài khoản này.',
    media: 'image-url.png',
}));

type NotificationFilter = 'Chưa đọc' | 'Tất cả';
const ITEMS_PER_PAGE = 10;

// --- MAIN COMPONENT ---
export const NotificationTable: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<NotificationFilter>('Chưa đọc');
    const [currentPage, setCurrentPage] = useState(1);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(mockNotifications.find(n => !n.isRead)?.id || mockNotifications[0].id);

    // Logic Lọc & Phân trang
    const filteredNotifications = notifications.filter(n => {
        if (activeFilter === 'Chưa đọc') return !n.isRead;
        return true;
    });
    
    const selectedNotifications = notifications.filter(n => n.isSelected);

    const totalItems = filteredNotifications.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentNotifications = filteredNotifications.slice(startIndex, endIndex);

    const goToNextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    const goToPrevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    
    const selectedDetail = notifications.find(n => n.id === selectedNotificationId) || null;
    const unreadCount = notifications.filter(n => !n.isRead).length;


    // --- Handlers ---
    const handleSelectNotification = (id: number, isChecked: boolean) => {
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, isSelected: isChecked } : n
        ));
    };

    const handleSelectAll = (select: boolean) => {
        const currentIds = currentNotifications.map(n => n.id);
        setNotifications(prev => prev.map(n => 
            currentIds.includes(n.id) ? { ...n, isSelected: select } : n
        ));
    };

    const handleMarkAllRead = () => {
        const idsToMark = selectedNotifications.length > 0 ? selectedNotifications.map(n => n.id) : filteredNotifications.map(n => n.id);
        setNotifications(prev => prev.map(n => 
            idsToMark.includes(n.id) ? { ...n, isRead: true, isSelected: false } : n
        ));
    };
    
    const handleDeleteSelected = () => {
        setNotifications(prev => prev.filter(n => !n.isSelected));
        setSelectedNotificationId(null);
    };
    
    const handleViewDetail = (id: number) => {
        setSelectedNotificationId(id);
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, isRead: true } : n
        ));
    };
    
    // --- RENDER COMPONENT CON ---
    
    const NotificationList = () => (
        <div className="flex flex-col h-full p-4 space-y-4">
            
            {/* Header and Filter Tabs */}
            <div className="flex justify-between items-center text-sm font-medium border-b border-gray-200 dark:border-gray-700 pb-2 -mt-1">
                <div className="flex space-x-1">
                    <button
                        onClick={() => { setActiveFilter('Chưa đọc'); setCurrentPage(1); }}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                            activeFilter === 'Chưa đọc'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        Chưa đọc ({unreadCount})
                    </button>
                    <button
                        onClick={() => { setActiveFilter('Tất cả'); setCurrentPage(1); }}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                            activeFilter === 'Tất cả'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        Tất cả ({notifications.length})
                    </button>
                </div>
            </div>
            
            {/* Action Bar */}
            <div className="flex items-center space-x-2">
                <button className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1">
                    Loại thông báo <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                <button
                    onClick={handleMarkAllRead}
                    disabled={selectedNotifications.length === 0 && unreadCount === 0}
                    className="flex items-center text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-colors px-3 py-1">
                    <Check className="w-4 h-4 mr-1" /> Đánh dấu tất cả đã đọc
                </button>
                <button 
                    onClick={handleDeleteSelected}
                    disabled={selectedNotifications.length === 0}
                    className="flex items-center text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 transition-colors px-3 py-1">
                    <Trash2 className="w-4 h-4 mr-1" /> Xóa tất cả
                </button>
            </div>


            {/* Selection Status */}
            <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                Đã chọn - {selectedNotifications.length} Thông báo
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
                <button 
                    onClick={() => handleSelectAll(true)}
                    disabled={selectedNotifications.length === currentNotifications.length && currentNotifications.length > 0}
                    className="flex-1 flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
                    <Check className="w-4 h-4 mr-1" /> Chọn tất cả
                </button>
                <button 
                    onClick={() => handleSelectAll(false)}
                    disabled={selectedNotifications.length === 0}
                    className="flex-1 flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 transition-colors">
                    <X className="w-4 h-4 mr-1" /> Bỏ chọn tất cả
                </button>
            </div>

            {/* NOTIFICATION LIST */}
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {currentNotifications.map((n) => (
                    <div 
                        key={n.id} 
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border-l-4 
                                ${n.id === selectedNotificationId 
                                    ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-600'
                                    : n.isRead
                                        ? 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                                        : 'bg-blue-100 dark:bg-blue-900 border-blue-600 hover:bg-blue-200 dark:hover:bg-blue-800'
                                }`}
                        onClick={() => handleViewDetail(n.id)}
                    >
                        <div className="flex items-center space-x-3">
                            {/* Checkbox */}
                            <div 
                                onClick={(e) => { e.stopPropagation(); handleSelectNotification(n.id, !n.isSelected); }}
                                className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${
                                    n.isSelected 
                                        ? 'bg-blue-600 border-blue-600' 
                                        : 'border-gray-400 dark:border-gray-500'
                                }`}>
                                {n.isSelected && <Check className="w-4 h-4 text-white" />}
                            </div>
                            
                            <div className="flex flex-col">
                                <span className={`text-sm font-semibold ${n.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                    {n.title}
                                </span>
                                <p className={`text-xs ${n.isRead ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-200'} line-clamp-1`}>
                                    {n.excerpt}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-2">
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

    const NotificationDetail = () => {
        if (!selectedDetail) {
            return (
                <div className="p-6 h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Chọn một thông báo để xem chi tiết.
                </div>
            );
        }

        return (
            <div className="p-6 h-full flex flex-col">
                <div className="flex justify-end mb-4">
                    <button onClick={() => setSelectedNotificationId(null)} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Nội dung tin nhắn</h2>

                {/* Tiêu đề tin nhắn */}
                <div className="mt-4 space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề tin nhắn</label>
                    <div className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                        {selectedDetail.title}
                    </div>
                </div>

                {/* Nội dung tin nhắn */}
                <div className="mt-4 space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nội dung tin nhắn</label>
                    <div className="w-full h-24 p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 overflow-y-auto">
                        {selectedDetail.excerpt}
                    </div>
                    <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                        121/1000 ký tự
                    </div>
                </div>
                
                {/* Media Placeholder */}
                <div className="mt-4 space-y-1 flex-grow">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Media</label>
                    <div className="w-full h-40 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                    <button 
                        onClick={() => { /* Xử lý xóa thông báo */ }}
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors">
                        <Trash2 className="w-4 h-4 mr-2" /> Xóa thông báo
                    </button>
                </div>
            </div>
        );
    }

    
    // --- MAIN RENDER ---
    return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Content Area - Split 2 columns */}
            <div className="flex h-[700px]"> {/* Điều chỉnh chiều cao cho phù hợp */}
                {/* Column 1: Notification List (40%) */}
                <div className="w-2/5 border-r border-gray-200 dark:border-gray-700">
                    <NotificationList />
                </div>

                {/* Column 2: Notification Detail (60%) */}
                <div className="w-3/5">
                    <NotificationDetail />
                </div>
            </div>
        </div>
    );
};