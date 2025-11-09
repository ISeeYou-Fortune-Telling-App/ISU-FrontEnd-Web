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

  // 🧭 Gọi API thật
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const response = await CertificateService.getCertificates();
        setCertificates(response);
      } catch (err) {
        console.error('Lỗi khi tải danh sách chứng chỉ:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  // 🔍 Lọc theo search + trạng thái
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

  // 📄 Phân trang
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

  const handleAction = (action: string, cert: Certificate) => {
    console.log(`${action} chứng chỉ:`, cert.id, cert.certificateName);
    if (action === 'Duyệt' || action === 'Từ chối') setSelectedCertificate(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      {/* Hàng 1: Search + Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-grow mr-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên Nhà tiên tri hoặc Tên Chứng chỉ..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
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
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg 
                       hover:bg-gray-50 border border-gray-300"
          >
            <span>Trạng thái Mẫu</span>
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                {['Tùy chọn Mẫu 1', 'Tùy chọn Mẫu 2'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setIsDropdownOpen(false)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hàng 2: Filter Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-1">
        <div className="inline-flex border border-gray-300 rounded-lg p-0.5 bg-gray-100">
          {['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Đã từ chối'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedFilter(status as StatusFilterType);
                setCurrentPage(1);
              }}
              className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedFilter === status
                  ? 'bg-white shadow-sm text-blue-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Chứng chỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Nhà tiên tri
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Ngày cấp
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : currentCertificates.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            ) : (
              currentCertificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Download className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {cert.certificateName}
                        </div>
                        <div className="text-xs text-gray-500">{cert.issuedBy}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">{cert.seerName}</td>
                  <td className="px-6 py-3 text-sm">
                    <Badge type="expertise" value={cert.categories?.[0] || 'Khác'} />
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
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
                        className="text-gray-500 hover:text-gray-700 p-1 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        title="Tải xuống"
                        onClick={() => handleAction('Tải xuống', cert)}
                        className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      {cert.status === 'PENDING' && (
                        <>
                          <button
                            title="Duyệt"
                            onClick={() => handleAction('Duyệt', cert)}
                            className="text-green-500 hover:text-green-700 p-1 transition-colors"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            title="Từ chối"
                            onClick={() => handleAction('Từ chối', cert)}
                            className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
        <span className="text-sm text-gray-700">
          {startIndex + 1}-{Math.min(endIndex, totalItems)} / {totalItems}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            {currentPage}/{totalPages}
          </span>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`p-1 border border-gray-300 rounded-lg ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`p-1 border border-gray-300 rounded-lg ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {/* <CertificateDetailModal
        certificate={
          selectedCertificate
            ? {
                ...selectedCertificate,
                title: selectedCertificate.certificateName,
                issueDate: new Date(selectedCertificate.issuedAt).toLocaleDateString('vi-VN'),
                expiryDate: selectedCertificate.expirationDate
                  ? new Date(selectedCertificate.expirationDate).toLocaleDateString('vi-VN')
                  : null,
                organization: selectedCertificate.issuedBy,
                description: selectedCertificate.certificateDescription,
                reviewerNote:
                  selectedCertificate.status === 'APPROVED'
                    ? selectedCertificate.decisionReason
                    : selectedCertificate.status === 'REJECTED'
                    ? selectedCertificate.decisionReason
                    : undefined,
                approvalTime: selectedCertificate.decisionDate
                  ? new Date(selectedCertificate.decisionDate).toLocaleString('vi-VN')
                  : undefined,
              }
            : null
        }
        onClose={() => setSelectedCertificate(null)}
        onApprove={(id, note) => handleAction('Duyệt', selectedCertificate as Certificate)}
        onReject={(id, note) => handleAction('Từ chối', selectedCertificate as Certificate)}
      /> */}
    </div>
  );
};
