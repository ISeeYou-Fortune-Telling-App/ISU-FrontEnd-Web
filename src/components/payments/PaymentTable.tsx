'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { PaymentDetailModal } from './PaymentDetailModal';
import { BookingPaymentService } from '@/services/payments/payments.service';
import type { BookingPayment, PaymentStatus, PaymentMethod } from '@/types/payments/payments.type';

const ITEMS_PER_PAGE = 10;

export const PaymentTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | 'ALL'>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | 'ALL'>('ALL');
  const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<BookingPayment[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<BookingPayment | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMethodDropdownOpen(false);
      }
    };
    if (isMethodDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMethodDropdownOpen]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset về trang 1 khi search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ================== Fetch API ==================
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const res = await BookingPaymentService.getPayments({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sortType: 'desc',
          sortBy: 'createdAt',
          paymentMethod: selectedMethod === 'ALL' ? undefined : selectedMethod,
          paymentStatus: selectedStatus === 'ALL' ? undefined : selectedStatus,
          searchName: debouncedSearch || undefined, // ✅ Gửi debounced search lên API
        });
        setPayments(res.data);
        if (res.paging && typeof res.paging.total === 'number') {
          setTotalItems(res.paging.total);
        } else {
          // Fallback nếu API không trả về paging
          setTotalItems(res.data.length);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách thanh toán:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [currentPage, selectedMethod, selectedStatus, debouncedSearch]); // ✅ Dùng debouncedSearch

  // ================== Không cần filter ở frontend nữa ==================
  const filteredPayments = payments; // ✅ API đã filter rồi

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const goToNextPage = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));
  const goToPrevPage = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
      {/* Search + Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-grow mr-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, nhà tiên tri, hoặc mã giao dịch..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setIsMethodDropdownOpen(!isMethodDropdownOpen)}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 
                       dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-400 dark:border-gray-600"
          >
            <span>{selectedMethod === 'ALL' ? 'Tất cả phương thức' : selectedMethod}</span>
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform ${
                isMethodDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isMethodDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 
                         ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-20 animate-fadeIn"
            >
              <div className="py-1">
                {[
                  ['ALL', 'Tất cả phương thức'],
                  ['MOMO', 'MOMO'],
                  ['VNPAY', 'VNPAY'],
                  ['PAYPAL', 'PAYPAL'],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedMethod(key as PaymentMethod | 'ALL');
                      setIsMethodDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      selectedMethod === key
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-600 font-semibold'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter theo trạng thái */}
      <div className="flex space-x-2 mb-4">
        <div className="flex border border-gray-400 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
          {['ALL', 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status as PaymentStatus | 'ALL');
                setCurrentPage(1);
              }}
              className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors ${
                selectedStatus === status
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {status === 'ALL'
                ? 'Tất cả'
                : status === 'COMPLETED'
                ? 'Thành công'
                : status === 'FAILED'
                ? 'Thất bại'
                : status === 'REFUNDED'
                ? 'Hoàn tiền'
                : 'Đang xử lý'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-400 dark:border-gray-700 relative overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-10 text-gray-500 dark:text-gray-400">
            <Loader2 className="animate-spin w-5 h-5 mr-2" /> Đang tải dữ liệu...
          </div>
        ) : (
          <table
            className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed"
            style={{ tableLayout: 'fixed', width: '100%' }}
          >
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="w-[15%] px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Mã giao dịch
                </th>
                <th className="w-[12%] px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Khách hàng
                </th>
                <th className="w-[12%] px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Nhà tiên tri
                </th>
                <th className="w-[15%] px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Dịch vụ
                </th>
                <th className="w-[12%] px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Phương thức
                </th>
                <th className="w-[12%] px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Số tiền
                </th>
                <th className="w-[12%] px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Trạng thái
                </th>
                <th className="w-[10%] px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                >
                  <td className="px-4 py-3">
                    <span
                      className="text-sm font-medium text-gray-900 dark:text-white truncate block"
                      title={p.transactionId || 'N/A'}
                    >
                      {p.transactionId || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-sm text-gray-600 dark:text-gray-300 truncate block"
                      title={p.customer?.fullName || 'N/A'}
                    >
                      {p.customer?.fullName || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-sm text-gray-600 dark:text-gray-300 truncate block"
                      title={p.seer?.fullName || 'N/A'}
                    >
                      {p.seer?.fullName || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-sm text-gray-600 dark:text-gray-300 truncate block"
                      title={p.packageTitle || 'N/A'}
                    >
                      {p.packageTitle || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-sm text-gray-600 dark:text-gray-300 truncate block"
                      title={p.paymentMethod || 'N/A'}
                    >
                      {p.paymentMethod || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {p.amount?.toLocaleString('vi-VN') || '0'}₫
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge type="payment" value={p.paymentStatus} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedPayment(p)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-400 dark:border-gray-700 mt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Trang {currentPage}/{totalPages} • {totalItems} thanh toán
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

      {/* Modal */}
      {selectedPayment && (
        <PaymentDetailModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
      )}
    </div>
  );
};
