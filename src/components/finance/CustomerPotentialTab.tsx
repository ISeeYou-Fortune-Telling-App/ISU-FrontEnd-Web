/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Award, X, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReportService } from '@/services/finance/financeHistory.service';
import RankingItem from '@/components/finance/RankingItem';
import { RevenueChart, TierPieChart } from '@/components/finance/SharedChartComponents';
import { YearMonthDropdowns } from '@/components/finance/ChartDropdowns';
import { YearDropdown, MonthDropdown } from '@/components/finance/UnifiedDropdown';

const ITEMS_PER_PAGE = 10;

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

interface CustomerPotentialTabProps {
  onShowFilter: (type: 'customer') => void;
  customerFilters: any;
  onClearFilters: () => void;
}

export const CustomerPotentialTab: React.FC<CustomerPotentialTabProps> = ({
  onShowFilter,
  customerFilters,
  onClearFilters,
}) => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(0);

  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [customerPage, setCustomerPage] = useState(1);
  const [isFetchingCustomers, setIsFetchingCustomers] = useState(false);

  // Chart 1: Avg Spending (Line Chart) - only year
  const [avgSpendingYear, setAvgSpendingYear] = useState(2025);
  const [avgCustomerSpendingData, setAvgCustomerSpendingData] = useState<any[]>([]);

  // Chart 2: Tier Distribution - separate state
  const [tierYear, setTierYear] = useState(2025);
  const [tierMonth, setTierMonth] = useState(0);
  const [tierDistribution, setTierDistribution] = useState<any>({});
  const [isFetchingTierData, setIsFetchingTierData] = useState(false);

  const customerRankings = allCustomers.slice(
    (customerPage - 1) * ITEMS_PER_PAGE,
    customerPage * ITEMS_PER_PAGE,
  );
  const customerTotalPages = Math.ceil(allCustomers.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchAllCustomers = async () => {
      setIsFetchingCustomers(true);
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
          customerId: customer.customerId,
          name: customer.fullName || 'N/A',
          avatar: customer.avatarUrl || '/default_avatar.jpg',
          potential: customer.potentialPoint,
          ranking: customer.ranking,
          tier: customer.potentialTier,
          spending: formatCurrency(customer.totalSpending),
          sessions: customer.totalBookingRequests,
          month: selectedMonth === 0 ? new Date().getMonth() + 1 : selectedMonth,
          year: selectedYear,
          ...customer,
        }));

        setAllCustomers(mappedCustomers);
        setCustomerPage(1);
      } catch (error) {
        console.error('Error fetching customer rankings:', error);
        setAllCustomers([]);
      } finally {
        setIsFetchingCustomers(false);
      }
    };
    fetchAllCustomers();
  }, [selectedYear, selectedMonth, customerFilters]);

  // Fetch avg spending chart data
  useEffect(() => {
    const fetchAvgSpendingData = async () => {
      try {
        const avgSpending = await ReportService.getChart(
          'AVG_CUSTOMER_SPENDING',
          undefined,
          avgSpendingYear,
        );
        setAvgCustomerSpendingData(avgSpending.data || []);
      } catch (error) {
        console.error('Error fetching avg spending data:', error);
      }
    };
    fetchAvgSpendingData();
  }, [avgSpendingYear]);

  // Fetch tier distribution chart data
  useEffect(() => {
    const fetchTierData = async () => {
      setIsFetchingTierData(true);
      try {
        const tierData = await ReportService.getAllCustomerPotential({
          page: 1,
          limit: 1000,
          sortBy: 'potentialPoint',
          sortType: 'desc',
          year: tierYear,
          month: tierMonth > 0 ? tierMonth : undefined,
        });

        const customerCounts: any = {};
        (tierData.data || []).forEach((customer: any) => {
          customerCounts[customer.potentialTier] =
            (customerCounts[customer.potentialTier] || 0) + 1;
        });
        setTierDistribution(customerCounts);
      } catch (error) {
        console.error('Error fetching tier data:', error);
      } finally {
        setIsFetchingTierData(false);
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
              Chi tiêu trung bình khách hàng
            </h2>
            <YearMonthDropdowns
              selectedYear={avgSpendingYear}
              selectedMonth={0}
              onYearChange={setAvgSpendingYear}
              onMonthChange={() => {}}
              showMonthDropdown={false}
            />
          </div>
          <RevenueChart
            data={avgCustomerSpendingData}
            year={String(avgSpendingYear)}
            yAxisLabel="Chi tiêu TB (VNĐ)"
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
          {isFetchingTierData ? (
            <div className="flex items-center justify-center h-64">
              <div className="inline-flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</span>
              </div>
            </div>
          ) : (
            <TierPieChart data={tierDistribution} title="Tier Distribution" />
          )}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-400 dark:border-gray-700">
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
            {/* Month Dropdown */}
            <MonthDropdown value={selectedMonth} onChange={setSelectedMonth} className="w-32" />

            {/* Year Dropdown */}
            <YearDropdown value={selectedYear} onChange={setSelectedYear} className="w-32" />

            <button
              onClick={() => onShowFilter('customer')}
              className="px-3 py-2 text-sm border border-gray-400 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
            </button>

            {Object.keys(customerFilters).length > 0 && (
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
          {isFetchingCustomers ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</span>
              </div>
            </div>
          ) : customerRankings.length > 0 ? (
            customerRankings.map((customer) => (
              <RankingItem key={customer.id} item={customer} type="customer" />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu cho thời gian này</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-400 dark:border-gray-700 mt-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Trang {customerPage}/{customerTotalPages} • {allCustomers.length} khách hàng
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCustomerPage((p) => Math.max(1, p - 1))}
              disabled={customerPage === 1}
              className={`p-2 rounded-md transition ${
                customerPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCustomerPage((p) => Math.min(customerTotalPages, p + 1))}
              disabled={customerPage >= customerTotalPages}
              className={`p-2 rounded-md transition ${
                customerPage >= customerTotalPages
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
