// src/app/admin/accounts/page.tsx
import React from 'react';
import { Users, UserCircle, CheckSquare, Ban } from 'lucide-react'; 

// Import các components đã có sẵn (Điều chỉnh path nếu cần)
import { StatsCard } from '../../../components/feature/StatCardAccount'; // Đã chỉnh path và tên file
import { UserTable } from '../../../components/feature/UserTable'; 

// --- MOCK DATA (Thay thế bằng dữ liệu thực) ---
// Định nghĩa lại stats để khớp với cấu trúc StatsCard đã cho
const userStats = [
    // Lưu ý: StatsCard hiện tại chỉ nhận value, label, colorClass
    { label: 'Tài khoản Khách hàng', value: 1983, colorClass: 'text-blue-500', icon: Users },
    { label: 'Tài khoản Nhà tiên tri', value: 24, colorClass: 'text-yellow-500', icon: UserCircle },
    { label: 'Tài khoản chờ duyệt', value: 12, colorClass: 'text-orange-500', icon: CheckSquare },
    { label: 'Tài khoản bị khóa', value: 5, colorClass: 'text-red-500', icon: Ban },
];

/**
 * Trang Quản lý Tài khoản - Trang cho route /admin/accounts
 * Giả định: Sidebar và Header đã được xử lý ở Layout cha.
 */
export default function AccountsPage() {
    
    // Áp dụng theme (đã loại bỏ class 'flex bg-gray-50 min-h-screen' ở thẻ div ngoài cùng)
    // Trang này chỉ là phần nội dung chính (<main> cũ)
    return (
        <div className="space-y-6">
            
            {/* 1. Page Title */}
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Quản lý tài khoản</h1>
                <p className="text-base font-light text-gray-500 dark:text-gray-400">
                    Xem và duyệt tài khoản Customer và Seer
                </p>
            </div>
            
            {/* 2. Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {userStats.map((stat, index) => (
                    // Chỉ truyền props mà component StatsCard yêu cầu (value, label, colorClass)
                    // Icon không được StatsCard sử dụng, nên bỏ qua.
                    <StatsCard 
                        key={index} 
                        value={stat.value} 
                        label={stat.label} 
                        colorClass={stat.colorClass} 
                    />
                ))}
            </div>
            
            {/* 3. User Management Table Section */}
            {/* UserTable đã được cập nhật Dark Mode trong các div và text class. */}
            <UserTable />
            
        </div>
    );
}