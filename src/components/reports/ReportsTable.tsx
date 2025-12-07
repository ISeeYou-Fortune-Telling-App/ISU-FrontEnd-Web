'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, ChevronDown, Loader2, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { ReportsService } from '@/services/reports/reports.service';
import type {
  Report,
  ReportStatus,
  ReportTypeItem,
  GetReportsParams,
  ReportUser,
  TargetReportType,
} from '@/types/reports/reports.type';
import { Badge } from '@/components/common/Badge';
import { useDebounce } from '@/hooks/useDebounce';
import { useScrollToTopOnPageChange } from '@/hooks/useScrollToTopOnPageChange';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ReportDetailModal } from './ReportDetailModal';
import { ReportHistoryModal } from './ReportHistoryModal';

const ITEMS_PER_PAGE = 10;

const STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: 'Chờ xử lý',
  VIEWED: 'Đã xem',
  RESOLVED: 'Đã giải quyết',
  REJECTED: 'Từ chối',
};

const TARGET_TYPE_LABELS: Record<TargetReportType, string> = {
  SEER: 'Nhà tiên tri',
  CHAT: 'Tin nhắn',
  BOOKING: 'Lịch hẹn',
  SERVICE_PACKAGE: 'Gói dịch vụ',
  POST: 'Bài viết',
};

export function ReportsTable() {
  const [reports, setReports] = useState<Report[]>([]);
  const [reportTypes, setReportTypes] = useState<ReportTypeItem[]>([]);
  const [paging, setPaging] = useState({ page: 1, totalPages: 1, total: 0 });

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 1000);

  const [selectedStatus, setSelectedStatus] = useState<'Tất cả' | ReportStatus>('Tất cả');
  const [selectedType, setSelectedType] = useState<'Tất cả' | string>('Tất cả');
  const [selectedTargetType, setSelectedTargetType] = useState<'Tất cả' | TargetReportType>(
    'Tất cả',
  );

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isTargetTypeDropdownOpen, setIsTargetTypeDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [historyModal, setHistoryModal] = useState<{
    userId: string;
    username: string;
    type: 'reporter' | 'reported';
  } | null>(null);

  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const targetTypeDropdownRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);

  // Scroll to top when page changes
  useScrollToTopOnPageChange(paging.page, tableRef);

  // Close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
      if (
        targetTypeDropdownRef.current &&
        !targetTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTargetTypeDropdownOpen(false);
      }
    };
    if (isTypeDropdownOpen || isTargetTypeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTypeDropdownOpen, isTargetTypeDropdownOpen]);

  // Fetch report types
  useEffect(() => {
    const fetchReportTypes = async () => {
      try {
        const response = await ReportsService.getReportTypes({ limit: 100 });
        setReportTypes(response.data);
      } catch (error) {
        console.error('Failed to fetch report types:', error);
      }
    };
    fetchReportTypes();
  }, []);

  // Fetch reports
  const fetchReports = async (page = 1, showSkeleton = false) => {
    try {
      if (showSkeleton) setLoading(true);
      else setIsRefreshing(true);

      const params: GetReportsParams = {
        page,
        limit: ITEMS_PER_PAGE,
        sortType: 'desc',
        sortBy: 'createdAt',
        name: debouncedSearch.trim() || undefined,
        status: selectedStatus !== 'Tất cả' ? selectedStatus : undefined,
        reportType: selectedType !== 'Tất cả' ? selectedType : undefined,
        targetType: selectedTargetType !== 'Tất cả' ? selectedTargetType : undefined,
      };

      const response = await ReportsService.getReports(params);

      setReports(response.data);
      setPaging({
        page: (response.paging?.page ?? 0) + 1,
        totalPages: response.paging?.totalPages ?? 1,
        total: response.paging?.total ?? response.data.length ?? 0,
      });
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports(1, true);
  }, []);

  useEffect(() => {
    if (!loading) fetchReports(paging.page, false);
  }, [selectedStatus, selectedType, selectedTargetType, debouncedSearch, paging.page]);

  const goToNextPage = () => {
    if (paging.page < paging.totalPages && !isRefreshing) {
      setPaging((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const goToPrevPage = () => {
    if (paging.page > 1 && !isRefreshing) {
      setPaging((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const getReportTypeLabel = (name: string) => {
    const type = reportTypes.find((t) => t.name === name);
    return type ? type.description : name;
  };

  const handleViewDetail = (report: Report) => {
    // Chỉ mở modal nếu chưa xử lý xong
    if (report.reportStatus === 'RESOLVED' || report.reportStatus === 'REJECTED') {
      return;
    }
    setSelectedReport(report);
  };

  const handleUserClick = (
    user: ReportUser,
    type: 'reporter' | 'reported',
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setHistoryModal({
      userId: user.id,
      username: user.username,
      type,
    });
  };

  const handleDelete = async (report: Report, e: React.MouseEvent) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      html: `Bạn có chắc chắn muốn xóa báo cáo này?<br/><br/>
             <small class="text-gray-600 dark:text-gray-400">Người báo cáo: <strong>${report.reporter.username}</strong><br/>
             Người bị báo cáo: <strong>${report.reported.username}</strong></small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
    });

    if (result.isConfirmed) {
      try {
        setDeletingId(report.id);
        await ReportsService.deleteReport(report.id);
        await Swal.fire({
          title: 'Đã xóa!',
          text: 'Báo cáo đã được xóa thành công.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
        // Reload data
        await fetchReports(paging.page, false);
      } catch (error: any) {
        console.error('❌ Lỗi khi xóa báo cáo:', error);
        Swal.fire({
          title: 'Lỗi!',
          text: error?.response?.data?.message || 'Không thể xóa báo cáo',
          icon: 'error',
          background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      ref={tableRef}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700"
    >
      {/* Search Bar and Dropdowns */}
      <div className="flex gap-4 items-center mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên người dùng..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPaging((prev) => ({ ...prev, page: 1 }));
            }}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-400 dark:border-gray-600 
                       rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                       placeholder-gray-400 dark:placeholder-gray-500 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>

        {/* Report Type Dropdown */}
        <div className="relative flex-shrink-0" ref={typeDropdownRef}>
          <button
            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 
                       dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-400 dark:border-gray-600 min-w-[180px]"
          >
            <span className="truncate mr-2">
              {selectedType === 'Tất cả' ? 'Tất cả loại vi phạm' : getReportTypeLabel(selectedType)}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform flex-shrink-0 ${
                isTypeDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isTypeDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 
                         ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-20 animate-fadeIn max-h-80 overflow-y-auto"
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    setSelectedType('Tất cả');
                    setIsTypeDropdownOpen(false);
                    setPaging((prev) => ({ ...prev, page: 1 }));
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                    selectedType === 'Tất cả'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-600 font-semibold'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  Tất cả loại vi phạm
                </button>
                {reportTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type.name);
                      setIsTypeDropdownOpen(false);
                      setPaging((prev) => ({ ...prev, page: 1 }));
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      selectedType === type.name
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-600 font-semibold'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {type.description}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Target Type Dropdown */}
        <div className="relative flex-shrink-0" ref={targetTypeDropdownRef}>
          <button
            onClick={() => setIsTargetTypeDropdownOpen(!isTargetTypeDropdownOpen)}
            className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 
                       dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-400 dark:border-gray-600 min-w-[180px]"
          >
            <span className="truncate mr-2">
              {selectedTargetType === 'Tất cả'
                ? 'Tất cả đối tượng'
                : TARGET_TYPE_LABELS[selectedTargetType]}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform flex-shrink-0 ${
                isTargetTypeDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isTargetTypeDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 
                         ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-20 animate-fadeIn max-h-80 overflow-y-auto"
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    setSelectedTargetType('Tất cả');
                    setIsTargetTypeDropdownOpen(false);
                    setPaging((prev) => ({ ...prev, page: 1 }));
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                    selectedTargetType === 'Tất cả'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-600 font-semibold'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  Tất cả đối tượng
                </button>
                {Object.entries(TARGET_TYPE_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTargetType(key as TargetReportType);
                      setIsTargetTypeDropdownOpen(false);
                      setPaging((prev) => ({ ...prev, page: 1 }));
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      selectedTargetType === key
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

      {/* Filter Status Tabs */}
      <div className="flex space-x-2 mb-4">
        <div className="flex border border-gray-400 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
          {[['Tất cả', 'Tất cả'], ...Object.entries(STATUS_LABELS)].map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedStatus(key as any);
                setPaging((prev) => ({ ...prev, page: 1 }));
              }}
              className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors ${
                selectedStatus === key
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-400 dark:border-gray-700 relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 flex items-center justify-center backdrop-blur-sm pointer-events-none z-10">
            <div
              className="h-6 w-6 rounded-full border-b-2 border-indigo-600 animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
          </div>
        )}

        <table
          className="min-w-full divide-y divide-gray-400 dark:divide-gray-700 table-fixed"
          style={{ tableLayout: 'fixed', width: '100%' }}
        >
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="w-[12%] text-start px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Người báo cáo
              </th>
              <th className="w-[12%] text-start px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Người bị báo cáo
              </th>
              <th className="w-[11%] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Loại vi phạm
              </th>
              <th className="w-[10%] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Đối tượng
              </th>
              <th className="w-[10%] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Trạng thái
              </th>
              <th className="w-[8%] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Thời gian
              </th>
              <th className="w-[6%] px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-400 dark:divide-gray-700 relative">
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-10 text-gray-500 dark:text-gray-400 italic"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-start">
                      <img
                        src={report.reporter.avatarUrl || '/default_avatar.jpg'}
                        alt={report.reporter.username}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <button
                        onClick={(e) => handleUserClick(report.reporter, 'reporter', e)}
                        className="text-sm text-gray-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                      >
                        {report.reporter.username}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-start">
                      <img
                        src={report.reported.avatarUrl || '/default_avatar.jpg'}
                        alt={report.reported.username}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <button
                        onClick={(e) => handleUserClick(report.reported, 'reported', e)}
                        className="text-sm text-gray-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                      >
                        {report.reported.username}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {getReportTypeLabel(report.reportType)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {report.targetReportType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <Badge type="AccountStatus" value={STATUS_LABELS[report.reportStatus]} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(report.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      {report.reportStatus !== 'RESOLVED' && report.reportStatus !== 'REJECTED' && (
                        <button
                          onClick={() => handleViewDetail(report)}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(report, e)}
                        disabled={deletingId === report.id}
                        className="text-red-500 hover:text-red-700 p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Xóa báo cáo"
                      >
                        {deletingId === report.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-400 dark:border-gray-700 mt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Trang {paging.page}/{paging.totalPages} • {paging.total} báo cáo
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={paging.page <= 1 || isRefreshing}
            className={`p-2 rounded-md transition ${
              paging.page <= 1 || isRefreshing
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={goToNextPage}
            disabled={paging.page >= paging.totalPages || isRefreshing}
            className={`p-2 rounded-md transition ${
              paging.page >= paging.totalPages || isRefreshing
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onActionComplete={async () => {
            setSelectedReport(null);
            await fetchReports(paging.page, false);
          }}
        />
      )}

      {/* History Modal */}
      {historyModal && (
        <ReportHistoryModal
          userId={historyModal.userId}
          username={historyModal.username}
          type={historyModal.type}
          onClose={() => setHistoryModal(null)}
        />
      )}
    </div>
  );
}
