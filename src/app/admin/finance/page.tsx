/* eslint-disable react/jsx-no-undef */
'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Award,
  Users,
  X,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ReportService } from '@/services/finance/financeHistory.service';
import RankingItem from '@/components/finance/RankingItem';

const ITEMS_PER_PAGE = 10;

// Utility Functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const AdvancedFilterModal: React.FC<{
  onClose: () => void;
  onApply: (filters: any) => void;
  type: 'seer' | 'customer';
}> = ({ onClose, onApply, type }) => {
  const [filters, setFilters] = useState<any>({});

  const handleChange = (key: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Bộ lọc nâng cao</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Tier</label>
            <select
              onChange={(e) =>
                handleChange(type === 'seer' ? 'performanceTier' : 'potentialTier', e.target.value)
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Tất cả</option>
              {type === 'seer' ? (
                <>
                  <option value="MASTER">Master</option>
                  <option value="EXPERT">Expert</option>
                  <option value="PROFESSIONAL">Professional</option>
                  <option value="APPRENTICE">Apprentice</option>
                </>
              ) : (
                <>
                  <option value="VIP">VIP</option>
                  <option value="PREMIUM">Premium</option>
                  <option value="STANDARD">Standard</option>
                  <option value="CASUAL">Casual</option>
                </>
              )}
            </select>
          </div>

          {type === 'seer' && (
            <>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                  Performance Point (min - max)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    onChange={(e) =>
                      handleChange(
                        'minPerformancePoint',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    onChange={(e) =>
                      handleChange(
                        'maxPerformancePoint',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                  Đánh giá (min)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.0"
                  onChange={(e) =>
                    handleChange(
                      'minAvgRating',
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </>
          )}

          {type === 'customer' && (
            <>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                  Potential Point (min - max)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    onChange={(e) =>
                      handleChange(
                        'minPotentialPoint',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    onChange={(e) =>
                      handleChange(
                        'maxPotentialPoint',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                  Tổng chi tiêu (min - max)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    onChange={(e) =>
                      handleChange(
                        'minTotalSpending',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    onChange={(e) =>
                      handleChange(
                        'maxTotalSpending',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                onApply(filters);
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
}> = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <Icon className="w-5 h-5 text-indigo-500" />
    </div>
    <div className="flex flex-col items-start mt-3">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {trend && (
        <div className="flex items-center space-x-1 mt-2">
          <TrendingUp className="w-3.5 h-3.5 text-green-500" />
          <span className="text-xs font-semibold text-green-500">{trend}</span>
        </div>
      )}
    </div>
  </div>
);

const RevenueChart: React.FC<{
  data: any[];
  year: string;
  title?: string;
  yAxisLabel?: string;
  formatValue?: (val: number) => string;
}> = ({
  data,
  year,
  title,
  yAxisLabel = 'Giá trị',
  formatValue = (val) => val.toLocaleString('vi-VN'),
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    month: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

  const dataMap = data.reduce((acc: any, item: any) => {
    acc[item.label] = item.value;
    return acc;
  }, {});

  const values = months.map((_, idx) => {
    const monthKey = String(idx + 1);
    return dataMap[monthKey] !== undefined ? dataMap[monthKey] : 0;
  });

  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values.filter((v) => v > 0), 0);

  const yAxisSteps = 4;
  const stepValue = maxValue / yAxisSteps;

  return (
    <div className="relative w-full h-80 mt-6">
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {yAxisLabel}
        </span>
      </div>

      <div className="absolute left-8 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-3">
        {Array.from({ length: yAxisSteps + 1 }).map((_, i) => {
          const value = maxValue - i * stepValue;
          return (
            <span key={i} className="text-right min-w-[60px]">
              {formatValue(value)}
            </span>
          );
        })}
      </div>

      <div className="ml-28 relative w-[calc(100%-7.5rem)] h-[calc(100%-2rem)]">
        <div className="absolute inset-0 grid grid-rows-4 border-l border-b border-gray-300 dark:border-gray-700">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-t border-gray-200 dark:border-gray-700"></div>
          ))}
        </div>

        <svg
          className="w-full h-full relative z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>

          <polygon
            fill="url(#gradient)"
            points={values
              .map((v, i) => {
                const x = (i / (months.length - 1)) * 100;
                const y = 100 - ((v - minValue) / (maxValue - minValue || 1)) * 95;
                return `${x},${y}`;
              })
              .concat(['100,100', '0,100'])
              .join(' ')}
          />

          <polyline
            fill="none"
            stroke="#6366f1"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            points={values
              .map((v, i) => {
                const x = (i / (months.length - 1)) * 100;
                const y = 100 - ((v - minValue) / (maxValue - minValue || 1)) * 95;
                return `${x},${y}`;
              })
              .join(' ')}
          />
        </svg>

        <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none">
          {values.map((v, i) => {
            const xPercent = (i / (months.length - 1)) * 100;
            const yPercent = 100 - ((v - minValue) / (maxValue - minValue || 1)) * 95;
            return (
              <circle
                key={i}
                cx={`${xPercent}%`}
                cy={`${yPercent}%`}
                r="4"
                fill="white"
                stroke="#6366f1"
                strokeWidth="2"
                className="pointer-events-auto cursor-pointer transition-all hover:r-6"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoveredPoint({
                    month: months[i],
                    value: v,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  });
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}
        </svg>

        <div className="absolute -bottom-8 left-0 w-full flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
          {months.map((m, i) => (
            <span key={i} className="text-center flex-1">
              {m}
            </span>
          ))}
        </div>
      </div>

      {hoveredPoint && (
        <div
          className="fixed z-50 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2"
          style={{
            left: hoveredPoint.x,
            top: hoveredPoint.y,
          }}
        >
          <div className="font-semibold">{hoveredPoint.month}</div>
          <div className="text-indigo-300">{formatValue(hoveredPoint.value)}</div>
        </div>
      )}
    </div>
  );
};

const PieChart: React.FC<{ data: Record<string, number>; title: string }> = ({ data, title }) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  if (total === 0 || Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Chưa có dữ liệu</p>
      </div>
    );
  }

  let currentAngle = 0;

  const colors: Record<string, string> = {
    MASTER: '#06b6d4',
    EXPERT: '#a855f7',
    PROFESSIONAL: '#eab308',
    APPRENTICE: '#9ca3af',
    VIP: '#eab308',
    PREMIUM: '#a855f7',
    STANDARD: '#9ca3af',
    CASUAL: '#d1d5db',
  };

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="mb-4">
        {Object.entries(data).map(([key, value], idx) => {
          const percentage = (value / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;

          const x1 = 100 + 90 * Math.cos((Math.PI * startAngle) / 180);
          const y1 = 100 + 90 * Math.sin((Math.PI * startAngle) / 180);
          const x2 = 100 + 90 * Math.cos((Math.PI * endAngle) / 180);
          const y2 = 100 + 90 * Math.sin((Math.PI * endAngle) / 180);
          const largeArc = angle > 180 ? 1 : 0;

          return (
            <path
              key={idx}
              d={`M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={colors[key] || '#9ca3af'}
              className="transition-opacity hover:opacity-80"
            />
          );
        })}
      </svg>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => {
          const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

          return (
            <div key={key} className="flex items-center space-x-2 text-sm">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors[key] || '#9ca3af' }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300">
                {key}: {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FinanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'seer' | 'customer'>('system');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [seerSearch, setSeerSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  // Data states
  const [financeStats, setFinanceStats] = useState<any>(null);
  const [revenueChartData, setRevenueChartData] = useState<any[]>([]);
  const [bookingRequestChartData, setBookingRequestChartData] = useState<any[]>([]);
  const [bookingCompleteChartData, setBookingCompleteChartData] = useState<any[]>([]);
  const [packagesChartData, setPackagesChartData] = useState<any[]>([]);
  const [seerFilters, setSeerFilters] = useState<any>({});
  const [customerFilters, setCustomerFilters] = useState<any>({});
  const [tierDistribution, setTierDistribution] = useState<any>({ seer: {}, customer: {} });

  // Client-side pagination states
  const [allSeers, setAllSeers] = useState<any[]>([]);
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [seerPage, setSeerPage] = useState(1);
  const [customerPage, setCustomerPage] = useState(1);

  // Derived data for current page
  const seerRankings = allSeers.slice((seerPage - 1) * ITEMS_PER_PAGE, seerPage * ITEMS_PER_PAGE);
  const customerRankings = allCustomers.slice(
    (customerPage - 1) * ITEMS_PER_PAGE,
    customerPage * ITEMS_PER_PAGE,
  );
  const seerTotalPages = Math.ceil(allSeers.length / ITEMS_PER_PAGE);
  const customerTotalPages = Math.ceil(allCustomers.length / ITEMS_PER_PAGE);

  // Fetch finance statistics
  useEffect(() => {
    const fetchFinanceStats = async () => {
      try {
        const response = await ReportService.getFinanceStatistic();
        setFinanceStats(response.data);
      } catch (error) {
        console.error('Error fetching finance stats:', error);
      }
    };
    fetchFinanceStats();
  }, []);

  // Fetch system charts
  useEffect(() => {
    if (activeTab === 'system') {
      const fetchCharts = async () => {
        try {
          const [revenue, bookingReq, bookingComp, packages] = await Promise.all([
            ReportService.getChart('TOTAL_REVENUE', undefined, selectedYear),
            ReportService.getChart('TOTAL_BOOKING_REQUESTS', undefined, selectedYear),
            ReportService.getChart('TOTAL_BOOKING_COMPLETED', undefined, selectedYear),
            ReportService.getChart('TOTAL_PACKAGES', undefined, selectedYear),
          ]);
          setRevenueChartData(revenue.data || []);
          setBookingRequestChartData(bookingReq.data || []);
          setBookingCompleteChartData(bookingComp.data || []);
          setPackagesChartData(packages.data || []);
        } catch (error) {
          console.error('Error fetching charts:', error);
        }
      };
      fetchCharts();
    }
  }, [activeTab, selectedYear]);

  // Fetch ALL seer rankings (client-side pagination)
  useEffect(() => {
    if (activeTab === 'seer') {
      const fetchAllSeers = async () => {
        try {
          let allSeersData: any[] = [];
          let page = 1;
          let hasMore = true;

          while (hasMore) {
            const response = await ReportService.getAllSeerPerformance({
              page,
              limit: 1000,
              sortBy: 'performancePoint',
              sortType: 'desc',
              year: selectedYear,
              ...seerFilters,
              searchText: seerSearch || undefined,
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
            id: seer.seerId,
            name: seer.fullName || 'N/A',
            avatar: seer.avatarUrl || `https://i.pravatar.cc/150?u=${seer.seerId}`,
            performance: seer.performancePoint,
            ranking: seer.ranking,
            tier: seer.performanceTier,
            revenue: formatCurrency(seer.totalRevenue),
            sessions: seer.completedBookings,
            avgRating: seer.avgRating,
            ...seer,
          }));

          setAllSeers(mappedSeers);
          setSeerPage(1); // Reset to first page
        } catch (error) {
          console.error('Error fetching seer rankings:', error);
          setAllSeers([]);
        }
      };
      fetchAllSeers();
    }
  }, [activeTab, selectedYear, seerFilters, seerSearch]);

  // Fetch ALL customer rankings (client-side pagination)
  useEffect(() => {
    if (activeTab === 'customer') {
      const fetchAllCustomers = async () => {
        try {
          let allCustomersData: any[] = [];
          let page = 1;
          let hasMore = true;

          while (hasMore) {
            const response = await ReportService.getAllCustomerPotential({
              page,
              limit: 1000,
              sortBy: 'potentialPoint',
              sortType: 'desc',
              year: selectedYear,
              ...customerFilters,
              searchText: customerSearch || undefined,
            });

            const customersData = response.data || [];
            allCustomersData = [...allCustomersData, ...customersData];

            const totalPages = response.paging?.totalPages || 1;
            if (page >= totalPages) {
              hasMore = false;
            } else {
              page++;
            }
          }

          const mappedCustomers = allCustomersData.map((customer: any) => ({
            id: customer.customerId,
            name: customer.fullName || 'N/A',
            avatar: customer.avatarUrl || `https://i.pravatar.cc/150?u=${customer.customerId}`,
            potential: customer.potentialPoint,
            ranking: customer.ranking,
            tier: customer.potentialTier,
            spending: formatCurrency(customer.totalSpending),
            sessions: customer.totalBookingRequests,
            ...customer,
          }));

          setAllCustomers(mappedCustomers);
          setCustomerPage(1); // Reset to first page
        } catch (error) {
          console.error('Error fetching customer rankings:', error);
          setAllCustomers([]);
        }
      };
      fetchAllCustomers();
    }
  }, [activeTab, selectedYear, customerFilters, customerSearch]);

  // Fetch Pie Chart data - KEEP ORIGINAL
  useEffect(() => {
    const fetchTierData = async () => {
      try {
        const seerResponse = await ReportService.getAllSeerPerformance({
          page: 1,
          limit: 1000,
          sortBy: 'performancePoint',
          sortType: 'desc',
          year: selectedYear,
        });

        const seerCounts: any = {};
        (seerResponse.data || []).forEach((seer: any) => {
          seerCounts[seer.performanceTier] = (seerCounts[seer.performanceTier] || 0) + 1;
        });

        const customerResponse = await ReportService.getAllCustomerPotential({
          page: 1,
          limit: 1000,
          sortBy: 'potentialPoint',
          sortType: 'desc',
          year: selectedYear,
        });

        const customerCounts: any = {};
        (customerResponse.data || []).forEach((customer: any) => {
          customerCounts[customer.potentialTier] =
            (customerCounts[customer.potentialTier] || 0) + 1;
        });

        setTierDistribution({ seer: seerCounts, customer: customerCounts });
      } catch (error) {
        console.error('Error fetching tier distribution:', error);
      }
    };

    if (activeTab === 'seer' || activeTab === 'customer') {
      fetchTierData();
    }
  }, [activeTab, selectedYear]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lịch sử tài chính</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Quản lý và theo dõi các chỉ số tài chính
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Tổng doanh thu"
            value={financeStats ? formatCurrency(financeStats.totalRevenue) : '...'}
            icon={DollarSign}
            trend={
              financeStats
                ? `${
                    financeStats.percentChangeTotalRevenue > 0 ? '+' : ''
                  }${financeStats.percentChangeTotalRevenue.toFixed(1)}%`
                : undefined
            }
          />
          <StatCard
            title="Doanh thu ròng"
            value={financeStats ? formatCurrency(financeStats.totalNet) : '...'}
            icon={TrendingUp}
            trend={
              financeStats
                ? `${
                    financeStats.percentChangeTotalNet > 0 ? '+' : ''
                  }${financeStats.percentChangeTotalNet.toFixed(1)}%`
                : undefined
            }
          />
          <StatCard
            title="Tổng thuế (7%)"
            value={financeStats ? formatCurrency(financeStats.totalTax) : '...'}
            icon={Award}
            trend={
              financeStats
                ? `${
                    financeStats.percentChangeTotalTax > 0 ? '+' : ''
                  }${financeStats.percentChangeTotalTax.toFixed(1)}%`
                : undefined
            }
          />
          <StatCard
            title="Người dùng hoạt động"
            value={financeStats ? `${financeStats.activeUsers || 0}` : '...'}
            icon={Users}
          />
        </div>

        <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'system'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Doanh thu Hệ thống
          </button>
          <button
            onClick={() => setActiveTab('seer')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'seer'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Hiệu suất tiên tri
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'customer'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Tiềm năng khách hàng
          </button>
        </div>

        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Tổng doanh thu',
                data: revenueChartData,
                yAxisLabel: 'Doanh thu (VNĐ)',
                formatValue: (val: number) => formatCurrency(val).replace('₫', '').trim(),
              },
              {
                title: 'Tổng booking requests',
                data: bookingRequestChartData,
                yAxisLabel: 'Số lượng booking',
                formatValue: (val: number) => Math.round(val).toLocaleString('vi-VN'),
              },
              {
                title: 'Tổng booking complete',
                data: bookingCompleteChartData,
                yAxisLabel: 'Số lượng hoàn thành',
                formatValue: (val: number) => Math.round(val).toLocaleString('vi-VN'),
              },
              {
                title: 'Tổng gói dịch vụ',
                data: packagesChartData,
                yAxisLabel: 'Số gói',
                formatValue: (val: number) => Math.round(val).toLocaleString('vi-VN'),
              },
            ].map((chart, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {chart.title}
                  </h2>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                  >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
                <RevenueChart
                  data={chart.data}
                  year={String(selectedYear)}
                  yAxisLabel={chart.yAxisLabel}
                  formatValue={chart.formatValue}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'seer' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Phân phối tier giữa các seer
                </h2>
                <PieChart data={tierDistribution.seer} title="Tier Distribution" />
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Thống kê tổng quan
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tổng seer</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {allSeers.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Hiển thị</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {seerRankings.length} / {allSeers.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tổng trang</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {seerTotalPages}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span>Bảng xếp hạng Seer</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Dựa trên Performance Point và Tier
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên..."
                      value={seerSearch}
                      onChange={(e) => {
                        setSeerSearch(e.target.value);
                      }}
                      className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={() => setShowAdvancedFilter(true)}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Bộ lọc</span>
                  </button>

                  {(seerSearch || Object.keys(seerFilters).length > 0) && (
                    <button
                      onClick={() => {
                        setSeerSearch('');
                        setSeerFilters({}); 
                      }}
                      className="px-3 py-2 text-sm border border-red-300 dark:border-red-600 rounded-lg bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/50 flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Xóa lọc</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                {seerRankings.length > 0 ? (
                  seerRankings.map((seer) => <RankingItem key={seer.id} item={seer} type="seer" />)
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Hiển thị trang {seerPage} / {seerTotalPages} (Tổng: {allSeers.length})
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSeerPage((p) => Math.max(1, p - 1))}
                    disabled={seerPage === 1}
                    className="p-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSeerPage((p) => Math.min(seerTotalPages, p + 1))}
                    disabled={seerPage >= seerTotalPages}
                    className="p-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customer' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Phân phối tier giữa các khách hàng
                </h2>
                <PieChart data={tierDistribution.customer} title="Customer Tier" />
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Thống kê tổng quan
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Tổng khách hàng
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {allCustomers.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Hiển thị</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {customerRankings.length} / {allCustomers.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tổng trang</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {customerTotalPages}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    <span>Bảng xếp hạng Customer</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Dựa trên Potential Point và Tier
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên..."
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                      }}
                      className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={() => setShowAdvancedFilter(true)}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Bộ lọc</span>
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                {customerRankings.length > 0 ? (
                  customerRankings.map((customer) => (
                    <RankingItem key={customer.id} item={customer} type="customer" />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Hiển thị trang {customerPage} / {customerTotalPages} (Tổng: {allCustomers.length})
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCustomerPage((p) => Math.max(1, p - 1))}
                    disabled={customerPage === 1}
                    className="p-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCustomerPage((p) => Math.min(customerTotalPages, p + 1))}
                    disabled={customerPage >= customerTotalPages}
                    className="p-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAdvancedFilter && (
        <AdvancedFilterModal
          type={activeTab === 'seer' ? 'seer' : 'customer'}
          onClose={() => setShowAdvancedFilter(false)}
          onApply={(filters) => {
            if (activeTab === 'seer') {
              setSeerFilters(filters);
            } else {
              setCustomerFilters(filters);
            }
          }}
        />
      )}
    </div>
  );
};

export default FinanceDashboard;
