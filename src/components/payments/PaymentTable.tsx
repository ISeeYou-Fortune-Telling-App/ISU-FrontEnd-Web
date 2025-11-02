'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { PaymentDetailModal } from './PaymentDetailModal';
import { BookingPaymentService } from '@/services/payments/payments.service';
import type { BookingPayment, PaymentStatus, PaymentMethod } from '@/types/payments/payments.type';

const ITEMS_PER_PAGE = 10;

export const PaymentTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | 'ALL'>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<BookingPayment[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<BookingPayment | null>(null);

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
        });
        setPayments(res.data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách thanh toán:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [currentPage, selectedMethod, selectedStatus]);

  // ================== Filter by search ==================
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.seer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [payments, searchTerm]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const goToNextPage = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));
  const goToPrevPage = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, nhà tiên tri, hoặc mã giao dịch..."
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

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="inline-flex border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
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
                  Mã giao dịch
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Khách hàng
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Nhà tiên tri
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Dịch vụ
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Phương thức
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Số tiền
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
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
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {p.transactionId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {p.customer.fullName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {p.seer.fullName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {p.packageTitle}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {p.paymentMethod}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {p.amount.toLocaleString('vi-VN')}₫
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge type="status" value={p.paymentStatus} />
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

      {/* Modal */}
      {selectedPayment && (
        <PaymentDetailModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
      )}
    </div>
  );
};
