/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Award, X, Filter, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { ReportService } from '@/services/finance/financeHistory.service';
import RankingItem from '@/components/finance/RankingItem';
import { RevenueChart, TierPieChart } from '@/components/finance/SharedChartComponents';
import { YearMonthDropdowns } from '@/components/finance/ChartDropdowns';

const ITEMS_PER_PAGE = 10;

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

interface SeerPerformanceTabProps {
  onShowFilter: (type: 'seer') => void;
  seerFilters: any;
  onClearFilters: () => void;
}

export const SeerPerformanceTab: React.FC<SeerPerformanceTabProps> = ({
  onShowFilter,
  seerFilters,
  onClearFilters,
}) => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(0);

  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const [allSeers, setAllSeers] = useState<any[]>([]);
  const [seerPage, setSeerPage] = useState(1);
  const [isFetchingSeers, setIsFetchingSeers] = useState(false);

  // Chart 1: Avg Revenue (Line Chart) - only year
  const [avgRevenueYear, setAvgRevenueYear] = useState(2025);
  const [avgSeerRevenueData, setAvgSeerRevenueData] = useState<any[]>([]);

  // Chart 2: Tier Distribution - separate state
  const [tierYear, setTierYear] = useState(2025);
  const [tierMonth, setTierMonth] = useState(0);
  const [tierDistribution, setTierDistribution] = useState<any>({});

  const seerRankings = allSeers.slice((seerPage - 1) * ITEMS_PER_PAGE, seerPage * ITEMS_PER_PAGE);
  const seerTotalPages = Math.ceil(allSeers.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (!isFetchingSeers) {
      const fetchAllSeers = async () => {
        setIsFetchingSeers(true);
        try {
          let allSeersData: any[] = [];
          let page = 1;
          let hasMore = true;

          const monthParam = selectedMonth === 0 ? undefined : selectedMonth;

          while (hasMore) {
            const response = await ReportService.getAllSeerPerformance({
              page,
              limit: 1000,
              sortBy: 'performancePoint',
              sortType: 'desc',
              year: selectedYear,
              month: monthParam,
              ...seerFilters,
            });

            const seersData = response.data || [];
            allSeersData = [...allSeersData, ...seersData];

            const totalPages = response.paging?.totalPages || 1;
            if (page >= totalPages) {
              hasMore = false;
            } else {
              page++;
            }
          }

          const mappedSeers = allSeersData.map((seer: any) => ({
            id: seer.id,
            seerId: seer.seerId,
            name: seer.fullName || 'N/A',
            avatar: seer.avatarUrl || `https://i.pravatar.cc/150?u=${seer.seerId}`,
            performance: seer.performancePoint,
            ranking: seer.ranking,
            tier: seer.performanceTier,
            revenue: formatCurrency(seer.totalRevenue),
            sessions: seer.completedBookings,
            avgRating: seer.avgRating,
            month: selectedMonth === 0 ? new Date().getMonth() + 1 : selectedMonth,
            year: selectedYear,
            ...seer,
          }));

          setAllSeers(mappedSeers);
          setSeerPage(1);
        } catch (error) {
          console.error('Error fetching seer rankings:', error);
          setAllSeers([]);
        } finally {
          setIsFetchingSeers(false);
        }
      };
      fetchAllSeers();
    }
  }, [selectedYear, selectedMonth, seerFilters]);

  // Fetch avg revenue chart data
  useEffect(() => {
    const fetchAvgRevenueData = async () => {
      try {
        const avgRevenue = await ReportService.getChart(
          'AVG_SEER_REVENUE',
          undefined,
          avgRevenueYear,
        );
        setAvgSeerRevenueData(avgRevenue.data || []);
      } catch (error) {
        console.error('Error fetching avg revenue data:', error);
      }
    };
    fetchAvgRevenueData();
  }, [avgRevenueYear]);

  // Fetch tier distribution chart data
  useEffect(() => {
    const fetchTierData = async () => {
      try {
        const tierData = await ReportService.getAllSeerPerformance({
          page: 1,
          limit: 1000,
          sortBy: 'performancePoint',
          sortType: 'desc',
          year: tierYear,
          month: tierMonth > 0 ? tierMonth : undefined,
        });

        const seerCounts: any = {};
        (tierData.data || []).forEach((seer: any) => {
          seerCounts[seer.performanceTier] = (seerCounts[seer.performanceTier] || 0) + 1;
        });
        setTierDistribution(seerCounts);
      } catch (error) {
        console.error('Error fetching tier data:', error);
      }
    };
    fetchTierData();
  }, [tierYear, tierMonth]);

  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Doanh thu trung bình Seer
            </h2>
            <YearMonthDropdowns
              selectedYear={avgRevenueYear}
              selectedMonth={0}
              onYearChange={setAvgRevenueYear}
              onMonthChange={() => {}}
              showMonthDropdown={false}
            />
          </div>
          <RevenueChart
            data={avgSeerRevenueData}
            year={String(avgRevenueYear)}
            yAxisLabel="Doanh thu TB (VNĐ)"
            formatValue={(val: number) => formatCurrency(val).replace('₫', '').trim()}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Phân phối tier
            </h2>
            <YearMonthDropdowns
              selectedYear={tierYear}
              selectedMonth={tierMonth}
              onYearChange={setTierYear}
              onMonthChange={setTierMonth}
            />
          </div>
          <TierPieChart data={tierDistribution} title="Tier Distribution" />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span>Bảng xếp hạng Seer</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Dựa trên Performance Point và Tier
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Month Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <span>{selectedMonth === 0 ? 'Cả năm' : `Tháng ${selectedMonth}`}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isMonthDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isMonthDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMonthDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                      <button
                        key={month}
                        onClick={() => {
                          setSelectedMonth(month);
                          setIsMonthDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                          selectedMonth === month
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {month === 0 ? 'Cả năm' : `Tháng ${month}`}
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
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <span>Năm {selectedYear}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isYearDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isYearDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsYearDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden">
                    {[2025, 2026, 2024, 2023].map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setIsYearDropdownOpen(false);
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

            <button
              onClick={() => onShowFilter('seer')}
              className="px-3 py-2 text-sm border border-gray-400 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
            </button>

            {Object.keys(seerFilters).length > 0 && (
              <button
                onClick={onClearFilters}
                className="px-3 py-2 text-sm border border-red-300 dark:border-red-600 rounded-lg bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/50 flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="space-y-1">
          {seerRankings.length > 0 ? (
            seerRankings.map((seer) => <RankingItem key={seer.id} item={seer} type="seer" />)
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu cho thời gian này</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-400 dark:border-gray-700 mt-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Trang {seerPage}/{seerTotalPages} • {allSeers.length} seer
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSeerPage((p) => Math.max(1, p - 1))}
              disabled={seerPage === 1}
              className={`p-2 rounded-md transition ${
                seerPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSeerPage((p) => Math.min(seerTotalPages, p + 1))}
              disabled={seerPage >= seerTotalPages}
              className={`p-2 rounded-md transition ${
                seerPage >= seerTotalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
