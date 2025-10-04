'use client'
import React, { useState } from 'react';
import { X, Calendar, User, Download, FileText, Check, Star } from 'lucide-react'; 
import { Badge } from '../common/Badge'; 


interface DetailItemProps { 
  label: string; 
  value: string | number; 
  Icon?: React.FC<any>; 
  iconColor?: string; 
}
const DetailItem: React.FC<DetailItemProps> = ({ label, value, Icon, iconColor = 'text-gray-500' }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</span>
    <div className="flex items-center">
      {Icon && <Icon className={`w-5 h-5 inline mr-2 ${iconColor}`} />}
      <span className="font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  </div>
);


export interface CertificateDetail {
  id: number;
  title: string;
  seerName: string;
  submissionDate: string;
  status: 'Đã duyệt' | 'Chờ duyệt' | 'Đã từ chối' | string;
  category: string;
  issueDate: string;
  expiryDate: string;
  organization: string;
  description: string;
  fileName: string;
  approvalTime?: string;
  reviewerNote?: string;
}

interface CertificateDetailModalProps {
  certificate: CertificateDetail | null;
  onClose: () => void;
  onApprove: (id: number, note: string) => void;
  onReject: (id: number, note: string) => void;
}


export const CertificateDetailModal: React.FC<CertificateDetailModalProps> = ({ certificate, onClose, onApprove, onReject }) => {
  const [note, setNote] = useState('');
  const useScrollLock = (locked: boolean) => {};
  useScrollLock(!!certificate);

  if (!certificate) return null;

  const isPending = certificate.status === 'Chờ duyệt';
  const isDenied = certificate.status === 'Đã từ chối';
  const isReviewed = !isPending;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleApprove = () => onApprove(certificate.id, note);
  const handleReject = () => onReject(certificate.id, note);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-end" onClick={handleBackdropClick}>
      <div className="w-full max-w-md h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex-grow overflow-y-auto p-6 pb-20 space-y-5">
            <div className="pb-4 border-b border-dashed dark:border-gray-700">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                        <img
                            className="h-10 w-10 rounded-full"
                            src="https://images.wallpapersden.com/image/download/satoru-gojo-acid-blue-eyes-jujutsu-kaisen_bmZpbWqUmZqaraWkpJRnZm1prWZmbW0.jpg"
                            alt="Avatar"
                        />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug">
                            {certificate.title}
                            </h2>
                            <div className="flex space-x-2 mt-1">
                            <Badge type="status" value={certificate.status} />
                            <Badge type="expertise" value={certificate.category} />
                            </div>
                        </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 flex-shrink-0"
                    >
                    <X className="w-6 h-6" />
                </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 pt-3">
                Nộp bởi thầy {certificate.seerName} • {certificate.submissionDate}
            </p>
        </div>

          {/* Thông tin chung */}
          <div className="grid grid-cols-2 gap-4">
            <DetailItem Icon={User} label="Họ tên" value={certificate.seerName} />
            <DetailItem Icon={Star} label="Danh mục" value={certificate.category} />
            <DetailItem Icon={Calendar} label="Ngày cấp" value={certificate.issueDate} />
            <DetailItem Icon={Calendar} label="Ngày hết hạn" value={certificate.expiryDate} />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Tổ chức cấp</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{certificate.organization}</p>
          </div>

          {/* Mô tả */}
          <div className="space-y-1 pt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mb-1"><FileText className="w-4 h-4 mr-1" /> Mô tả</p>
            <p className="text-sm italic text-gray-800 dark:text-gray-200">{certificate.description}</p>
          </div>

          {/* File */}
          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border dark:border-gray-600">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{certificate.fileName}</span>
            </div>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 flex items-center text-sm font-medium">
              <Download className="w-4 h-4 mr-1" /> Tải xuống
            </button>
          </div>

          {/* Approval info */}
          {isReviewed && (
            <div className="space-y-1 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">Thời điểm {isDenied ? 'từ chối' : 'phê duyệt'}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{certificate.approvalTime}</p>
            </div>
          )}
          
          {/* Note */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Ghi chú đánh giá (tùy chọn)</p>
            {isPending ? (
              <textarea
                className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 resize-none h-20"
                placeholder="Nhập ghi chú về quyết định đánh giá..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            ) : (
              <p className="text-sm italic text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg min-h-20 border border-gray-200 dark:border-gray-600">
                {certificate.reviewerNote || (isDenied ? 'Không có ghi chú từ chối.' : 'Không có ghi chú phê duyệt.')}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {isPending ? (
            <div className="flex space-x-3">
              <button onClick={handleApprove} className="flex-1 py-3 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700">
                <Check className="w-5 h-5" />
                <span>Phê duyệt</span>
              </button>
              <button onClick={handleReject} className="flex-1 py-3 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700">
                <X className="w-5 h-5" />
                <span>Từ chối</span>
              </button>
            </div>
          ) : (
            <button onClick={onClose} className="w-full py-3 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
              Đóng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
