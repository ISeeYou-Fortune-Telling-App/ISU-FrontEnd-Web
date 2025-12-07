/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Award,
  X,
  Filter,
  Star,
  Zap,
  Target,
} from 'lucide-react';
import { ReportService } from '@/services/finance/financeHistory.service';
import { SystemRevenueTab } from '@/components/finance/SystemRevenueTab';
import { SeerPerformanceTab } from '@/components/finance/SeerPerformanceTab';
import { CustomerPotentialTab } from '@/components/finance/CustomerPotentialTab';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Filter Modal Component
const FilterRangeGroup: React.FC<{
  label: string;
  icon: React.ElementType;
  minKey: string;
  maxKey: string;
  onChange: (key: string, value: any) => void;
  suffix?: string;
  placeholder?: string;
}> = ({ label, icon: Icon, minKey, maxKey, onChange, suffix, placeholder }) => {
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
            placeholder={placeholder || 'Tối thiểu'}
            className="w-full pl-3 pr-8 py-2 border border-gray-400 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {suffix}
            </span>
          )}
        </div>
        <span className="text-gray-400">-</span>
        <div className="relative flex-1">
          <input
            type="number"
            min="0"
            onKeyDown={handleKeyDown}
            onChange={(e) => handleInput(maxKey, e)}
            placeholder={placeholder || 'Tối đa'}
            className="w-full pl-3 pr-8 py-2 border border-gray-400 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {suffix}
            </span>
          )}
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

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500" />
              Hạng thành viên (Tier)
            </label>
            <select
              onChange={(e) =>
                handleChange(type === 'seer' ? 'performanceTier' : 'potentialTier', e.target.value)
              }
              className="w-full p-2.5 border border-gray-400 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
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
                    className="w-full pl-3 pr-3 py-2 border border-gray-400 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    / 5.0
                  </span>
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

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-400 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
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

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
}> = ({ title, value, icon: Icon, trend }) => {
  const isPositive = trend ? parseFloat(trend) >= 0 : true;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <Icon className="w-5 h-5 text-indigo-500" />
      </div>
      <div className="flex flex-col items-start mt-3">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {trend && (
          <div className="flex items-center space-x-1 mt-2">
            <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
            <span className={`text-xs font-semibold ${trendColor}`}>
              {trend} so với tháng trước
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const FinanceDashboardContent: React.FC = () => {
  // Read tab from URL - will update when URL changes
  const [activeTab, setActiveTab] = useState<'system' | 'seer' | 'customer'>('system');

  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filterType, setFilterType] = useState<'seer' | 'customer'>('seer');

  const [seerFilters, setSeerFilters] = useState<any>({});
  const [customerFilters, setCustomerFilters] = useState<any>({});

  const [financeStats, setFinanceStats] = useState<any>(null);

  // Update tab from URL on mount and when URL changes
  useEffect(() => {
    const updateTabFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'seer' || tab === 'customer' || tab === 'system') {
        setActiveTab(tab);
      } else {
        setActiveTab('system');
      }
    };

    // Set initial tab
    updateTabFromUrl();

    // Listen for URL changes (for browser back/forward)
    window.addEventListener('popstate', updateTabFromUrl);

    return () => {
      window.removeEventListener('popstate', updateTabFromUrl);
    };
  }, []);

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

        {activeTab === 'system' && <SystemRevenueTab />}

        {activeTab === 'seer' && (
          <SeerPerformanceTab
            onShowFilter={(type) => {
              setFilterType(type);
              setShowAdvancedFilter(true);
            }}
            seerFilters={seerFilters}
            onClearFilters={() => setSeerFilters({})}
          />
        )}

        {activeTab === 'customer' && (
          <CustomerPotentialTab
            onShowFilter={(type) => {
              setFilterType(type);
              setShowAdvancedFilter(true);
            }}
            customerFilters={customerFilters}
            onClearFilters={() => setCustomerFilters({})}
          />
        )}
      </div>

      {showAdvancedFilter && (
        <AdvancedFilterModal
          type={filterType}
          onClose={() => setShowAdvancedFilter(false)}
          onApply={(filters) => {
            if (filterType === 'seer') {
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

const FinanceDashboard: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Đang tải...</p>
        </div>
      }
    >
      <FinanceDashboardContent />
    </Suspense>
  );
};

export default FinanceDashboard;
