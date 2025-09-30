import React from 'react';
// 1. Import các icon Lucide cần thiết
import { TrendingUp, TrendingDown, TrendingUpDown } from 'lucide-react'; 

interface StatCardProps {
    title: string;
    value: string;
    // Chúng ta sẽ giữ trend là string để xác định chiều hướng (+ hoặc -)
    trend: string;
    icon: React.ElementType; 
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon: Icon }) => {
    
    // 2. Viết logic để xác định icon và màu sắc
    let TrendIcon = TrendingUpDown; // Đặt mặc định là TrendingUpDown (Không thay đổi)
    let trendColor = 'text-gray-500 dark:text-gray-400';
    let trendValue = trend; // GIỮ NGUYÊN CHUỖI TREND

    if (trend.startsWith('+')) {
        TrendIcon = TrendingUp;
        trendColor = 'text-green-500';
    } else if (trend.startsWith('-')) {
        TrendIcon = TrendingDown;
        trendColor = 'text-red-500';
    } 
    // Nếu không phải '+' hoặc '-', thì giữ nguyên mặc định (TrendingUpDown, màu xám)

    // *** ĐÃ XÓA LOGIC CẮT DẤU (+ / -) Ở ĐÂY ***

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <Icon className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex flex-col items-start mt-3">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                
                {/* 3. Hiển thị icon và giá trị trend có kèm dấu */}
                <div className="flex items-center space-x-1 mt-3"> 
                    <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} /> 
                    <span className={`text-xs font-semibold ${trendColor}`}>
                        {/* Hiển thị trendValue (có kèm dấu + hoặc -) */}
                        {trendValue} 
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StatCard;