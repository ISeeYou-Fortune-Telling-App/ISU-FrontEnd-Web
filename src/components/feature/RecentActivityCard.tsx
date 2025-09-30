// src/components/layout/RecentActivityCard.tsx

import React from 'react';
import { Eye } from 'lucide-react'; 

// Dữ liệu giả định cho hoạt động gần đây
const DUMMY_ACTIVITIES = [
    { 
        title: "Tài khoản mới đăng ký", 
        detail: "Nguyễn Thị Mai", 
        time: "5 phút trước", 
        dotColor: "bg-blue-500" 
    },
    { 
        title: "Seer nộp chứng chỉ mới", 
        detail: "Trần Văn Nam", 
        time: "12 phút trước", 
        dotColor: "bg-yellow-500" 
    },
    { 
        title: "Phiên tư vấn hoàn thành", 
        detail: "Minh Tuệ → Thị Hoa", 
        time: "20 phút trước", 
        dotColor: "bg-green-500" 
    },
    { 
        title: "Giao dịch thành công", 
        detail: "299,000 VNĐ - Mẹ mẩy", 
        time: "1 giờ trước", 
        dotColor: "bg-green-500" 
    },
];

interface ActivityItemProps {
    title: string;
    detail: string;
    time: string;
    dotColor: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ title, detail, time, dotColor }) => (
    <div className="flex items-start justify-between py-3">
        
        {/* Cột trái: Chấm tròn và Nội dung */}
        <div className="flex items-start space-x-3">
            {/* Chấm tròn */}
            <div className={`w-3 h-3 ${dotColor} rounded-full mt-1.5 flex-shrink-0`}></div>
            
            {/* Nội dung */}
            <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{detail}</p>
            </div>
        </div>
        
        {/* Cột phải: Thời gian */}
        <p className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-4">{time}</p>
    </div>
);


const RecentActivityCard: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center space-x-2">
            <Eye className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span>Hoạt động gần đây</span>
        </h2>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {DUMMY_ACTIVITIES.map((activity, index) => (
                <ActivityItem 
                    key={index}
                    title={activity.title}
                    detail={activity.detail}
                    time={activity.time}
                    dotColor={activity.dotColor}
                />
            ))}
        </div>
        
    </div>
);

export default RecentActivityCard;