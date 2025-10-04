'use client'
import React, { useState } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { PaymentDetailModal } from './PaymentDetailModal';
import type { PaymentStatus } from './PaymentDetailModal';

const mockPayments = Array.from({ length: 97 }).map((_, i) => ({
  id: `#12345${i}`,
  customer: 'Minh Tuệ',
  seer: 'Nguyễn Thị Mai',
  service: 'Tư vấn Tình duyên',
  method: i % 2 === 0 ? 'VNPAY' : 'PayPal',
  amount: '299.000 VND',
  status: (i % 3 === 0
    ? 'Thành công'
    : i % 3 === 1
    ? 'Thất bại'
    : 'Đã hoàn tiền') as PaymentStatus,   
  time: `16:30 10/0${(i % 9) + 1}/2020`,
}));

type PaymentType = typeof mockPayments[0];
type StatusFilterType = 'Tất cả' | 'Thành công' | 'Thất bại' | 'Đã hoàn tiền';

const ITEMS_PER_PAGE = 10;

export const PaymentTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<StatusFilterType>('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);

  // Filter
  const filteredPayments = mockPayments.filter(pay => {
    const matchesSearch =
      pay.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.seer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedFilter === 'Tất cả' || pay.status === selectedFilter;
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const goToNextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  const goToPrevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên Người tham gia, dịch vụ hoặc mã giao dịch..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4">
        <div className="inline-flex border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
          {['Tất cả', 'Thành công', 'Thất bại', 'Đã hoàn tiền'].map(status => (
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

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Mã giao dịch</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Khách hàng</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Nhà tiên tri</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Dịch vụ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Phương thức</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Số tiền</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Thời gian</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentPayments.map((pay) => (
              <tr key={pay.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{pay.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{pay.customer}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{pay.seer}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{pay.service}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{pay.method}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{pay.amount}</td>
                <td className="px-4 py-3 whitespace-nowrap"><Badge type="status" value={pay.status} /></td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{pay.time}</td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedPayment(pay)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
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

      {/* Modal */}
      <PaymentDetailModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
    </div>
  );
};
