// src/components/admin/user-management/UserDetailModal.tsx
import React from 'react';
import { X, Calendar, Mail, Phone, User, Compass, Zap, BookOpen, Lock, Unlock, Sun } from 'lucide-react';
// Giả định đường dẫn import
import { StatusBadge } from '../common/StatusBadge'; 
import { RoleBadge } from '../common/RoleBadge';     

// Định nghĩa kiểu dữ liệu (Nên đưa ra file types riêng)
interface UserDetail {
    name: string;
    contact: string;
    phone: string;
    role: string;
    status: string;
    isLocked: boolean;
    details: {
        hoTen: string;
        gioiTinh: string;
        ngaySinh: string;
        tieuSu: string;
        cungHoangDao: string;
        conGiap: string;
        nguHanh: string;
        tongChiTieu: string;
        soPhienThamGia: number;
    };
}

interface UserDetailModalProps {
    user: UserDetail | null;
    onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
    if (!user) return null;

    // Lấy Icon và text cho nút Khóa/Mở khóa
    const actionText = user.isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản';
    const ActionIcon = user.isLocked ? Unlock : Lock;
    const isCustomer = user.role === 'Khách hàng';

    return (
        // Sử dụng fixed inset-0 để tạo lớp phủ
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-end">
            {/* Modal Drawer - max-w-sm (448px) để có kích thước phù hợp với ảnh */}
            <div className="w-full max-w-sm h-full bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <img className="h-10 w-10 rounded-full" src="https://via.placeholder.com/40" alt="Avatar" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                                <div className="flex space-x-2 mt-1">
                                    <StatusBadge status={user.status} />
                                    <RoleBadge role={user.role} />
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Thông tin Cá nhân */}
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mt-6 mb-3 border-b pb-2 dark:border-gray-700">Thông tin Cá nhân</h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700 dark:text-gray-300">
                        
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><User className="w-4 h-4 inline mr-1" /> Họ tên</span>
                            <span className="font-medium text-gray-900 dark:text-white">{user.details.hoTen}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                {/* Sử dụng icon Nữ/Nam giả lập */}
                                <span className='text-lg mr-1'>♀</span> Giới tính
                            </span> 
                            <span className="font-medium text-gray-900 dark:text-white">{user.details.gioiTinh}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><Mail className="w-4 h-4 inline mr-1" /> Email</span>
                            <span className="font-medium">{user.contact}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><Phone className="w-4 h-4 inline mr-1" /> Số điện thoại</span>
                            <span className="font-medium">{user.phone}</span>
                        </div>

                        <div className="flex flex-col col-span-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><Calendar className="w-4 h-4 inline mr-1" /> Ngày sinh</span>
                            <span className="font-medium">{user.details.ngaySinh}</span>
                        </div>
                        
                        <div className="col-span-2 mt-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mb-1"><BookOpen className="w-4 h-4 mr-1" /> Tiểu sử:</p>
                            <p className="text-sm italic text-gray-800 dark:text-gray-200">{user.details.tieuSu}</p>
                        </div>
                    </div>
                    
                    {/* Thông tin Khách hàng/Tiên tri */}
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mt-6 mb-3 border-b pb-2 dark:border-gray-700">Thông tin {isCustomer ? 'Khách hàng' : 'Nhà tiên tri'}</h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700 dark:text-gray-300">
                        
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><Sun className="w-4 h-4 inline mr-1 text-yellow-500" /> Cung Hoàng Đạo</span>
                            <span className="font-medium text-gray-900 dark:text-white">{user.details.cungHoangDao}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><Zap className="w-4 h-4 inline mr-1 text-yellow-500" /> Con Giáp</span>
                            <span className="font-medium text-gray-900 dark:text-white">{user.details.conGiap}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><Compass className="w-4 h-4 inline mr-1 text-yellow-500" /> Ngũ hành bản mệnh</span>
                            <span className="font-medium text-gray-900 dark:text-white">{user.details.nguHanh}</span>
                        </div>
                        {/* Chi tiêu và Số phiên chỉ hiển thị cho Khách hàng */}
                        {isCustomer && (
                            <>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><span className="text-lg font-bold mr-1 text-green-500">₫</span> Tổng chi tiêu</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{user.details.tongChiTieu}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><span className="text-lg font-bold mr-1 text-green-500">💬</span> Số phiên tham gia</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{user.details.soPhienThamGia}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Action Footer */}
                    <div className="mt-8">
                        <button className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2">
                            <ActionIcon className="w-5 h-5" />
                            <span>{actionText}</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};