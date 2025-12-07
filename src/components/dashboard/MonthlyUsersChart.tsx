/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { Maximize, ChevronDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { dashboardService } from '@/services/dashboard/dashboard.service';
import { MonthlyChartData } from '@/types/dashboard/dashboard.type';

const MONTH_NAMES: Record<string, string> = {
  '1': 'T1',
  '2': 'T2',
  '3': 'T3',
  '4': 'T4',
  '5': 'T5',
  '6': 'T6',
  '7': 'T7',
  '8': 'T8',
  '9': 'T9',
  '10': 'T10',
  '11': 'T11',
  '12': 'T12',
};

const YEARS = [2025, 2024];

const MonthlyUsersChart: React.FC = () => {
  const [chartData, setChartData] = useState<MonthlyChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getMonthlyUsers(selectedYear);

        const data: MonthlyChartData[] = Object.entries(response.data)
          .map(([month, users]) => ({
            month: MONTH_NAMES[month] || `T${month}`,
            users,
            monthNum: parseInt(month),
          }))
          .sort((a, b) => a.monthNum - b.monthNum);

        setChartData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching monthly users:', err);
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-400 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {payload[0].payload.month}
          </p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">
            Người dùng mới: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
            <Maximize className="w-5 h-5 text-indigo-500" />
            <span>Người dùng mới theo tháng</span>
          </h2>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-1">
            Số lượng người dùng đăng ký mới trong năm
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <span>Năm {selectedYear}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-lg z-20 overflow-hidden">
                {YEARS.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                      selectedYear === year
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    Năm {year}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <div className="h-64 mt-16">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-700"
              />
              <XAxis
                dataKey="month"
                className="text-xs text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis
                className="text-xs text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={() => 'Người dùng mới'} />
              <Bar
                dataKey="users"
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
                animationBegin={0}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MonthlyUsersChart;
