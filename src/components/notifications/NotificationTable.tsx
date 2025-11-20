/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Trash2, ChevronDown, FileText } from 'lucide-react';
import { notificationService } from '@/services/notification/notification.service';
import { Notification, TargetType } from '@/types/notification/notification.type'; 


type NotificationState = Notification & {
    isSelected: boolean;
};

const ITEMS_PER_PAGE = 10;
type NotificationFilter = 'Chưa đọc' | 'Tất cả';

const getTargetTypeLabel = (type: TargetType) => {
    switch (type) {
        case TargetType.BOOKING: return 'Lịch đặt';
        case TargetType.PAYMENT: return 'Thanh toán';
        case TargetType.REPORT: return 'Báo cáo';
        case TargetType.CONVERSATION: return 'Tin nhắn';
        case TargetType.ACCOUNT: return 'Tài khoản';
        case TargetType.SERVICE_PACKAGES: return 'Gói dịch vụ';
        case TargetType.SERVICE_REVIEWS: return 'Đánh giá';
        default: return type;
    }
};

// --- MAIN COMPONENT ---
export const NotificationTable: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<NotificationFilter>('Chưa đọc');
    const [currentPage, setCurrentPage] = useState(1);
    
    // State dùng type mở rộng
    const [notifications, setNotifications] = useState<NotificationState[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);

    // --- API INTEGRATION ---
    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await notificationService.getMyNotifications({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                sortBy: 'createdAt',
                sortType: 'desc',
            });

            // Map data từ API sang State (thêm field isSelected = false)
            const mappedData: NotificationState[] = res.data.map((item: any) => ({
                ...item,
                isSelected: false, 
            }));

            setNotifications(mappedData);
            setTotalItems((res as any).meta?.total || (res as any).total || 0);

        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // --- LOGIC UI ---

    const filteredNotifications = notifications.filter(n => {
        if (activeFilter === 'Chưa đọc') return !n.isRead;
        return true;
    });
    
    const selectedNotifications = notifications.filter(n => n.isSelected);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const currentNotifications = filteredNotifications; 

    const goToNextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    const goToPrevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    
    const selectedDetail = notifications.find(n => n.id === selectedNotificationId) || null;

    // --- HANDLERS ---

    const handleSelectNotification = (id: string, isChecked: boolean) => {
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

    const handleMarkAllRead = async () => {
        const idsToMark = selectedNotifications.length > 0 
            ? selectedNotifications.map(n => n.id) 
            : filteredNotifications.map(n => n.id);

        if (idsToMark.length === 0) return;

        try {
            await Promise.all(idsToMark.map(id => notificationService.markAsRead(id)));
            fetchNotifications(); // Refresh data chuẩn nhất
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };
    
    const handleDeleteSelected = async () => {
        const idsToDelete = selectedNotifications.map(n => n.id);
        if (idsToDelete.length === 0) return;

        if (!confirm('Bạn có chắc chắn muốn xóa các thông báo đã chọn?')) return;

        try {
            await Promise.all(idsToDelete.map(id => notificationService.deleteNotification(id)));
            setSelectedNotificationId(null);
            fetchNotifications();
        } catch (error) {
            console.error("Error deleting notifications:", error);
        }
    };
    
    const handleViewDetail = async (id: string) => {
        setSelectedNotificationId(id);
        
        const noti = notifications.find(n => n.id === id);
        if (noti && !noti.isRead) {
            try {
                await notificationService.markAsRead(id);
                setNotifications(prev => prev.map(n => 
                    n.id === id ? { ...n, isRead: true } : n
                ));
            } catch (error) {
                console.error("Error marking read on view:", error);
            }
        }
    };

    const handleDeleteSingle = async (id: string) => {
        if (!confirm('Xóa thông báo này?')) return;
        try {
            await notificationService.deleteNotification(id);
            if (selectedNotificationId === id) setSelectedNotificationId(null);
            fetchNotifications();
        } catch (error) {
            console.error("Error deleting single:", error);
        }
    };
    
    // --- RENDER ---
    
    const NotificationList = () => (
        <div className="flex flex-col h-full p-4 space-y-4">
            {/* Header Filter */}
            <div className="flex justify-between items-center text-sm font-medium border-b border-gray-200 dark:border-gray-700 pb-2 -mt-1">
                <div className="flex space-x-1">
                    <button
                        onClick={() => { setActiveFilter('Chưa đọc'); }}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                            activeFilter === 'Chưa đọc'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        Chưa đọc
                    </button>
                    <button
                        onClick={() => { setActiveFilter('Tất cả'); }}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                            activeFilter === 'Tất cả'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        Tất cả
                    </button>
                </div>
                {isLoading && <span className="text-xs text-blue-500">Đang tải...</span>}
            </div>
            
            {/* Action Bar */}
            <div className="flex items-center space-x-2">
                <button className="flex items-center text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 cursor-default">
                    Loại thông báo <ChevronDown className="w-4 h-4 ml-1 inline" />
                </button>
                <button
                    onClick={handleMarkAllRead}
                    disabled={selectedNotifications.length === 0 && unreadCount === 0}
                    className="flex items-center text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-colors px-3 py-1">
                    <Check className="w-4 h-4 mr-1" /> Đánh dấu đã đọc
                </button>
                <button 
                    onClick={handleDeleteSelected}
                    disabled={selectedNotifications.length === 0}
                    className="flex items-center text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 transition-colors px-3 py-1">
                    <Trash2 className="w-4 h-4 mr-1" /> Xóa đã chọn
                </button>
            </div>

            <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                Đã chọn - {selectedNotifications.length} Thông báo
            </div>
            
            <div className="flex space-x-2">
                <button 
                    onClick={() => handleSelectAll(true)}
                    disabled={currentNotifications.length === 0}
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

            {/* LIST ITEMS */}
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {currentNotifications.length === 0 && !isLoading ? (
                    <div className="text-center text-gray-500 mt-10">Không có thông báo nào</div>
                ) : (
                    currentNotifications.map((n) => (
                        <div 
                            key={n.id} 
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border-l-4 mb-2
                                    ${n.id === selectedNotificationId 
                                        ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-600'
                                        : n.isRead
                                            ? 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                                            : 'bg-blue-100 dark:bg-blue-900 border-blue-600 hover:bg-blue-200 dark:hover:bg-blue-800'
                                    }`}
                            onClick={() => handleViewDetail(n.id)}
                        >
                            <div className="flex items-center space-x-3 w-full">
                                <div 
                                    onClick={(e) => { e.stopPropagation(); handleSelectNotification(n.id, !n.isSelected); }}
                                    className={`w-5 h-5 border rounded flex items-center justify-center transition-all flex-shrink-0 ${
                                        n.isSelected 
                                            ? 'bg-blue-600 border-blue-600' 
                                            : 'border-gray-400 dark:border-gray-500'
                                    }`}>
                                    {n.isSelected && <Check className="w-4 h-4 text-white" />}
                                </div>
                                
                                <div className="flex flex-col flex-grow overflow-hidden">
                                    <div className="flex justify-between items-start">
                                        <span className={`text-sm font-semibold truncate ${n.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                            {/* BINDING: notificationTitle */}
                                            {n.notificationTitle}
                                        </span>
                                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                                            {/* BINDING: createdAt */}
                                            {new Date(n.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    {/* BINDING: notificationBody (làm excerpt) */}
                                    <p className={`text-xs ${n.isRead ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-200'} line-clamp-1`}>
                                        {n.notificationBody}
                                    </p>
                                    {/* Hiển thị Type nhỏ bên dưới */}
                                    <span className="text-[10px] text-blue-500 uppercase mt-1">
                                        {getTargetTypeLabel(n.targetType)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    {totalItems > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}
                    -
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems}
                </span>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {currentPage}/{totalPages || 1}
                    </span>
                    <button onClick={goToPrevPage} disabled={currentPage === 1 || isLoading}
                        className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
                            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}>
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={goToNextPage} disabled={currentPage >= totalPages || isLoading}
                        className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
                            currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
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
                
                <div className="flex items-center mb-4">
                     <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold mr-2">
                        {getTargetTypeLabel(selectedDetail.targetType)}
                     </span>
                     <span className="text-xs text-gray-500">
                        {new Date(selectedDetail.createdAt).toLocaleString('vi-VN')}
                     </span>
                </div>

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chi tiết thông báo</h2>

                {/* Tiêu đề */}
                <div className="mt-4 space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề</label>
                    <div className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                        {/* BINDING: notificationTitle */}
                        {selectedDetail.notificationTitle}
                    </div>
                </div>

                {/* Nội dung */}
                <div className="mt-4 space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nội dung</label>
                    <div className="w-full h-32 p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 overflow-y-auto whitespace-pre-wrap">
                        {/* BINDING: notificationBody */}
                        {selectedDetail.notificationBody}
                    </div>
                </div>
                
                {/* Media (Image) */}
                <div className="mt-4 space-y-1 flex-grow">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hình ảnh đính kèm</label>
                    <div className="w-full h-40 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-center overflow-hidden">
                        {/* BINDING: imageUrl */}
                        {selectedDetail.imageUrl ? (
                             <img src={selectedDetail.imageUrl} alt="Attachment" className="max-h-full object-contain" />
                        ) : (
                            <div className="flex flex-col items-center text-blue-400">
                                <FileText className="w-6 h-6 mb-2" />
                                <span className="text-xs">Không có hình ảnh</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                    <button 
                        onClick={() => handleDeleteSingle(selectedDetail.id)}
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors">
                        <Trash2 className="w-4 h-4 mr-2" /> Xóa thông báo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex h-[700px]">
                <div className="w-2/5 border-r border-gray-200 dark:border-gray-700">
                    <NotificationList />
                </div>
                <div className="w-3/5">
                    <NotificationDetail />
                </div>
            </div>
        </div>
    );
};