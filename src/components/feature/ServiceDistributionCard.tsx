// src/components/charts/ServiceDistributionCard.tsx

import React from 'react';
import { PieChart } from 'lucide-react'; 

// Component con cho chú thích màu (GIỮ NGUYÊN)
const ServiceLegendItem: React.FC<{ colorClass: string; label: string }> = ({ colorClass, label }) => (
    <div className="flex items-center space-x-2 py-1">
        <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </div>
);

const ServiceDistributionCard: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        
        <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                    <PieChart className="w-5 h-5 text-orange-500" />
                    <span>Phân bố dịch vụ</span>
                </h2>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-1">
                    Phân bố theo loại hình tư vấn
                </p>
            </div>
            <div className="flex items-center space-x-3">
                {/* Select Tháng */}
                <select 
                    defaultValue="Tháng 8"
                    className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                    <option>Tháng 8</option>
                </select>
                {/* Select Năm */}
                <select 
                    defaultValue="Năm 2025"
                    className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                    <option>Năm 2025</option>
                </select>
            </div>
        </div>
        
        <div className="flex-shrink-0 flex justify-center items-center w-full md:w-1/2 ml-36">
            <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700">
                    
            </div>
        </div>

    
        <div className="w-full md:w-1/2 flex flex-col items-start mt-8"> {/* Thêm flex-col và items-start */}
            <ServiceLegendItem colorClass="bg-pink-600" label="Cung Hoàng Đạo" />
            <ServiceLegendItem colorClass="bg-blue-600" label="Nhân Tướng Học" />
            <ServiceLegendItem colorClass="bg-yellow-600" label="Tarot" />
            <ServiceLegendItem colorClass="bg-red-600" label="Chỉ Tay" />
            <ServiceLegendItem colorClass="bg-gray-400" label="Khác" />
        </div>
    </div>
);

export default ServiceDistributionCard;