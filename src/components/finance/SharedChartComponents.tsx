/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export const RevenueChart: React.FC<{
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

const TierLegendItem: React.FC<{
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

export const TierPieChart: React.FC<{ data: Record<string, number>; title: string }> = ({
  data,
}) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  if (total === 0 || Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Chưa có dữ liệu</p>
      </div>
    );
  }

  const COLORS: Record<string, string> = {
    MASTER: '#06b6d4',
    EXPERT: '#a855f7',
    PROFESSIONAL: '#eab308',
    APPRENTICE: '#9ca3af',
    VIP: '#eab308',
    PREMIUM: '#a855f7',
    STANDARD: '#9ca3af',
    CASUAL: '#d1d5db',
  };

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
    color: COLORS[name] || '#9ca3af',
    percentage: (value / total) * 100,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Số lượng: <span className="font-bold">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tỷ lệ: <span className="font-bold">{data.payload.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="w-full md:w-1/2 h-64">
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

      <div className="w-full md:w-1/2 flex flex-col space-y-1">
        {chartData.map((item, index) => (
          <TierLegendItem
            key={index}
            color={item.color}
            label={item.name}
            value={item.value}
            percentage={item.percentage}
          />
        ))}
        {chartData.length > 0 && (
          <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-3">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Tổng cộng</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{total}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
