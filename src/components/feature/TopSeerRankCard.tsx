import React from 'react';
import { Star, LayoutList } from 'lucide-react'; 

//chuyển thành số riel
const parseRevenue = (revenueString: string): number => {
    const cleanString = revenueString.replace(' VNĐ', '').replace(/\./g, '');
    return parseInt(cleanString, 10);
};

interface SeerRankItemProps {
    name: string;
    sessions: number;
    rating: number;
    revenue: string;
    isTop: boolean;

    // 2 props để tính toán progress %
    currentRevenueValue: number;
    maxRevenue: number;
}

const SeerRankItem: React.FC<SeerRankItemProps> = ({ 
    name, 
    sessions, 
    rating, 
    revenue, 
    isTop, 
    currentRevenueValue, 
    maxRevenue 
}) => {
    
    const percentage = maxRevenue > 0 ? (currentRevenueValue / maxRevenue) * 100 : 0;
    const widthStyle = { width: `${percentage}%` };

    return (
        <div className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full ${isTop ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2 mt-1">
                        <span>{sessions} phiên</span>
                        <span className="flex items-center space-x-0.5">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span>{rating}K</span>
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-end">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{revenue}</p>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                    <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                        style={widthStyle}
                    />
                </div>
            </div>
        </div>
    );
};

const DUMMY_DATA = [
    { name: "Thầy Minh Tuệ", sessions: 48, rating: 4.8, revenue: "13.500.000 VNĐ" },
    { name: "Cô Thanh Lan", sessions: 45, rating: 4.6, revenue: "12.750.000 VNĐ" },
    { name: "A. Thắng", sessions: 40, rating: 4.5, revenue: "10.000.000 VNĐ" }, // Thay đổi data để thấy khác biệt
    { name: "Chị Hằng", sessions: 35, rating: 4.4, revenue: "9.500.000 VNĐ" },
    { name: "Em Thảo", sessions: 30, rating: 4.3, revenue: "8.000.000 VNĐ" },
];

const TopSeerRankCard: React.FC = () => {

    const processedData = DUMMY_DATA.map(item => ({
        ...item,
        value: parseRevenue(item.revenue),
    }));

    const maxRevenue = processedData.reduce((max, item) => Math.max(max, item.value), 0);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            
            <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                        <LayoutList className="w-5 h-5 text-purple-500" />
                        <span>Top Seer hiệu suất cao</span>
                    </h2>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-1">
                        Xếp hạng theo doanh thu tháng
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <select 
                        defaultValue="Tháng 8"
                        className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    >
                        <option>Tháng 8</option>
                    </select>
                    <select 
                        defaultValue="Năm 2025"
                        className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    >
                        <option>Năm 2025</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2 mt-4">
                {processedData.map((item, index) => (
                    <SeerRankItem 
                        key={item.name}
                        name={item.name}
                        sessions={item.sessions}
                        rating={item.rating}
                        revenue={item.revenue}
                        isTop={index === 0} 
                        currentRevenueValue={item.value} 
                        maxRevenue={maxRevenue} 
                    />
                ))}
            </div>

        </div>
    );
};

export default TopSeerRankCard;