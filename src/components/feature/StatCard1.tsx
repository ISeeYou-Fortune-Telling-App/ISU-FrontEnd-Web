import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ElementType; 
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon: Icon }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <Icon className="w-5 h-5 text-indigo-500" />
    </div>
    <div className="flex items-end justify-between mt-3">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <span className={`text-xs font-semibold ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
        {trend}
      </span>
    </div>
  </div>
);

export default StatCard;