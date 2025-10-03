import React from 'react';
import { X, Calendar, Mail, Phone, User, BookOpen, Sun, Check, Ban } from 'lucide-react'; 

import { useScrollLock } from '../../hooks/useScrollLock';

import { StatusBadge } from '../common/StatusBadge'; 
import { RoleBadge } from '../common/RoleBadge';     

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

interface DetailItemProps { 
    Icon?: React.FC<any>;  
    label: string;  
    value: string | number;  
    iconColor?: string;  
    emoji?: string; 
} 

const getNguHanhSymbol = (nguHanh: string): string => {
    switch (nguHanh) {
        case 'Kim': return '⚙️'; 
        case 'Mộc': return '🌳'; 
        case 'Thủy': return '💧'; 
        case 'Hỏa': return '🔥'; 
        case 'Thổ': return '⛰️'; 
        default: return '✨';
    }
};

const getConGiapSymbol = (conGiap: string): string => {
    switch (conGiap) {
        case 'Tý': return '🐀';
        case 'Sửu': return '🐂';
        case 'Dần': return '🐅';
        case 'Mão': return '🐇';
        case 'Thìn': return '🐉';
        case 'Tỵ': return '🐍';
        case 'Ngọ': return '🐎';
        case 'Mùi': return '🐏';
        case 'Thân': return '🐒';
        case 'Dậu': return '🐓';
        case 'Tuất': return '🐕';
        case 'Hợi': return '🐖';
        default: return '💫';
    }
};

const getZodiacSymbol = (cungHoangDao: string): string => { 
    switch (cungHoangDao) { 
        case 'Bạch Dương': return '♈'; 
        case 'Kim Ngưu': return '♉'; 
        case 'Song Tử': return '♊'; 
        case 'Cự Giải': return '♋'; 
        case 'Sư Tử': return '♌'; 
        case 'Xử Nữ': return '♍'; 
        case 'Thiên Bình': return '♎'; 
        case 'Thiên Yết': return '♏'; 
        case 'Nhân Mã': return '♐'; 
        case 'Ma Kết': return '♑'; 
        case 'Bảo Bình': return '♒'; 
        case 'Song Ngư': return '♓'; 
        default: return '✨'; 
    } 
}; 

const DetailItem: React.FC<DetailItemProps> = ({ Icon, label, value, iconColor = 'text-gray-500', emoji }) => { 
    let IconElement; 
    if (emoji) { 
        IconElement = <span className={`text-xl font-bold mr-2 ${iconColor}`}>{emoji}</span>; 
    } else if (Icon) { 
        IconElement = <Icon className={`w-5 h-5 inline mr-2 ${iconColor}`} />; 
    } else { 
        IconElement = null; 
    } 

    return ( 
        <div className="flex flex-col"> 
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</span> 
            <div className="flex items-center"> 
                {IconElement} 
                <span className="font-medium text-gray-900 dark:text-white">{value}</span> 
            </div> 
        </div> 
    ); 
}; 

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => { 
    useScrollLock(!!user); 
    
    if (!user) return null; 

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => { 
        if (event.target === event.currentTarget) { 
            onClose(); 
        } 
    }; 

    const isPending = user.status === 'Chờ duyệt';
    const isCustomer = user.role === 'Khách hàng';

    const ActionIcon = user.isLocked ? Check : X; 
    
    // Lấy ký hiệu Unicode mới
    const zodiacSymbol = getZodiacSymbol(user.details.cungHoangDao); 
    const conGiapSymbol = getConGiapSymbol(user.details.conGiap);
    const nguHanhSymbol = getNguHanhSymbol(user.details.nguHanh);

    return ( 
        // Sử dụng fixed inset-0 để tạo lớp phủ 
        <div  
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-end" 
            onClick={handleBackdropClick} 
        > 
            
            {/* Modal Drawer - Sử dụng flex-col và h-full để bố cục dọc */} 
            <div  
                className="w-full max-w-sm h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col" 
                onClick={(e) => e.stopPropagation()}  
            > 
                
                {/* CONTENT CUỘN ĐƯỢC (flex-grow) */} 
                <div className="flex-grow overflow-y-auto p-6 pb-20">  
                    
                    {/* Header */} 
                    <div className="flex justify-between items-start pb-4 border-b border-gray-200 dark:border-gray-700"> 
                        <div className="flex items-center space-x-3"> 
                            <img className="h-10 w-10 rounded-full" src="https://images.wallpapersden.com/image/download/satoru-gojo-acid-blue-eyes-jujutsu-kaisen_bmZpbWqUmZqaraWkpJRnZm1prWZmbW0.jpg" alt="Avatar" /> 
                            <div> 
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h3> 
                                <div className="flex space-x-2 mt-1"> 
                                    <StatusBadge status={user.isLocked ? 'Đã khóa' : user.status} />  
                                    <RoleBadge role={user.role} /> 
                                </div> 
                            </div> 
                        </div> 
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1"> 
                            <X className="w-6 h-6" /> 
                        </button> 
                    </div> 

                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mt-4 mb-3 border-b pb-2 dark:border-gray-700">Thông tin Cá nhân</h4> 
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700 dark:text-gray-300"> 

                        <DetailItem Icon={User} label="Họ tên" value={user.details.hoTen} /> 
                        <DetailItem emoji="♀" label="Giới tính" value={user.details.gioiTinh} /> 
                        <DetailItem Icon={Mail} label="Email" value={user.contact} /> 
                        <DetailItem Icon={Phone} label="Số điện thoại" value={user.phone} /> 
                        <div className="flex flex-col col-span-2"> 
                            <DetailItem Icon={Calendar} label="Ngày sinh" value={user.details.ngaySinh} /> 
                        </div> 

                        <div className="col-span-2 mt-3"> 
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mb-1"><BookOpen className="w-4 h-4 mr-1" /> Tiểu sử:</p> 
                            <p className="text-sm italic text-gray-800 dark:text-gray-200">{user.details.tieuSu}</p> 
                        </div> 
                    </div> 

                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mt-6 mb-3 border-b pb-2 dark:border-gray-700">Thông tin {isCustomer ? 'Khách hàng' : 'Nhà tiên tri'}</h4> 
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700 dark:text-gray-300"> 

                        <DetailItem 
                            emoji={zodiacSymbol} 
                            label="Cung Hoàng Đạo" 
                            value={user.details.cungHoangDao} 
                            iconColor="text-yellow-500" 
                        /> 
                        <DetailItem 
                            emoji={conGiapSymbol} 
                            label="Con Giáp" 
                            value={user.details.conGiap} 
                            iconColor="text-yellow-500" 
                        /> 

                        <DetailItem 
                            emoji={nguHanhSymbol} 
                            label="Ngũ hành bản mệnh" 
                            value={user.details.nguHanh} 
                            iconColor="text-yellow-500" 
                        /> 
                        {isCustomer ? ( 
                            <> 
                                <DetailItem 
                                    emoji="₫" 
                                    label="Tổng chi tiêu" 
                                    value={user.details.tongChiTieu} 
                                    iconColor="text-green-500" 
                                /> 
                                <DetailItem 
                                    emoji="💬" 
                                    label="Số phiên tham gia" 
                                    value={user.details.soPhienThamGia} 
                                    iconColor="text-green-500" 
                                /> 
                            </> 
                        ) : (
                            // Hiển thị một số thông tin phụ cho Nhà tiên tri nếu cần
                             <DetailItem 
                                Icon={Sun}
                                label="Thời gian hoạt động"
                                value="100 giờ" // Giá trị giả định
                                iconColor="text-yellow-500"
                            />
                        )}
                    </div> 
                </div> {/* END: CONTENT CUỘN ĐƯỢC */} 

                {/* Action Footer (CỐ ĐỊNH) - ĐÃ CẬP NHẬT LOGIC 2 NÚT */} 
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"> 
                    
                    {isPending && !isCustomer ? (
                        // TRẠNG THÁI CHỜ DUYỆT (Chỉ áp dụng cho Nhà tiên tri)
                        <div className="flex space-x-3">
                            {/* Nút DUYỆT (Xanh) */}
                            <button className="flex-1 py-3 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700">
                                <Check className="w-5 h-5" />
                                <span>Duyệt tài khoản</span>
                            </button>
                            {/* Nút TỪ CHỐI (Đỏ) */}
                            <button className="flex-1 py-3 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700">
                                <X className="w-5 h-5" />
                                <span>Từ chối</span>
                            </button>
                        </div>
                    ) : (
                        // TRẠNG THÁI KHÁC (Hoạt động, Đã khóa, Khách hàng)
                        <button 
                            className={`w-full py-3 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 ${user.isLocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                            <ActionIcon className="w-5 h-5" />
                            <span>{user.isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}</span>
                        </button>
                    )}
                </div> 
                
            </div> 
        </div> 
    ); 
};