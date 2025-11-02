'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, X, ChevronLeft, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';

import { Badge } from '../common/Badge';
import { BookingDetailModal } from './BookingDetailModal';
import { BookingService } from '@/services/booking/booking.service';
import type { BookingResponse, BookingStatus } from '@/types/booking/booking.type';

const ITEMS_PER_PAGE = 10;
type StatusFilterType = 'Tất cả' | 'PENDING' | 'CONFIRMED' | 'FAILED' | 'COMPLETED' | 'CANCELLED';

export const BookingTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<StatusFilterType>('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  // =========================================================
  // 🔹 Fetch API từ backend
  // =========================================================
  useEffect(() => {
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
      } catch (err) {
        console.error('Lỗi khi tải bookings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [currentPage, selectedFilter]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // =========================================================
  // 🔹 Lọc theo searchTerm
  // =========================================================
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.seer.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [bookings, searchTerm]);

  const goToNextPage = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));
  const goToPrevPage = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));

  const handleAction = (action: string, b: BookingResponse) => {
    console.log(`${action} booking ID: ${b.id}, khách: ${b.customer.fullName}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      {/* Search + Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-grow mr-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo khách hàng hoặc nhà tiên tri..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 
                       dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
          >
            <span>Trạng thái</span>
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-700 
                          ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-10"
            >
              <div className="py-1">
                {['Tất cả', 'PENDING', 'CONFIRMED', 'FAILED', 'COMPLETED', 'CANCELLED'].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedFilter(status as StatusFilterType);
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm 
                                 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {status}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <div className="flex justify-center items-center py-10 text-gray-500 dark:text-gray-400">
            <Loader2 className="animate-spin w-5 h-5 mr-2" /> Đang tải dữ liệu...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Khách hàng
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Nhà tiên tri
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Gói dịch vụ
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Giá
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Thanh toán
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {b.customer.fullName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {b.seer.fullName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {b.servicePackage.packageTitle}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {b.servicePackage.price.toLocaleString('vi-VN')}₫
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge type="status" value={b.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
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
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        title="Hủy booking"
                        onClick={() => handleAction('Hủy', b)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Trang {currentPage}/{totalPages}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
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
          onCancel={() => handleAction('Từ chối', selectedBooking)}
          onConfirm={() => handleAction('Xác nhận', selectedBooking)}
        />
      )}
    </div>
  );
};
