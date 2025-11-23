'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Eye,
  Download,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Trash2,
  Image,
  File,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

import { Badge } from '../common/Badge';
import { CertificateDetailModal } from './CertificateDetailModal';
import { SeerCertificatesModal } from './SeerCertificatesModal';
import { CertificateService } from '@/services/certificates/certificates.service';
import { Certificate } from '@/types/certificates/certificates.type';
import { KnowledgeService } from '@/services/knowledge/knowledge.service';
import { KnowledgeCategory } from '@/types/knowledge/knowledge.type';

type StatusFilterType = 'Tất cả' | 'Chờ duyệt' | 'Đã duyệt' | 'Đã từ chối';
const ITEMS_PER_PAGE = 10;

const STATUS_MAP: Record<StatusFilterType, string | undefined> = {
  'Tất cả': undefined,
  'Chờ duyệt': 'PENDING',
  'Đã duyệt': 'APPROVED',
  'Đã từ chối': 'REJECTED',
};

export const CertificateTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<StatusFilterType>('Tất cả');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [paging, setPaging] = useState({ page: 1, totalPages: 1, total: 0 });
  const [seerCertificatesModal, setSeerCertificatesModal] = useState<{
    isOpen: boolean;
    seerId: string;
    seerName: string;
  } | null>(null);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        status: STATUS_MAP[selectedFilter] as any,
        seerName: searchTerm || undefined,
      };

      let response;
      if (selectedCategory) {
        response = await CertificateService.getCertificatesByCategoryId(selectedCategory, params);
      } else {
        response = await CertificateService.getCertificates(params);
      }

      setCertificates(response.data);
      setPaging({
        page: (response.paging?.page ?? 0) + 1,
        totalPages: response.paging?.totalPages ?? 1,
        total: response.paging?.total ?? response.data.length,
      });
    } catch (err) {
      console.error('Lỗi khi tải danh sách chứng chỉ:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await KnowledgeService.getCategories({ page: 1, limit: 100 });
      setCategories(response.data);
    } catch (err) {
      console.error('Lỗi khi tải danh mục:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [selectedCategory, currentPage, selectedFilter, searchTerm]);

  const goToNextPage = () => {
    if (currentPage < paging.totalPages && !loading) {
      setCurrentPage((p) => p + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1 && !loading) {
      setCurrentPage((p) => p - 1);
    }
  };

  const handleDelete = async (cert: Certificate) => {
    const result = await Swal.fire({
      title: 'Xóa chứng chỉ?',
      text: `Bạn có chắc muốn xóa chứng chỉ "${cert.certificateName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (!result.isConfirmed) return;

    try {
      await CertificateService.deleteCertificate(cert.id);
      await Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Xóa chứng chỉ thành công!',
        confirmButtonColor: '#3b82f6',
      });
      await fetchCertificates();
    } catch (err) {
      console.error('Lỗi khi xóa chứng chỉ:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể xóa chứng chỉ. Vui lòng thử lại.',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  const handleApprove = async (id: string, note: string) => {
    try {
      await CertificateService.approveCertificate(id, {
        action: 'APPROVED',
        decision_reason: note || undefined,
      });
      await Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã phê duyệt chứng chỉ thành công!',
        confirmButtonColor: '#3b82f6',
      });
      setSelectedCertificate(null);
      await fetchCertificates();
    } catch (err) {
      console.error('Lỗi khi phê duyệt chứng chỉ:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể phê duyệt chứng chỉ. Vui lòng thử lại.',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  const handleReject = async (id: string, note: string) => {
    if (!note.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin!',
        text: 'Vui lòng nhập lý do từ chối!',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }
    try {
      await CertificateService.approveCertificate(id, {
        action: 'REJECTED',
        decision_reason: note,
      });
      await Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã từ chối chứng chỉ.',
        confirmButtonColor: '#3b82f6',
      });
      setSelectedCertificate(null);
      await fetchCertificates();
    } catch (err) {
      console.error('Lỗi khi từ chối chứng chỉ:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể từ chối chứng chỉ. Vui lòng thử lại.',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  const handleDownload = (cert: Certificate) => {
    if (cert.certificateUrl) window.open(cert.certificateUrl, '_blank');
    else alert('Không có file để tải xuống.');
  };

  const handleViewAllCertificates = (seerId: string, seerName: string) => {
    setSeerCertificatesModal({ isOpen: true, seerId, seerName });
  };

  const handleViewCertificateFromList = (cert: Certificate) => {
    setSeerCertificatesModal(null);
    setSelectedCertificate(cert);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
      {/* Search + Category */}
      <div className="flex gap-4 items-center mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên Nhà tiên tri..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Category Filter */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700
                       dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-400 dark:border-gray-600 min-w-[160px]"
          >
            <span className="truncate">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name
                : 'Tất cả danh mục'}
            </span>
            <ChevronDown
              className={`w-4 h-4 ml-1 flex-shrink-0 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isDropdownOpen && (
            <div className="z-50 absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10 max-h-60 overflow-y-auto">
              <div className="py-1">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setIsDropdownOpen(false);
                    setCurrentPage(1);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    !selectedCategory
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold'
                      : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  Tất cả danh mục
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setIsDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4">
        <div className="flex border border-gray-400 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
          {(['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Đã từ chối'] as StatusFilterType[]).map(
            (status) => (
              <button
                key={status}
                onClick={() => {
                  setSelectedFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedFilter === status
                    ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-400 dark:border-gray-700 relative overflow-hidden">
        <table
          className="min-w-full divide-y divide-gray-400 dark:divide-gray-700 table-fixed"
          style={{ tableLayout: 'fixed', width: '100%' }}
        >
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="w-[250px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                Chứng chỉ
              </th>
              <th className="w-[140px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                Nhà tiên tri
              </th>
              <th className="w-[150px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                Danh mục
              </th>
              <th className="w-[90px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                Ngày cấp
              </th>
              <th className="w-[140px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                Trạng thái
              </th>
              <th className="w-[115px] px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-400 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : certificates.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            ) : (
              certificates.map((cert: Certificate, index: number) => (
                <motion.tr
                  key={cert.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-6 py-4 w-[280px]">
                    <div className="flex items-start space-x-3">
                      {/* Icon based on file type */}
                      <div className="w-10 h-10 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 flex-shrink-0 border border-gray-400 dark:border-gray-600">
                        {cert.certificateUrl?.toLowerCase().endsWith('.pdf') ? (
                          <File className="w-6 h-6 text-red-500" />
                        ) : (
                          <Image className="w-6 h-6 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                          title={cert.certificateName}
                        >
                          {cert.certificateName}
                        </div>
                        <div
                          className="text-xs text-gray-500 dark:text-gray-400 truncate"
                          title={cert.certificateDescription}
                        >
                          {cert.certificateDescription || 'Không có mô tả'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 w-[140px] text-sm text-gray-900 dark:text-gray-100 truncate text-center"
                    title={cert.seerName}
                  >
                    {cert.seerName}
                  </td>
                  <td className="px-6 py-4 w-[140px]">
                    <div className="flex justify-center">
                      <Badge type="expertise" value={cert.categories?.[0] || 'Khác'} />
                    </div>
                  </td>
                  <td className="px-6 py-4 w-[120px] text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex flex-col items-center">
                      <span className="font-medium">
                        {new Date(cert.issuedAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(cert.issuedAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 w-[140px]">
                    <div className="flex justify-center">
                      <Badge
                        type="AccountStatus"
                        value={
                          cert.status === 'PENDING'
                            ? 'Chờ duyệt'
                            : cert.status === 'APPROVED'
                            ? 'Đã duyệt'
                            : 'Đã từ chối'
                        }
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3 w-[150px] whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        title="Xem chi tiết chứng chỉ"
                        onClick={() => setSelectedCertificate(cert)}
                        className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white p-1"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        title="Tải xuống"
                        onClick={() => handleDownload(cert)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      {cert.status === 'PENDING' && (
                        <>
                          <button
                            title="Duyệt"
                            onClick={() => setSelectedCertificate(cert)}
                            className="text-green-500 hover:text-green-700 p-1"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            title="Từ chối"
                            onClick={() => setSelectedCertificate(cert)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button
                        title="Xóa chứng chỉ"
                        onClick={() => handleDelete(cert)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-5 h-5" />
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
          Trang {paging.page}/{paging.totalPages} • {paging.total} chứng chỉ
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1 || loading}
            className={`p-2 rounded-md transition ${
              currentPage === 1 || loading
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage >= paging.totalPages || loading}
            className={`p-2 rounded-md transition ${
              currentPage >= paging.totalPages || loading
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedCertificate &&
        (() => {
          console.log('Selected Certificate:', selectedCertificate);
          console.log('User ID:', selectedCertificate.userId);
          return (
            <CertificateDetailModal
              certificate={{
                id: parseInt(selectedCertificate.id) || 0,
                title: selectedCertificate.certificateName,
                seerName: selectedCertificate.seerName,
                submissionDate: new Date(selectedCertificate.createdAt).toLocaleDateString('vi-VN'),
                status:
                  selectedCertificate.status === 'PENDING'
                    ? 'Chờ duyệt'
                    : selectedCertificate.status === 'APPROVED'
                    ? 'Đã duyệt'
                    : 'Đã từ chối',
                category: selectedCertificate.categories?.[0] || 'Khác',
                issueDate: new Date(selectedCertificate.issuedAt).toLocaleDateString('vi-VN'),
                expiryDate: selectedCertificate.expirationDate
                  ? new Date(selectedCertificate.expirationDate).toLocaleDateString('vi-VN')
                  : 'Không có',
                organization: selectedCertificate.issuedBy,
                description: selectedCertificate.certificateDescription,
                fileName: selectedCertificate.certificateUrl.split('/').pop() || 'certificate.pdf',
<<<<<<< HEAD
                certificateUrl: selectedCertificate.certificateUrl,
=======
>>>>>>> 9d110770aad6c6a3e20f1364af993a89d89d2741
                approvalTime: selectedCertificate.decisionDate
                  ? new Date(selectedCertificate.decisionDate).toLocaleString('vi-VN')
                  : undefined,
                reviewerNote: selectedCertificate.decisionReason || undefined,
              }}
              seerId={selectedCertificate.userId}
              onClose={() => setSelectedCertificate(null)}
              onApprove={(id, note) => handleApprove(selectedCertificate.id, note)}
              onReject={(id, note) => handleReject(selectedCertificate.id, note)}
              onViewAllCertificates={handleViewAllCertificates}
            />
          );
        })()}

      {/* Seer Certificates Modal */}
      {seerCertificatesModal?.isOpen && (
        <SeerCertificatesModal
          seerId={seerCertificatesModal.seerId}
          seerName={seerCertificatesModal.seerName}
          onClose={() => setSeerCertificatesModal(null)}
          onViewCertificate={handleViewCertificateFromList}
        />
      )}
    </div>
  );
};
