/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '@/services/dashboard/dashboard.service';
import { TopSeerChartData } from '@/types/dashboard/dashboard.type';

const YEARS = [2025, 2026, 2024];
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

// Helper function to remove title prefix (Thầy/Cô)
const removeTitle = (fullName: string): string => {
  if (!fullName) return 'N/A';
  return fullName.replace(/^(Thầy|Cô|Thay|Co)\s+/i, '').trim();
};

const TopSeerPerformanceChart: React.FC = () => {
  const [chartData, setChartData] = useState<TopSeerChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setIsDataFetched(false);
        const response = await dashboardService.getTopSeerPerformance(
          selectedYear,
          100,
          selectedMonth > 0 ? selectedMonth : undefined,
        );

        // Group by seerId and aggregate data
        const seerMap = new Map<string, any>();

        (response.data || []).forEach((record: any) => {
          const seerId = record.seerId;

          if (!seerMap.has(seerId)) {
            seerMap.set(seerId, {
              seerId,
              fullName: record.fullName || `Seer ${seerId.slice(-4)}`,
              totalRevenue: 0,
              totalSessions: 0,
              totalRating: 0,
              ratingCount: 0,
              performancePoint: 0,
            });
          }

          const seer = seerMap.get(seerId);
          seer.totalRevenue += record.totalRevenue || 0;
          seer.totalSessions += record.completedBookings || 0;
          seer.totalRating += (record.avgRating || 0) * (record.totalRates || 0);
          seer.ratingCount += record.totalRates || 0;
          seer.performancePoint = Math.max(seer.performancePoint, record.performancePoint || 0);
        });

        // Convert to array and calculate averages
        const aggregatedData = Array.from(seerMap.values()).map((seer) => ({
          name: removeTitle(seer.fullName),
          fullName: seer.fullName,
          revenue: seer.totalRevenue,
          sessions: seer.totalSessions,
          rating: seer.ratingCount > 0 ? seer.totalRating / seer.ratingCount : 0,
          performancePoint: seer.performancePoint,
        }));

        // Sort by revenue descending and take top 10
        const topSeers = aggregatedData
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10)
          .reverse(); // Reverse for horizontal bar chart (top at top)

        setChartData(topSeers);
        setError(null);
        setIsDataFetched(true);
      } catch (err) {
        console.error('Error fetching top seer performance:', err);
        setError('Không thể tải dữ liệu');
        setIsDataFetched(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-400 dark:border-gray-700">
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {data.fullName}
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-purple-600 dark:text-purple-400">
              Doanh thu:{' '}
              <span className="font-bold">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(data.revenue)}
              </span>
            </p>
            <p className="text-blue-600 dark:text-blue-400">
              Phiên: <span className="font-bold">{data.sessions}</span>
            </p>
            <p className="text-yellow-600 dark:text-yellow-400">
              Đánh giá: <span className="font-bold">{data.rating.toFixed(1)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomYAxisTick = ({ x, y, payload }: any) => {
    return (
      <text
        x={x}
        y={y}
        dy={4}
        textAnchor="end"
        fill="currentColor"
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {payload.value}
      </text>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-400 dark:border-gray-700 h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span>Top Seer hiệu suất cao</span>
          </h2>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-1">
            Xếp hạng theo doanh thu trong năm
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Month Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <span>{MONTHS.find((m) => m.value === selectedMonth)?.label}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isMonthDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isMonthDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsMonthDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-lg shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto">
                  {MONTHS.map((month) => (
                    <button
                      key={month.value}
                      onClick={() => {
                        setSelectedMonth(month.value);
                        setIsMonthDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                        selectedMonth === month.value
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {month.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Year Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <span>Năm {selectedYear}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isYearDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsYearDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20 overflow-hidden">
                  {YEARS.map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setIsYearDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                        selectedYear === year
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium'
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
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Chưa có dữ liệu</p>
        </div>
      ) : (
        <div className="flex-1 mt-4">
          <div style={{ height: '450px' }}>
            {isDataFetched && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 5, bottom: 5, left: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    className="text-xs text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    tickFormatter={formatCurrency}
                  />
                  <YAxis type="category" dataKey="name" tick={<CustomYAxisTick />} width={180} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="revenue"
                    fill="#a855f7"
                    radius={[0, 8, 8, 0]}
                    animationBegin={0}
                    animationDuration={800}
                    barSize={35}
                    maxBarSize={35}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopSeerPerformanceChart;
