'use client'
import React, { useState } from 'react';
import { Search, Eye, X, ChevronLeft, ChevronRight, Clock, CheckCircle, Ban, RefreshCcw } from 'lucide-react';

// SỬ DỤNG CÁC COMPONENTS BẠN ĐÃ CUNG CẤP (StatusBadge)
import { StatusBadge } from '../common/StatusBadge'; 
import { AppointmentDetailModal } from './AppointmentDetailModal'; // Modal vừa tạo

// --- Dữ liệu giả định và Types ---
const mockAppointments = [
    { id: 1, clientName: 'Nguyễn Thị Mai', seerName: 'Minh Tuệ', service: 'Tư vấn Tình duyên', dateTime: '15/8/2024 - 14:30', duration: '45 phút', status: 'Hoàn thành', paymentStatus: 'Đã thanh toán', note: 'Tôi muốn hỏi về chuyện tình cảm.' },
    { id: 2, clientName: 'Nguyễn Thị Mai', seerName: 'Minh Tuệ', service: 'Tư vấn Tình duyên', dateTime: '15/8/2024 - 14:30', duration: '45 phút', status: 'Bị hủy', paymentStatus: 'Đã hoàn tiền', note: 'Khách hàng đã hủy vì lý do cá nhân.', cancellationReason: 'Khách hàng hủy vì bận đột xuất.' },
    { id: 3, clientName: 'Nguyễn Thị Mai', seerName: 'Minh Tuệ', service: 'Tư vấn Tình duyên', dateTime: '15/8/2024 - 14:30', duration: '45 phút', status: 'Đang diễn ra', paymentStatus: 'Đã thanh toán', note: 'Tôi muốn xem tử vi năm nay.' },
    { id: 4, clientName: 'Nguyễn Thị Mai', seerName: 'Minh Tuệ', service: 'Tư vấn Tình duyên', dateTime: '15/8/2024 - 14:30', duration: '45 phút', status: 'Chờ xác nhận', paymentStatus: 'Đã thanh toán', note: 'Tôi đặt hẹn gấp.' },
    { id: 5, clientName: 'Nguyễn Thị Mai', seerName: 'Minh Tuệ', service: 'Tư vấn Tình duyên', dateTime: '15/8/2024 - 14:30', duration: '45 phút', status: 'Đã xác nhận', paymentStatus: 'Đã thanh toán', note: 'Cần chuẩn bị trước giấy tờ.' },
    { id: 6, clientName: 'Nguyễn Thị Mai', seerName: 'Minh Tuệ', service: 'Tư vấn Tình duyên', dateTime: '15/8/2024 - 14:30', duration: '45 phút', status: 'Đã xác nhận', paymentStatus: 'Đã thanh toán', note: 'Cần chuẩn bị trước giấy tờ.' },
    { id: 7, clientName: 'Nguyễn Thị Mai', seerName: 'Minh Tuệ', service: 'Tư vấn Tình duyên', dateTime: '15/8/2024 - 14:30', duration: '45 phút', status: 'Đã xác nhận', paymentStatus: 'Đã thanh toán', note: 'Cần chuẩn bị trước giấy tờ.' },
    // ... Dữ liệu khác ...
    ...Array.from({ length: 97 - 7 }).map((_, i) => ({
        id: i + 8,
        clientName: `Khách hàng ${i + 1}`,
        seerName: `Nhà Tiên Tri ${i % 3 === 0 ? 'Tâm' : 'An'}`,
        service: i % 2 === 0 ? 'Xem Tử Vi' : 'Bói Bài Tarot',
        dateTime: `15/8/2024 - ${10 + i % 8}:00`,
        duration: '60 phút',
        status: i % 5 === 0 ? 'Hoàn thành' : i % 5 === 1 ? 'Chờ xác nhận' : i % 5 === 2 ? 'Đang diễn ra' : i % 5 === 3 ? 'Đã xác nhận' : 'Bị hủy',
        paymentStatus: i % 3 === 0 ? 'Đã thanh toán' : 'Đã hoàn tiền',
        note: `Ghi chú đặt lịch ${i + 8}`,
    })),
];

type AppointmentType = typeof mockAppointments[0];
const ITEMS_PER_PAGE = 10;
type StatusFilterType = 'Tất cả' | 'Hoàn thành' | 'Chờ xác nhận' | 'Đang diễn ra' | 'Bị hủy' | 'Đã xác nhận';

// Hàm lấy style cho Payment Status
const getPaymentStatusBadge = (status: string) => {
    const classes = 'px-2 py-0.5 text-xs font-semibold rounded-md';
    if (status === 'Đã thanh toán') return `${classes} bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200`;
    if (status === 'Đã hoàn tiền') return `${classes} bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200`;
    return `${classes} bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200`;
};

// Hàm lấy style cho Appointment Status (Dùng StatusBadge nhưng cần cập nhật logic hiển thị)
const getAppointmentStatusBadge = (status: string) => {
    switch(status) {
        case 'Hoàn thành': return 'bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-100';
        case 'Chờ xác nhận': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100';
        case 'Đang diễn ra': return 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100';
        case 'Đã xác nhận': return 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100';
        case 'Bị hủy': return 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100';
        default: return 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
    }
}
const AppointmentStatusBadge: React.FC<{ status: string }> = ({ status }) => (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${getAppointmentStatusBadge(status)}`}>
        {status}
    </span>
)


export const AppointmentTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<StatusFilterType>('Tất cả');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null);

    // Logic Lọc & Phân trang
    const filteredAppointments = mockAppointments.filter(app => {
        const matchesSearch = app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              app.seerName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = selectedFilter === 'Tất cả' || app.status === selectedFilter;
        
        return matchesSearch && matchesStatus;
    });

    const totalItems = filteredAppointments.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

    const goToNextPage = () => { setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev)); };
    const goToPrevPage = () => { setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev)); };
    
    // Hàm xử lý hành động (Xác nhận, Hủy)
    const handleAction = (action: string, app: AppointmentType, reason?: string) => {
        console.log(`${action} lịch hẹn ID: ${app.id}, Khách: ${app.clientName}, Lý do: ${reason}`);
        setSelectedAppointment(null); 
    };

    // Hàm tổng hợp data count cho các card trên đầu
    const getSummaryCounts = () => {
        const total = mockAppointments.length;
        const completed = mockAppointments.filter(a => a.status === 'Hoàn thành').length;
        const pending = mockAppointments.filter(a => a.status === 'Chờ xác nhận').length;
        const cancelled = mockAppointments.filter(a => a.status === 'Bị hủy').length;
        return { total, completed, pending, cancelled };
    };
    const summary = getSummaryCounts();


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quản lý lịch hẹn</h1>
            
            {/* THÔNG TIN TÓM TẮT CARD */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Tổng lịch hẹn', count: summary.total, color: 'text-blue-600', icon: Eye },
                    { label: 'Hoàn thành', count: summary.completed, color: 'text-purple-600', icon: CheckCircle },
                    { label: 'Chờ xác nhận', count: summary.pending, color: 'text-yellow-600', icon: Clock },
                    { label: 'Bị hủy', count: summary.cancelled, color: 'text-red-600', icon: Ban },
                ].map((item, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                        <div className="flex items-end justify-between mt-1">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{item.count.toLocaleString()}</span>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                
                {/* HÀNG 1: SEARCH VÀ DROPDOWN TRỐNG */}
                <div className="flex justify-between items-center mb-4">
                    <div className="relative flex-grow mr-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên Khách hàng hoặc tên Nhà tiên tri..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    {/* DROPDOWN TRỐNG (Tất cả) */}
                    <div className="flex-shrink-0"> 
                        <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <span>Tất cả</span> 
                            <ChevronLeft className='w-4 h-4 rotate-90'/> 
                        </button>
                    </div>
                </div>

                {/* HÀNG 2: STATUS FILTER TABS */}
                <div className="flex space-x-2 mb-4">
                    <div className='inline-flex border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700'>
                        {['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đang diễn ra', 'Hoàn thành', 'Bị hủy'].map(status => (
                            <button 
                                key={status}
                                onClick={() => {
                                    setSelectedFilter(status as StatusFilterType);
                                    setCurrentPage(1); 
                                }}
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

                {/* Appointment Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Khách hàng</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nhà tiên tri</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dịch vụ</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thời gian</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trạng thái</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thanh toán</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {currentAppointments.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{app.clientName}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.seerName}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.service}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.dateTime}</td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <AppointmentStatusBadge status={app.status} />
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <span className={getPaymentStatusBadge(app.paymentStatus)}>{app.paymentStatus}</span>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            {/* Nút Xem */}
                                            <button 
                                                title="Xem chi tiết lịch hẹn" 
                                                onClick={() => setSelectedAppointment(app)}
                                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 transition-colors"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>

                                            {/* Nút Hủy */}
                                            <button 
                                                title="Hủy lịch hẹn" 
                                                onClick={() => handleAction('Hủy', app)}
                                                className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
                    </span>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{currentPage}/{totalPages}</span>
                        <button 
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
                                currentPage === 1 
                                    ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                                    : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
                                currentPage === totalPages
                                    ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Appointment Detail Modal */}
            <AppointmentDetailModal
                appointment={selectedAppointment ? {
                    ...selectedAppointment,
                    confirmationTime: selectedAppointment.status === 'Đã xác nhận' || selectedAppointment.status === 'Hoàn thành' ? '14:00 10/08/2024' : undefined,
                    cancellationReason: selectedAppointment.status === 'Bị hủy' ? selectedAppointment.cancellationReason : undefined,
                } : null}
                onClose={() => setSelectedAppointment(null)}
                onConfirm={(id) => { handleAction('Xác nhận', selectedAppointment as AppointmentType); }}
                onCancel={(id, reason) => { handleAction('Từ chối', selectedAppointment as AppointmentType, reason); }}
            />
        </div>
    );
};