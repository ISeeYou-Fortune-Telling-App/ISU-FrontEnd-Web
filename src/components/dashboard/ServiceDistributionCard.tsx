'use client';

import React, { useEffect, useState } from 'react';
import { PieChart as PieChartIcon, ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { dashboardService } from '@/services/dashboard/dashboard.service';
import { ServiceDistributionData } from '@/types/dashboard/dashboard.type';
import { YearDropdown } from '../finance/UnifiedDropdown';
import { MonthDropdown } from '../finance/UnifiedDropdown';

const COLORS: Record<string, string> = {
  'Cung Hoàng Đạo': '#ec4899',
  'Nhân Tướng Học': '#3b82f6',
  Tarot: '#eab308',
  'Chỉ Tay': '#ef4444',
  Khác: '#9ca3af',
};

const YEARS = [2026, 2025, 2024];
const MONTHS = [
  { value: 0, label: 'Tất cả' },
  { value: 1, label: 'Tháng 1' },
  { value: 2, label: 'Tháng 2' },
  { value: 3, label: 'Tháng 3' },
  { value: 4, label: 'Tháng 4' },
  { value: 5, label: 'Tháng 5' },
  { value: 6, label: 'Tháng 6' },
  { value: 7, label: 'Tháng 7' },
  { value: 8, label: 'Tháng 8' },
  { value: 9, label: 'Tháng 9' },
  { value: 10, label: 'Tháng 10' },
  { value: 11, label: 'Tháng 11' },
  { value: 12, label: 'Tháng 12' },
];

const ServiceLegendItem: React.FC<{
  color: string;
  label: string;
  value: number;
  percentage: number;
}> = ({ color, label, value, percentage }) => (
  <div className="flex items-center justify-between w-full py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
    <div className="flex items-center space-x-3">
      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </div>
    <div className="flex items-center space-x-3">
      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[45px] text-right">
        {percentage.toFixed(1)}%
      </span>
    </div>
  </div>
);

const ServiceDistributionCard: React.FC = () => {
  const [chartData, setChartData] = useState<ServiceDistributionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getCategoryDistribution(
          selectedYear,
          selectedMonth > 0 ? selectedMonth : undefined,
        );

        const data: ServiceDistributionData[] = Object.entries(response.data).map(
          ([name, value]) => ({
            name,
            value,
            color: COLORS[name] || COLORS['Khác'],
          }),
        );

        setChartData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching category distribution:', err);
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth]);

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalValue > 0 ? (data.value / totalValue) * 100 : 0;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Số lượng: <span className="font-bold">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tỷ lệ: <span className="font-bold">{percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
            <PieChartIcon className="w-5 h-5 text-orange-500" />
            <span>Phân bố dịch vụ</span>
          </h2>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-1">
            Phân bố theo loại hình tư vấn
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Month Dropdown */}
          <MonthDropdown
            value={selectedMonth}
            onChange={setSelectedMonth}
            className="w-32"
            includeAllYear={true}
          />

          {/* Year Dropdown */}
          <YearDropdown value={selectedYear} onChange={setSelectedYear} className="w-32" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-xs h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full flex flex-col space-y-1">
            {chartData.map((item, index) => (
              <ServiceLegendItem
                key={index}
                color={item.color}
                label={item.name}
                value={item.value}
                percentage={totalValue > 0 ? (item.value / totalValue) * 100 : 0}
              />
            ))}
            {chartData.length > 0 && (
              <div className="pt-3 mt-3 border-t border-gray-400 dark:border-gray-700">
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    Tổng cộng
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {totalValue}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDistributionCard;
