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
} from 'lucide-react';

import { Badge } from '../common/Badge';
import { CertificateDetailModal } from './CertificateDetailModal';
import { CertificateService } from '@/services/certificates/certificates.service';
import { Certificate } from '@/types/certificates/certificates.type';

type StatusFilterType = 'Tất cả' | 'Chờ duyệt' | 'Đã duyệt' | 'Đã từ chối';
const ITEMS_PER_PAGE = 10;

export const CertificateTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<StatusFilterType>('Tất cả');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await CertificateService.getCertificates();
      setCertificates(response.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách chứng chỉ:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchesSearch =
        cert.certificateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.seerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedFilter === 'Tất cả' ||
        (selectedFilter === 'Chờ duyệt' && cert.status === 'PENDING') ||
        (selectedFilter === 'Đã duyệt' && cert.status === 'APPROVED') ||
        (selectedFilter === 'Đã từ chối' && cert.status === 'REJECTED');

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedFilter, certificates]);

  const totalItems = filteredCertificates.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const { startIndex, endIndex, currentCertificates } = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentCertificates = filteredCertificates.slice(startIndex, endIndex);
    return { startIndex, endIndex, currentCertificates };
  }, [filteredCertificates, currentPage]);

  const goToNextPage = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));
  const goToPrevPage = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));

  const handleDelete = async (cert: Certificate) => {
    if (!confirm(`Bạn có chắc muốn xóa chứng chỉ "${cert.certificateName}"?`)) return;
    try {
      await CertificateService.deleteCertificate(cert.id);
      alert('Xóa chứng chỉ thành công!');
      await fetchCertificates();
    } catch (err) {
      console.error('Lỗi khi xóa chứng chỉ:', err);
      alert('Không thể xóa chứng chỉ. Vui lòng thử lại.');
    }
  };

  const handleApprove = async (id: string, note: string) => {
    try {
      await CertificateService.approveCertificate(id, {
        action: 'APPROVED',
        decision_reason: note || undefined,
      });
      alert('Đã phê duyệt chứng chỉ thành công!');
      setSelectedCertificate(null);
      await fetchCertificates();
    } catch (err) {
      console.error('Lỗi khi phê duyệt chứng chỉ:', err);
      alert('Không thể phê duyệt chứng chỉ. Vui lòng thử lại.');
    }
  };

  const handleReject = async (id: string, note: string) => {
    if (!note.trim()) {
      alert('Vui lòng nhập lý do từ chối!');
      return;
    }
    try {
      await CertificateService.approveCertificate(id, {
        action: 'REJECTED',
        decision_reason: note,
      });
      alert('Đã từ chối chứng chỉ.');
      setSelectedCertificate(null);
      await fetchCertificates();
    } catch (err) {
      console.error('Lỗi khi từ chối chứng chỉ:', err);
      alert('Không thể từ chối chứng chỉ. Vui lòng thử lại.');
    }
  };

  const handleDownload = (cert: Certificate) => {
    if (cert.certificateUrl) window.open(cert.certificateUrl, '_blank');
    else alert('Không có file để tải xuống.');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      {/* Search + Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-grow mr-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên Nhà tiên tri hoặc Tên Chứng chỉ..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
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
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
          >
            <span>Trạng thái Mẫu</span>
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                {['Tùy chọn Mẫu 1', 'Tùy chọn Mẫu 2'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setIsDropdownOpen(false)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-1">
        <div className="inline-flex border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
          {['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Đã từ chối'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedFilter(status as StatusFilterType);
                setCurrentPage(1);
              }}
              className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedFilter === status
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 font-semibold'
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
              {['Chứng chỉ', 'Nhà tiên tri', 'Danh mục', 'Ngày cấp', 'Trạng thái', 'Thao tác'].map(
                (header, i) => (
                  <th
                    key={i}
                    className={`${
                      i === 5 ? 'text-right' : 'text-left'
                    } px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase`}
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : currentCertificates.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            ) : (
              currentCertificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Download className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {cert.certificateName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {cert.issuedBy}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {cert.seerName}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <Badge type="expertise" value={cert.categories?.[0] || 'Khác'} />
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(cert.issuedAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-3">
                    <Badge
                      type="status"
                      value={
                        cert.status === 'PENDING'
                          ? 'Chờ duyệt'
                          : cert.status === 'APPROVED'
                          ? 'Đã duyệt'
                          : 'Đã từ chối'
                      }
                    />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {startIndex + 1}-{Math.min(endIndex, totalItems)} / {totalItems}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {currentPage}/{totalPages}
          </span>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`p-1 border rounded-lg ${
              currentPage === 1
                ? 'text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`p-1 border rounded-lg ${
              currentPage === totalPages
                ? 'text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedCertificate && (
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
            approvalTime: selectedCertificate.decisionDate
              ? new Date(selectedCertificate.decisionDate).toLocaleString('vi-VN')
              : undefined,
            reviewerNote: selectedCertificate.decisionReason || undefined,
          }}
          onClose={() => setSelectedCertificate(null)}
          onApprove={(id, note) => handleApprove(selectedCertificate.id, note)}
          onReject={(id, note) => handleReject(selectedCertificate.id, note)}
        />
      )}
    </div>
  );
};
