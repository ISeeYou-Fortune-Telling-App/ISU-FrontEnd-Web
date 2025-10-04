'use client'
import React, { useState } from 'react';
import { Search, Eye, Download, Check, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

import { Badge } from '../common/Badge';   // ✅ Dùng Badge chung
import { CertificateDetailModal } from './CertificateDetailModal'; 

// --- Dữ liệu giả định và Types ---
const mockCertificates = [
    { id: 1, name: 'Chứng chỉ Tử Vi Nâng Cao', fileName: 'certificate_tuvi_advanced.pdf', seerName: 'Minh Tuệ', category: 'Cung Hoàng Đạo', submissionDate: '16:30 10/03/2020', status: 'Đã duyệt' },
    { id: 2, name: 'Chứng chỉ Tử Vi Nâng Cao', fileName: 'certificate_tuvi_advanced.pdf', seerName: 'Minh Tuệ', category: 'Ngũ Hành', submissionDate: '16:30 10/03/2020', status: 'Chờ duyệt' },
    { id: 3, name: 'Chứng chỉ Tử Vi Nâng Cao', fileName: 'certificate_tuvi_advanced.pdf', seerName: 'Minh Tuệ', category: 'Tarot', submissionDate: '16:30 10/03/2020', status: 'Đã từ chối' },
    { id: 4, name: 'Chứng chỉ Tử Vi Nâng Cao', fileName: 'certificate_tuvi_advanced.pdf', seerName: 'Minh Tuệ', category: 'Cung Hoàng Đạo', submissionDate: '16:30 10/03/2020', status: 'Đã duyệt' },
    { id: 5, name: 'Chứng chỉ Tử Vi Nâng Cao', fileName: 'certificate_tuvi_advanced.pdf', seerName: 'Minh Tuệ', category: 'Nhân Tướng Học', submissionDate: '16:30 10/03/2020', status: 'Đã duyệt' },
    { id: 6, name: 'Chứng chỉ Tử Vi Nâng Cao', fileName: 'certificate_tuvi_advanced.pdf', seerName: 'Minh Tuệ', category: 'Chỉ Tay', submissionDate: '16:30 10/03/2020', status: 'Đã duyệt' },
    ...Array.from({ length: 97 - 6 }).map((_, i) => ({
        id: i + 7,
        name: `Chứng chỉ Test ${i + 7}`,
        fileName: `test_cert_${i + 7}.pdf`,
        seerName: `Nhà Tiên Tri Test ${i + 1}`,
        category: i % 4 === 0 ? 'Cung Hoàng Đạo' : i % 4 === 1 ? 'Tarot' : i % 4 === 2 ? 'Ngũ Hành' : 'Nhân Tướng Học',
        submissionDate: `09:00 01/0${i % 9 + 1}/2023`,
        status: i % 4 === 0 ? 'Đã duyệt' : i % 4 === 1 ? 'Chờ duyệt' : 'Đã từ chối',
    })),
];

type CertificateType = typeof mockCertificates[0];
const ITEMS_PER_PAGE = 10;
type StatusFilterType = 'Tất cả' | 'Chờ duyệt' | 'Đã duyệt' | 'Đã từ chối';

export const CertificateTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<StatusFilterType>('Tất cả');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCertificate, setSelectedCertificate] = useState<CertificateType | null>(null);

    // Lọc & phân trang
    const filteredCertificates = mockCertificates.filter(cert => {
        const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              cert.seerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedFilter === 'Tất cả' || cert.status === selectedFilter;
        return matchesSearch && matchesStatus;
    });

    const totalItems = filteredCertificates.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentCertificates = filteredCertificates.slice(startIndex, endIndex);

    const goToNextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    const goToPrevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));

    const handleAction = (action: string, cert: CertificateType) => {
        console.log(`${action} chứng chỉ ID: ${cert.id}, Tên: ${cert.name}, Nhà Tiên Tri: ${cert.seerName}`);
        if (action === 'Duyệt' || action === 'Từ chối') {
            setSelectedCertificate(null);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            
            {/* Hàng 1: Search + Dropdown */}
            <div className="flex justify-between items-center mb-4">
                <div className="relative flex-grow mr-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên Nhà tiên tri hoặc Tên Chứng chỉ..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                                   focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 
                                   text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>

                <div className="relative flex-shrink-0"> 
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 
                                   dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg 
                                   hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    >
                        <span>Trạng thái Mẫu</span> 
                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && ( 
                        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-700 
                                        ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-10">
                            <div className="py-1">
                                {['Tùy chọn Mẫu 1', 'Tùy chọn Mẫu 2'].map(option => (
                                    <button 
                                        key={option}
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="block w-full text-left px-4 py-2 text-sm 
                                                   text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
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
            <div className="flex space-x-2 mb-4">
                <div className='inline-flex border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 
                                bg-gray-100 dark:bg-gray-700'>
                    {['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Đã từ chối'].map(status => (
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
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Chứng chỉ</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Nhà tiên tri</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Danh mục</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Ngày nộp</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Trạng thái</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentCertificates.map((cert) => (
                            <tr key={cert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Download className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{cert.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{cert.fileName}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{cert.seerName}</td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <Badge type="expertise" value={cert.category} />
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{cert.submissionDate}</td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <Badge type="status" value={cert.status} />
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-2">
                                        <button 
                                            title="Xem chi tiết chứng chỉ" 
                                            onClick={() => setSelectedCertificate(cert)}
                                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 transition-colors"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button 
                                            title="Tải xuống chứng chỉ" 
                                            onClick={() => handleAction('Tải xuống', cert)}
                                            className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                        {cert.status === 'Chờ duyệt' && (
                                            <>
                                                <button 
                                                    title="Duyệt chứng chỉ" 
                                                    onClick={() => handleAction('Duyệt', cert)}
                                                    className="text-green-500 hover:text-green-700 p-1 transition-colors"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    title="Từ chối chứng chỉ" 
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
            <CertificateDetailModal
                certificate={selectedCertificate ? {
                    ...selectedCertificate,
                    title: selectedCertificate.name,
                    issueDate: '01/01/2023',
                    expiryDate: '01/01/2024',
                    organization: 'ISeeYou Fortune Telling Academy',
                    description: 'Chứng chỉ này chứng nhận việc hoàn thành khóa học...',
                    reviewerNote: selectedCertificate.status !== 'Chờ duyệt' 
                        ? (selectedCertificate.status === 'Đã duyệt' ? 'Đã xác minh đầy đủ giấy tờ và năng lực.' : 'Không đáp ứng tiêu chuẩn về chuyên môn.') 
                        : undefined,
                    approvalTime: selectedCertificate.status !== 'Chờ duyệt' ? '12:00 15/05/2023' : undefined
                } : null}
                onClose={() => setSelectedCertificate(null)}
                onApprove={(id, note) => handleAction('Duyệt', selectedCertificate as CertificateType)}
                onReject={(id, note) => handleAction('Từ chối', selectedCertificate as CertificateType)}
            />
        </div>
    );
};
