'use client';

import React, { useState, useEffect } from 'react';
import { X, File, Image as ImageIcon, Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { CertificateService } from '@/services/certificates/certificates.service';
import { Certificate } from '@/types/certificates/certificates.type';

interface SeerCertificatesModalProps {
  seerId: string;
  seerName: string;
  onClose: () => void;
  onViewCertificate: (certificate: Certificate) => void;
}

export const SeerCertificatesModal: React.FC<SeerCertificatesModalProps> = ({
  seerId,
  seerName,
  onClose,
  onViewCertificate,
}) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeerCertificates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await CertificateService.getCertificatesByUserId(seerId);
        setCertificates(response.data || []);
      } catch (err) {
        console.error('Lỗi khi tải chứng chỉ của nhà tiên tri:', err);
        setError('Không thể tải danh sách chứng chỉ. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchSeerCertificates();
  }, [seerId]);

  const handleDownload = (cert: Certificate) => {
    if (cert.certificateUrl) {
      window.open(cert.certificateUrl, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'PENDING':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'REJECTED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Đã duyệt';
      case 'PENDING':
        return 'Chờ duyệt';
      case 'REJECTED':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-400 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-400 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Chứng chỉ của {seerName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tổng số: {certificates.length} chứng chỉ
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && certificates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Nhà tiên tri này chưa có chứng chỉ nào.
              </p>
            </div>
          )}

          {!loading && !error && certificates.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-400 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-400 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r border-gray-400 dark:border-gray-700">
                      Tên chứng chỉ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r border-gray-400 dark:border-gray-700">
                      Danh mục
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r border-gray-400 dark:border-gray-700">
                      Ngày nộp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r border-gray-400 dark:border-gray-700">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-400 dark:divide-gray-700">
                  {certificates.map((cert) => (
                    <tr
                      key={cert.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3 border-r border-gray-400 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          {cert.certificateUrl?.endsWith('.pdf') ? (
                            <File className="w-4 h-4 text-red-500 flex-shrink-0" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          )}
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {cert.certificateName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-400 dark:border-gray-700">
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {cert.categories?.[0] || 'Khác'}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-400 dark:border-gray-700">
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {new Date(cert.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-400 dark:border-gray-700">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            cert.status,
                          )}`}
                        >
                          {getStatusText(cert.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onViewCertificate(cert)}
                            className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleDownload(cert)}
                            className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors group"
                            title="Tải xuống"
                          >
                            <Download className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-400 dark:border-gray-700 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
};
