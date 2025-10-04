'use client'
import React, { useState } from 'react';
import { Search, Eye, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

import { Badge } from '../common/Badge'; 
import { AppointmentDetailModal } from './AppointmentDetailModal';

const mockAppointments = [
  { id: 1, clientName: 'Nguyễn Thị Mai', seerName: 'Minh Tuệ', service: 'Tư vấn Tình duyên', dateTime: '15/8/2024 - 14:30', duration: '45 phút', status: 'Hoàn thành', paymentStatus: 'Đã thanh toán', note: 'Tôi muốn hỏi về chuyện tình cảm.' },
  { id: 2, clientName: 'Nguyễn Thị Mai', seerName: 'Minh Tuệ', service: 'Tư vấn Tình duyên', dateTime: '15/8/2024 - 14:30', duration: '45 phút', status: 'Bị hủy', paymentStatus: 'Đã hoàn tiền', note: 'Khách hàng đã hủy vì lý do cá nhân.', cancellationReason: 'Khách hàng hủy vì bận đột xuất.' },
  { id: 3, clientName: 'Nguyễn Thị Mai', seerName: 'Minh Tuệ', service: 'Tư vấn Tình duyên', dateTime: '15/8/2024 - 14:30', duration: '45 phút', status: 'Đang diễn ra', paymentStatus: 'Đã thanh toán', note: 'Tôi muốn xem tử vi năm nay.' },
  { id: 4, clientName: 'Nguyễn Thị Mai', seerName: 'Minh Tuệ', service: 'Tư vấn Tình duyên', dateTime: '15/8/2024 - 14:30', duration: '45 phút', status: 'Chờ xác nhận', paymentStatus: 'Đã thanh toán', note: 'Tôi đặt hẹn gấp.' },
  { id: 5, clientName: 'Nguyễn Thị Mai', seerName: 'Minh Tuệ', service: 'Tư vấn Tình duyên', dateTime: '15/8/2024 - 14:30', duration: '45 phút', status: 'Đã xác nhận', paymentStatus: 'Đã thanh toán', note: 'Cần chuẩn bị trước giấy tờ.' },
  ...Array.from({ length: 97 - 5 }).map((_, i) => ({
    id: i + 6,
    clientName: `Khách hàng ${i + 1}`,
    seerName: `Nhà Tiên Tri ${i % 3 === 0 ? 'Tâm' : 'An'}`,
    service: i % 2 === 0 ? 'Xem Tử Vi' : 'Bói Bài Tarot',
    dateTime: `15/8/2024 - ${10 + i % 8}:00`,
    duration: '60 phút',
    status: i % 5 === 0 ? 'Hoàn thành' : i % 5 === 1 ? 'Chờ xác nhận' : i % 5 === 2 ? 'Đang diễn ra' : i % 5 === 3 ? 'Đã xác nhận' : 'Bị hủy',
    paymentStatus: i % 3 === 0 ? 'Đã thanh toán' : 'Đã hoàn tiền',
    note: `Ghi chú đặt lịch ${i + 6}`,
  })),
];

type AppointmentType = typeof mockAppointments[0];
const ITEMS_PER_PAGE = 10;
type StatusFilterType = 'Tất cả' | 'Hoàn thành' | 'Chờ xác nhận' | 'Đang diễn ra' | 'Bị hủy' | 'Đã xác nhận';

export const AppointmentTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<StatusFilterType>('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null);

  const filteredAppointments = mockAppointments.filter(app => {
    const matchesSearch = app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.seerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedFilter === 'Tất cả' || app.status === selectedFilter;
    return matchesSearch && matchesStatus;
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const totalItems = filteredAppointments.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

  const goToNextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const goToPrevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  
  const handleAction = (action: string, app: AppointmentType, reason?: string) => {
    console.log(`${action} lịch hẹn ID: ${app.id}, Khách: ${app.clientName}, Lý do: ${reason}`);
    setSelectedAppointment(null); 
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <div className="relative flex-grow mr-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên Khách hàng hoặc Nhà tiên tri..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                                   focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 
                                   text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>

                <div className="relative flex-shrink-0"> 
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 
                                   dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg 
                                   hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    >
                        <span>Trạng thái Mẫu</span> 
                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && ( 
                        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-700 
                                        ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-10">
                            <div className="py-1">
                                {['Tùy chọn Mẫu 1', 'Tùy chọn Mẫu 2'].map(option => (
                                    <button 
                                        key={option}
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="block w-full text-left px-4 py-2 text-sm 
                                                   text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex space-x-2 mb-4">
                <div className='inline-flex border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700'>
                    {['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đang diễn ra', 'Hoàn thành', 'Bị hủy'].map(status => (
                        <button 
                            key={status}
                            onClick={() => { setSelectedFilter(status as StatusFilterType); setCurrentPage(1); }}
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
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Khách hàng</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nhà tiên tri</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dịch vụ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thời gian</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thời lượng</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thanh toán</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentAppointments.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{app.clientName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.seerName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.service}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.dateTime}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.duration}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge type="status" value={app.status} />
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <Badge type="payment" value={app.paymentStatus} />
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      title="Xem chi tiết lịch hẹn" 
                      onClick={() => setSelectedAppointment(app)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
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

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment ? {
          ...selectedAppointment,
          price: '299.000 VND',
          category: 'Cung Hoàng Đạo - Tarot',
          confirmationTime: selectedAppointment.status === 'Đã xác nhận' || selectedAppointment.status === 'Hoàn thành' ? '14:00 10/08/2024' : undefined,
          cancellationReason: selectedAppointment.status === 'Bị hủy' ? selectedAppointment.cancellationReason : undefined,
          history: [
            { label: 'Đặt lịch và thanh toán', value: '15/08/2024 - 14:30' },
            { label: 'Xác nhận đặt lịch', value: '15/08/2024 - 14:30' },
            { label: 'Thời điểm bắt đầu', value: '15/08/2024 - 14:30' },
            { label: 'Thời điểm kết thúc', value: '15/08/2024 - 14:30' },
          ],
        } : null}
        onClose={() => setSelectedAppointment(null)}
        onConfirm={(id) => { handleAction('Xác nhận', selectedAppointment as AppointmentType); }}
        onCancel={(id, reason) => { handleAction('Từ chối', selectedAppointment as AppointmentType, reason); }}
      />
    </div>
  );
};
