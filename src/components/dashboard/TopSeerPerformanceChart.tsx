/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '@/services/dashboard/dashboard.service';
import { TopSeerChartData } from '@/types/dashboard/dashboard.type';

const YEARS = [2025, 2024];

const TopSeerPerformanceChart: React.FC = () => {
  const [chartData, setChartData] = useState<TopSeerChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getTopSeerPerformance(selectedYear, 100);

        // Group by seerId and aggregate data
        const seerMap = new Map<string, any>();

        (response.data || []).forEach((record: any) => {
          const seerId = record.seerId;

          if (!seerMap.has(seerId)) {
            seerMap.set(seerId, {
              seerId,
              name: record.fullName || `Seer ${seerId.slice(-4)}`,
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
          name: seer.name,
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
      } catch (err) {
        console.error('Error fetching top seer performance:', err);
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

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
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{data.name}</p>
          <div className="space-y-1 text-xs">
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

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-full flex flex-col">
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

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <span>Năm {selectedYear}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20 overflow-hidden">
                {YEARS.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setIsDropdownOpen(false);
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-700"
                horizontal={false}
              />
              <XAxis
                type="number"
                className="text-xs text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
                tickFormatter={formatCurrency}
              />
              <YAxis
                type="category"
                dataKey="name"
                className="text-xs text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="revenue"
                fill="#a855f7"
                radius={[0, 8, 8, 0]}
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

export default TopSeerPerformanceChart;
