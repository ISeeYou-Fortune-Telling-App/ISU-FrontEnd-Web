/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { ReportService } from '@/services/finance/financeHistory.service';
import { YearMonthDropdowns } from '@/components/finance/ChartDropdowns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const RevenueChart: React.FC<{
  data: any[];
  year: string;
  yAxisLabel?: string;
  formatValue?: (val: number) => string;
}> = ({ data, yAxisLabel = 'Giá trị', formatValue = (val) => val.toLocaleString('vi-VN') }) => {
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

  const dataMap = data.reduce((acc: any, item: any) => {
    acc[item.label] = item.value;
    return acc;
  }, {});

  const chartData = months.map((month, idx) => {
    const monthKey = String(idx + 1);
    return {
      month,
      value: dataMap[monthKey] !== undefined ? dataMap[monthKey] : 0,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-400 dark:border-gray-700 shadow-lg">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {payload[0].payload.month}
          </p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">
            {yAxisLabel}: <span className="font-bold">{formatValue(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-400 dark:stroke-gray-700" />
          <XAxis
            dataKey="month"
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
            tickFormatter={formatValue}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ fill: '#6366f1', r: 4 }}
            activeDot={{ r: 6 }}
            animationBegin={0}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SystemRevenueTab: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [revenueChartData, setRevenueChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const revenue = await ReportService.getChart('TOTAL_REVENUE', undefined, selectedYear);
        setRevenueChartData(revenue.data || []);
      } catch (error) {
        console.error('Error fetching charts:', error);
      }
    };
    fetchCharts();
  }, [selectedYear]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Tổng doanh thu</h2>
          <YearMonthDropdowns
            selectedYear={selectedYear}
            selectedMonth={0}
            onYearChange={setSelectedYear}
            onMonthChange={() => {}}
            showMonthDropdown={false}
          />
        </div>
        <RevenueChart
          data={revenueChartData}
          year={String(selectedYear)}
          yAxisLabel="Doanh thu (VNĐ)"
          formatValue={(val: number) => formatCurrency(val).replace('₫', '').trim()}
        />
      </div>
    </div>
  );
};
