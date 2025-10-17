'use client'
import React, { useState, useMemo } from 'react'; // Bổ sung useMemo vào import
import { Search, Eye, Check, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'; 

import { UserDetailModal } from '../accounts/UserDetailModal'
import { Badge } from '../common/Badge'; 

// Giữ nguyên mockUsers, UserType và ITEMS_PER_PAGE

const mockUsers = [
    { name: 'Minh Tuệ', contact: 'minhtue@isee.vn', phone: '0901234567', role: 'Nhà tiên tri', status: 'Đã duyệt', joinDate: '10/03/2020', isLocked: false, 
        details: { hoTen: 'Nguyễn Minh Tuệ', gioiTinh: 'Nữ', ngaySinh: '01/01/1990', tieuSu: 'Là một Nhà tiên tri giàu kinh nghiệm, chuyên về Tarot và Chiêm tinh.', cungHoangDao: 'Ma Kết', conGiap: 'Ngựa', nguHanh: 'Mộc', tongChiTieu: '5.200.000 VNĐ', soPhienThamGia: 35 }
    },
    { name: 'Khách Hàng A', contact: 'khachhangA@mail.com', phone: '0912345789', role: 'Khách hàng', status: 'Đã duyệt', joinDate: '12/05/2021', isLocked: false,
        details: { hoTen: 'Trần Văn A', gioiTinh: 'Nam', ngaySinh: '15/07/1995', tieuSu: 'Khách hàng mới quan tâm đến Phong thủy.', cungHoangDao: 'Cự Giải', conGiap: 'Lợn', nguHanh: 'Kim', tongChiTieu: '199.000 VNĐ', soPhienThamGia: 2 } 
    },
    { name: 'Nhà Tiên Tri B', contact: 'seerB@isee.vn', phone: '0987654321', role: 'Nhà tiên tri', status: 'Chờ duyệt', joinDate: '01/01/2023', isLocked: false, 
        details: { hoTen: 'Lê Thị B', gioiTinh: 'Nữ', ngaySinh: '20/09/1985', tieuSu: 'Ứng viên Nhà tiên tri chờ duyệt giấy tờ.', cungHoangDao: 'Xử Nữ', conGiap: 'Trâu', nguHanh: 'Thổ', tongChiTieu: '0 VNĐ', soPhienThamGia: 0 }
    },
    { name: 'User Bị Khóa', contact: 'locked@mail.com', phone: '0900000000', role: 'Khách hàng', status: 'Đã khóa', joinDate: '05/11/2019', isLocked: true, 
        details: { hoTen: 'Phạm Văn Khóa', gioiTinh: 'Nam', ngaySinh: '05/02/1978', tieuSu: 'Tài khoản đã bị khóa do vi phạm chính sách.', cungHoangDao: 'Bảo Bình', conGiap: 'Ngọ', nguHanh: 'Hỏa', tongChiTieu: '1.000.000 VNĐ', soPhienThamGia: 10 } 
    },

    ...Array.from({ length: 7 }).map((_, i) => ({
        name: `User Test ${i + 5}`, contact: `test${i+5}@mail.com`, phone: `0901234${10+i}`, role: 'Khách hàng', status: i % 2 === 0 ? 'Đã duyệt' : 'Chờ duyệt', joinDate: `01/0${i+1}/2023`, isLocked: false,
        details: { hoTen: `Họ Tên Test ${i + 5}`, gioiTinh: i % 2 === 0 ? 'Nam' : 'Nữ', ngaySinh: `10/10/199${i}`, tieuSu: 'Tài khoản test', cungHoangDao: 'Thiên Bình', conGiap: 'Mèo', nguHanh: 'Thủy', tongChiTieu: '500.000 VNĐ', soPhienThamGia: 5 }
    })),
];

type UserType = typeof mockUsers[0];
const ITEMS_PER_PAGE = 10;

export const UserTable: React.FC = () => {

    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // State cho search và filter
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<'Tất cả' | 'Khách hàng' | 'Nhà tiên tri'>('Tất cả');
    const [selectedStatus, setSelectedStatus] = useState<'Tất cả' | 'Hoạt động' | 'Chờ duyệt' | 'Đã khóa'>('Tất cả');
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

    // =========================================================================
    // SỬ DỤNG useMemo CHO LOGIC LỌC
    // =========================================================================
    const filteredUsers = useMemo(() => {
        // Hàm lọc chỉ chạy lại khi searchTerm, selectedRole hoặc selectedStatus thay đổi
        return mockUsers.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  user.contact.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesRole = selectedRole === 'Tất cả' || user.role === selectedRole;
            
            const matchesStatus = selectedStatus === 'Tất cả' || 
                                  (selectedStatus === 'Hoạt động' && user.status === 'Đã duyệt' && !user.isLocked) ||
                                  (selectedStatus === 'Chờ duyệt' && user.status === 'Chờ duyệt') ||
                                  (selectedStatus === 'Đã khóa' && user.isLocked);
            
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [searchTerm, selectedRole, selectedStatus]); // Dependency array: Chỉ tính lại khi các state này thay đổi

    // =========================================================================
    // SỬ DỤNG useMemo CHO LOGIC PHÂN TRANG
    // =========================================================================
    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const { startIndex, endIndex, currentUsers } = useMemo(() => {
        // Logic phân trang chỉ chạy lại khi filteredUsers hoặc currentPage thay đổi
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentUsers = filteredUsers.slice(startIndex, endIndex);

        return { startIndex, endIndex, currentUsers };
    }, [filteredUsers, currentPage]); // Dependency array

    // Hàm thay đổi trang được giữ nguyên
    const goToNextPage = () => { setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev)); };
    const goToPrevPage = () => { setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev)); };
    
    const openUserDetail = (user: UserType) => {
        setSelectedUser(user);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"> 
            {/* Search + Filter */}
            <div className="flex justify-between items-center mb-4">
                <div className="relative flex-grow mr-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {/* Dropdown trạng thái */}
                <div className="relative"> 
                    <button 
                        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                        className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    >
                        <span>{selectedStatus}</span>
                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isStatusDropdownOpen && ( 
                        <div 
                            className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-10">
                            <div className="py-1">
                                {['Tất cả', 'Hoạt động', 'Chờ duyệt', 'Đã khóa'].map(status => (
                                    <button 
                                        key={status}
                                        onClick={() => {
                                            setSelectedStatus(status as typeof selectedStatus);
                                            setIsStatusDropdownOpen(false); 
                                            setCurrentPage(1); 
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm 
                                            ${selectedStatus === status 
                                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-600 font-semibold' 
                                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Filter theo role */}
            <div className="flex space-x-2 mb-4"> 
                <div className='flex border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700'>
                    {['Tất cả', 'Khách hàng', 'Nhà tiên tri'].map(role => (
                        <button 
                            key={role}
                            onClick={() => {
                                setSelectedRole(role as typeof selectedRole);
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-1 text-sm font-medium rounded-lg transition-colors 
                                ${selectedRole === role 
                                    ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 font-semibold' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Người dùng</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Liên hệ</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Vai trò</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Ngày tham gia</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentUsers.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded-full mr-3" src="https://images.wallpapersden.com/image/download/satoru-gojo-acid-blue-eyes-jujutsu-kaisen_bmZpbWqUmZqaraWkpJRnZm1prWZmbW0.jpg" alt="Avatar" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm">
                                    <div className="text-gray-900 dark:text-white">{user.contact}</div>
                                    <div className="text-gray-500 dark:text-gray-400">{user.phone}</div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <Badge type="role" value={user.role} />
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <Badge type="status" value={user.isLocked ? 'Đã khóa' : user.status} />
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.joinDate}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-3">
                                        <button 
                                            title="Xem chi tiết" 
                                            onClick={() => openUserDetail(user)}
                                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 transition-colors"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        {user.status === 'Chờ duyệt' ? (
                                            <>
                                                <button title="Duyệt tài khoản" className="text-green-500 hover:text-green-700 p-1 transition-colors">
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button title="Từ chối/Khóa tài khoản" className="text-red-500 hover:text-red-700 p-1 transition-colors">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </>
                                        ) : user.isLocked ? ( 
                                            <button title="Mở khóa tài khoản" className="text-green-500 hover:text-green-700 p-1 transition-colors">
                                                <Check className="w-5 h-5" />
                                            </button>
                                        ) : (
                                            <button title="Khóa tài khoản" className="text-red-500 hover:text-red-700 p-1 transition-colors">
                                                <X className="w-5 h-5" />
                                            </button>
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
                    <button 
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
                            currentPage === 1 
                                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`p-1 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
                            currentPage === totalPages
                                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Modal chi tiết */}
            <UserDetailModal 
                user={selectedUser} 
                onClose={() => setSelectedUser(null)} 
            />
        </div>
    );
};