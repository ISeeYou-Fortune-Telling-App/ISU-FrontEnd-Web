/* eslint-disable react/jsx-no-undef */
'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Award,
  X,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Star,
  Zap,
  Target
} from 'lucide-react';
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
  Legend,
  Cell,
} from 'recharts';
import { ReportService } from '@/services/finance/financeHistory.service';
import RankingItem from '@/components/finance/RankingItem';

const ITEMS_PER_PAGE = 10;

// Utility Functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// --- OPTIMIZED FILTER COMPONENT ---

// 1. Reusable Range Input Component (Clean Code & UI)
const FilterRangeGroup: React.FC<{
  label: string;
  icon: React.ElementType;
  minKey: string;
  maxKey: string;
  onChange: (key: string, value: any) => void;
  suffix?: string;
  placeholder?: string;
}> = ({ label, icon: Icon, minKey, maxKey, onChange, suffix, placeholder }) => {
  
  // Prevent negative inputs
  const handleInput = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange(key, undefined);
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      onChange(key, num);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent typing minus sign
    if (e.key === '-' || e.key === 'e') {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Icon className="w-4 h-4 text-indigo-500" />
        {label}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="number"
            min="0"
            onKeyDown={handleKeyDown}
            onChange={(e) => handleInput(minKey, e)}
            placeholder={placeholder || "Tối thiểu"}
            className="w-full pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
          {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{suffix}</span>}
        </div>
        <span className="text-gray-400">-</span>
        <div className="relative flex-1">
          <input
            type="number"
            min="0"
            onKeyDown={handleKeyDown}
            onChange={(e) => handleInput(maxKey, e)}
            placeholder={placeholder || "Tối đa"}
            className="w-full pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
          {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{suffix}</span>}
        </div>
      </div>
    </div>
  );
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bộ lọc nâng cao</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Tier Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500" />
              Hạng thành viên (Tier)
            </label>
            <select
              onChange={(e) =>
                handleChange(type === 'seer' ? 'performanceTier' : 'potentialTier', e.target.value)
              }
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Tất cả các hạng</option>
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

          <div className="border-t border-gray-100 dark:border-gray-700"></div>

          {/* Section 2: Metrics */}
          {type === 'seer' && (
            <div className="space-y-5">
              <FilterRangeGroup 
                label="Điểm hiệu suất (Performance)"
                icon={Zap}
                minKey="minPerformancePoint"
                maxKey="maxPerformancePoint"
                onChange={handleChange}
                placeholder="0"
                suffix="pts"
              />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Đánh giá tối thiểu
                </div>
                <div className="relative">
                   <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="VD: 4.5"
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                         if (!isNaN(val) && val >= 0 && val <= 5) handleChange('minAvgRating', val);
                         if (e.target.value === '') handleChange('minAvgRating', undefined);
                    }}
                    className="w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">/ 5.0</span>
                </div>
              </div>
            </div>
          )}

          {type === 'customer' && (
            <div className="space-y-5">
              <FilterRangeGroup 
                label="Điểm tiềm năng (Potential)"
                icon={Target}
                minKey="minPotentialPoint"
                maxKey="maxPotentialPoint"
                onChange={handleChange}
                placeholder="0"
                suffix="pts"
              />
              <FilterRangeGroup 
                label="Tổng chi tiêu"
                icon={DollarSign}
                minKey="minTotalSpending"
                maxKey="maxTotalSpending"
                onChange={handleChange}
                placeholder="0"
                suffix="VND"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onApply(filters);
              onClose();
            }}
            className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
};
// --- END OPTIMIZED FILTER COMPONENT ---

// ... [The rest of your file: StatCard, RevenueChart, TierLegendItem, TierPieChart, FinanceDashboard remain the same] ...

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
}> = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-700">
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

const TierPieChart: React.FC<{ data: Record<string, number>; title: string }> = ({ data }) => {
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

const FinanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'seer' | 'customer'>('system');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  
  const [seerSearch, setSeerSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  // Data states
  const [financeStats, setFinanceStats] = useState<any>(null);
  const [revenueChartData, setRevenueChartData] = useState<any[]>([]);
  const [avgSeerRevenueData, setAvgSeerRevenueData] = useState<any[]>([]);
  const [avgCustomerSpendingData, setAvgCustomerSpendingData] = useState<any[]>([]);
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

  // Fetch system charts (System tab)
  useEffect(() => {
    if (activeTab === 'system') {
      const fetchCharts = async () => {
        try {
          const [revenue, avgSeerRevenue, avgCustomerSpending] = await Promise.all([
            ReportService.getChart('TOTAL_REVENUE', undefined, selectedYear),
            ReportService.getChart('AVG_SEER_REVENUE', undefined, selectedYear),
            ReportService.getChart('AVG_CUSTOMER_SPENDING', undefined, selectedYear),
          ]);
          setRevenueChartData(revenue.data || []);
          setAvgSeerRevenueData(avgSeerRevenue.data || []);
          setAvgCustomerSpendingData(avgCustomerSpending.data || []);
        } catch (error) {
          console.error('Error fetching charts:', error);
        }
      };
      fetchCharts();
    }
  }, [activeTab, selectedYear]);

  // Fetch ALL seer rankings (with month filter)
  useEffect(() => {
    if (activeTab === 'seer') {
      const fetchAllSeers = async () => {
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
  }, [activeTab, selectedYear, selectedMonth, seerFilters, seerSearch]);

  // Fetch ALL customer rankings (with month filter)
  useEffect(() => {
    if (activeTab === 'customer') {
      const fetchAllCustomers = async () => {
        try {
          let allCustomersData: any[] = [];
          let page = 1;
          let hasMore = true;

          const monthParam = selectedMonth === 0 ? undefined : selectedMonth;

          while (hasMore) {
            const response = await ReportService.getAllCustomerPotential({
              page,
              limit: 1000,
              sortBy: 'potentialPoint',
              sortType: 'desc',
              year: selectedYear,
              month: monthParam,
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
  }, [activeTab, selectedYear, selectedMonth, customerFilters, customerSearch]);

  // Fetch Pie Chart data
  useEffect(() => {
    const fetchTierData = async () => {
      try {
        const monthParam = selectedMonth === 0 ? undefined : selectedMonth;

        const seerResponse = await ReportService.getAllSeerPerformance({
          page: 1,
          limit: 1000,
          sortBy: 'performancePoint',
          sortType: 'desc',
          year: selectedYear,
          month: monthParam,
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
          month: monthParam,
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
  }, [activeTab, selectedYear, selectedMonth]);

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Lịch sử tài chính
            </h1>
            <p className="text-base font-light text-gray-500 dark:text-gray-400 mt-1">
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
            title="Doanh thu trong ngày"
            value={financeStats ? formatCurrency(financeStats.totalRevenueDay) : '...'}
            icon={Award}
            trend={
              financeStats
                ? `${
                    financeStats.percentChangeTotalRevenueDay > 0 ? '+' : ''
                  }${financeStats.percentChangeTotalRevenueDay.toFixed(1)}%`
                : undefined
            }
          />
        </div>

        <div className="flex space-x-2 border-b border-gray-400 dark:border-gray-700">
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
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Tổng doanh thu
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
                data={revenueChartData}
                year={String(selectedYear)}
                yAxisLabel="Doanh thu (VNĐ)"
                formatValue={(val: number) => formatCurrency(val).replace('₫', '').trim()}
              />
            </div>
          </div>
        )}

        {activeTab === 'seer' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Doanh thu trung bình Seer
                  </h2>
                  <div className="flex space-x-2">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-3 py-1.5 text-sm border border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    >
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                    </select>
                  </div>
                </div>
                <RevenueChart
                  data={avgSeerRevenueData}
                  year={String(selectedYear)}
                  yAxisLabel="Doanh thu TB (VNĐ)"
                  formatValue={(val: number) => formatCurrency(val).replace('₫', '').trim()}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Phân phối tier
                    </h2>
                </div>
                <TierPieChart data={tierDistribution.seer} title="Tier Distribution" />
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
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="2025">Năm 2025</option>
                    <option value="2024">Năm 2024</option>
                    <option value="2023">Năm 2023</option>
                  </select>

                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="pl-9 pr-8 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer"
                    >
                        <option value={0}>Cả năm</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>Tháng {m}</option>
                        ))}
                    </select>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={seerSearch}
                      onChange={(e) => {
                        setSeerSearch(e.target.value);
                      }}
                      className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-40 md:w-auto"
                    />
                  </div>
                  <button
                    onClick={() => setShowAdvancedFilter(true)}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Chi tiêu trung bình khách hàng
                  </h2>
                  <div className="flex space-x-2">
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
                </div>
                <RevenueChart
                  data={avgCustomerSpendingData}
                  year={String(selectedYear)}
                  yAxisLabel="Chi tiêu TB (VNĐ)"
                  formatValue={(val: number) => formatCurrency(val).replace('₫', '').trim()}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Phân phối tier
                </h2>
                <TierPieChart data={tierDistribution.customer} title="Customer Tier" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    <span>Bảng xếp hạng Customer</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Dựa trên Potential Point và Tier
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="2025">Năm 2025</option>
                    <option value="2024">Năm 2024</option>
                    <option value="2023">Năm 2023</option>
                  </select>

                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="pl-9 pr-8 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer"
                    >
                        <option value={0}>Cả năm</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>Tháng {m}</option>
                        ))}
                    </select>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                      }}
                      className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-40 md:w-auto"
                    />
                  </div>
                  <button
                    onClick={() => setShowAdvancedFilter(true)}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
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
                    <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu cho thời gian này</p>
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