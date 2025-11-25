'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BookingDetailModal } from './AppointmentDetailModal';
import { Badge } from '../common/Badge';
import { BookingService } from '@/services/booking/booking.service';
import type { BookingResponse, BookingStatus } from '@/types/booking/booking.type';

const ITEMS_PER_PAGE = 10;
type StatusFilterType = 'Tất cả' | 'PENDING' | 'CONFIRMED' | 'FAILED' | 'COMPLETED' | 'CANCELED';

export const BookingTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<StatusFilterType>('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // =========================================================
  // 🔹 Fetch API từ backend
  // =========================================================
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await BookingService.getBookings({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sortType: 'desc',
        sortBy: 'createdAt',
        status: selectedFilter === 'Tất cả' ? undefined : (selectedFilter as BookingStatus),
      });
      setBookings(res.data);
      setTotalItems(res.paging?.total || 0);
    } catch (err) {
      console.error('Lỗi khi tải bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage, selectedFilter]);

  // =========================================================
  // 🔹 Lọc theo searchTerm (client-side)
  // =========================================================
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.seer.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [bookings, searchTerm]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  const goToNextPage = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));
  const goToPrevPage = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));

  // =========================================================
  // 🔹 Xóa booking
  // =========================================================
  const handleDelete = async (booking: BookingResponse) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa lịch hẹn của ${booking.customer.fullName} với ${booking.seer.fullName}?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(booking.id);
      const message = await BookingService.deleteBooking(booking.id);
      console.log('Xóa thành công:', message);

      // Refresh danh sách sau khi xóa
      await fetchBookings();

      // Hiển thị thông báo thành công
      alert('Xóa lịch hẹn thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa booking:', error);
      alert('Có lỗi xảy ra khi xóa lịch hẹn. Vui lòng thử lại!');
    } finally {
      setDeletingId(null);
    }
  };

  const handleConfirm = (id: string) => {
    console.log('Xác nhận booking:', id);
    setSelectedBooking(null);
    // TODO: Call API confirm
  };

  const handleCancel = (id: string, reason?: string) => {
    console.log('Hủy booking:', id, 'Lý do:', reason);
    setSelectedBooking(null);
    // TODO: Call API cancel
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên Khách hàng hoặc Nhà tiên tri..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-400 dark:border-gray-600 rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-1">
        <div className="inline-flex border border-gray-400 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
          {[
            { label: 'Tất cả', value: 'Tất cả' },
            { label: 'Chờ xác nhận', value: 'PENDING' },
            { label: 'Đã xác nhận', value: 'CONFIRMED' },
            { label: 'Hoàn thành', value: 'COMPLETED' },
            { label: 'Bị hủy', value: 'CANCELED' },
            { label: 'Thất bại', value: 'FAILED' },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => {
                setSelectedFilter(status.value as StatusFilterType);
                setCurrentPage(1);
              }}
              className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors whitespace-nowrap
                ${
                  selectedFilter === status.value
                    ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-400 dark:border-gray-700 relative overflow-hidden">
        <table
          className="min-w-full divide-y divide-gray-400 dark:divide-gray-700 table-fixed"
          style={{ tableLayout: 'fixed', width: '100%' }}
        >
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="w-[180px] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Khách hàng
              </th>
              <th className="w-[180px] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Nhà tiên tri
              </th>
              <th className="w-[160px] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Thời gian
              </th>
              <th className="w-[100px] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Thời lượng
              </th>
              <th className="w-[140px] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Trạng thái
              </th>
              <th className="w-[140px] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Thanh toán
              </th>
              <th className="w-[120px] px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-400 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <div className="flex justify-center items-center">
                    <Loader2 className="animate-spin w-5 h-5 mr-2" /> Đang tải dữ liệu...
                  </div>
                </td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500 dark:text-gray-400">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              filteredBookings.map((b, index) => (
                <motion.tr
                  key={b.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                >
                  {/* Khách hàng với avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <img
                        src={b.customer.avatarUrl || '/default_avatar.jpg'}
                        alt={b.customer.fullName}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <span
                        className="text-sm font-medium text-gray-900 dark:text-white truncate"
                        title={b.customer.fullName}
                      >
                        {b.customer.fullName || 'Không có dữ liệu'}
                      </span>
                    </div>
                  </td>

                  {/* Nhà tiên tri với avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <img
                        src={b.seer.avatarUrl || '/default_avatar.jpg'}
                        alt={b.seer.fullName}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <span
                        className="text-sm text-gray-500 dark:text-gray-400 truncate"
                        title={b.seer.fullName}
                      >
                        {b.seer.fullName || 'Không có dữ liệu'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {b.scheduledTime ? (
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(b.scheduledTime).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(b.scheduledTime).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ) : (
                      'Không có dữ liệu'
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                    {b.servicePackage.durationMinutes
                      ? `${b.servicePackage.durationMinutes} phút`
                      : 'Không có dữ liệu'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge type="status" value={b.status} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      type="payment"
                      value={b.bookingPaymentInfos[0]?.paymentStatus || 'PENDING'}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        title="Xem chi tiết"
                        onClick={() => setSelectedBooking(b)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        title="Xóa booking"
                        onClick={() => handleDelete(b)}
                        disabled={deletingId === b.id}
                        className="text-red-500 hover:text-red-700 p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === b.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-400 dark:border-gray-700 mt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Trang {currentPage}/{totalPages} • {totalItems} lịch hẹn
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1 || isLoading}
            className={`p-2 rounded-md transition ${
              currentPage <= 1 || isLoading
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages || isLoading}
            className={`p-2 rounded-md transition ${
              currentPage >= totalPages || isLoading
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};
