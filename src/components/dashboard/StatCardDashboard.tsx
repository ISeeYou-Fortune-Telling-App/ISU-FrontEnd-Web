import React from 'react';
import { TrendingUp, TrendingDown, TrendingUpDown } from 'lucide-react'; 

interface StatCardDashboardProps {
    title: string;
    value: string;
    trend: string;
    icon: React.ElementType; 
}

const StatCardDashboard: React.FC<StatCardDashboardProps> = ({ title, value, trend, icon: Icon }) => {
    
    let TrendIcon = TrendingUpDown; 
    let trendColor = 'text-gray-500 dark:text-gray-400';
    let trendValue = trend; 

    if (trend.startsWith('+')) {
        TrendIcon = TrendingUp;
        trendColor = 'text-green-500';
    } else if (trend.startsWith('-')) {
        TrendIcon = TrendingDown;
        trendColor = 'text-red-500';
    } 

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <Icon className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex flex-col items-start mt-3">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                
                <div className="flex items-center space-x-1 mt-3"> 
                    <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} /> 
                    <span className={`text-xs font-semibold ${trendColor}`}>
                        {trendValue} 
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StatCardDashboard;