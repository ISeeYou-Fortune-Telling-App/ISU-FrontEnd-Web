'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { TrendingUp, DollarSign, Award, Users, ChevronRight, Gift, Eye, X } from 'lucide-react';

// Dummy Data
const REVENUE_DATA_MONTHLY = {
  '2025': {
    '1': 45000000,
    '2': 48000000,
    '3': 52000000,
    '4': 49000000,
    '5': 55000000,
    '6': 58000000,
    '7': 62000000,
    '8': 65000000,
    '9': 0,
    '10': 0,
    '11': 0,
    '12': 0,
  },
  '2024': {
    '1': 35000000,
    '2': 38000000,
    '3': 42000000,
    '4': 39000000,
    '5': 45000000,
    '6': 48000000,
    '7': 52000000,
    '8': 55000000,
    '9': 58000000,
    '10': 61000000,
    '11': 64000000,
    '12': 67000000,
  },
};

const SEER_REVENUE_DATA = {
  'seer-1': { name: 'Thầy Minh Tuệ', data: REVENUE_DATA_MONTHLY },
  'seer-2': { name: 'Cô Thanh Lan', data: REVENUE_DATA_MONTHLY },
  'seer-3': { name: 'A. Thắng', data: REVENUE_DATA_MONTHLY },
};

const CUSTOMER_SPENDING_DATA = {
  'customer-1': { name: 'Nguyễn Thị Mai', data: REVENUE_DATA_MONTHLY },
  'customer-2': { name: 'Trần Văn Nam', data: REVENUE_DATA_MONTHLY },
};

const SEER_RANKINGS = [
  {
    id: 'seer-1',
    name: 'Thầy Minh Tuệ',
    performance: 4850,
    tier: 'Diamond',
    revenue: '65.000.000 VNĐ',
    sessions: 156,
  },
  {
    id: 'seer-2',
    name: 'Cô Thanh Lan',
    performance: 4620,
    tier: 'Diamond',
    revenue: '58.000.000 VNĐ',
    sessions: 142,
  },
  {
    id: 'seer-3',
    name: 'A. Thắng',
    performance: 4350,
    tier: 'Platinum',
    revenue: '52.000.000 VNĐ',
    sessions: 128,
  },
  {
    id: 'seer-4',
    name: 'Chị Hằng',
    performance: 4120,
    tier: 'Platinum',
    revenue: '48.000.000 VNĐ',
    sessions: 115,
  },
  {
    id: 'seer-5',
    name: 'Em Thảo',
    performance: 3890,
    tier: 'Gold',
    revenue: '42.000.000 VNĐ',
    sessions: 98,
  },
];

const CUSTOMER_RANKINGS = [
  {
    id: 'customer-1',
    name: 'Nguyễn Thị Mai',
    potential: 3650,
    tier: 'VIP Gold',
    spending: '8.500.000 VNĐ',
    sessions: 28,
  },
  {
    id: 'customer-2',
    name: 'Trần Văn Nam',
    potential: 3420,
    tier: 'VIP Gold',
    spending: '7.200.000 VNĐ',
    sessions: 24,
  },
  {
    id: 'customer-3',
    name: 'Lê Hoàng Anh',
    potential: 3180,
    tier: 'VIP Silver',
    spending: '6.100.000 VNĐ',
    sessions: 20,
  },
  {
    id: 'customer-4',
    name: 'Phạm Thị Lan',
    potential: 2950,
    tier: 'VIP Silver',
    spending: '5.300.000 VNĐ',
    sessions: 18,
  },
  {
    id: 'customer-5',
    name: 'Võ Minh Tuấn',
    potential: 2720,
    tier: 'Regular',
    spending: '4.500.000 VNĐ',
    sessions: 15,
  },
];

// Utility Functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const SeerDetailModal: React.FC<{ seer: any; onClose: () => void }> = ({ seer, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Eye className="w-5 h-5 text-indigo-500" />
          <span>Chi tiết hiệu suất Seer</span>
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <p>
          <b>Tên:</b> {seer.name}
        </p>
        <p>
          <b>Tier hiện tại:</b> {seer.tier}
        </p>
        <p>
          <b>Performance Point:</b> {seer.performance}
        </p>
        <p>
          <b>Doanh thu tháng:</b> {seer.revenue}
        </p>
        <p>
          <b>Hoàn thành booking:</b> {Math.floor(Math.random() * 150)}
        </p>
        <p>
          <b>Tỷ lệ hủy:</b> {Math.floor(Math.random() * 10)}%
        </p>
        <p>
          <b>Đánh giá trung bình:</b> {(4 + Math.random()).toFixed(2)}/5 ⭐
        </p>
      </div>
    </div>
  </div>
);

const CustomerDetailModal: React.FC<{ customer: any; onClose: () => void }> = ({
  customer,
  onClose,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Eye className="w-5 h-5 text-purple-500" />
          <span>Chi tiết khách hàng</span>
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <p>
          <b>Tên:</b> {customer.name}
        </p>
        <p>
          <b>Tier:</b> {customer.tier}
        </p>
        <p>
          <b>Điểm tiềm năng:</b> {customer.potential}
        </p>
        <p>
          <b>Tổng chi tiêu:</b> {customer.spending}
        </p>
        <p>
          <b>Số booking:</b> {customer.sessions}
        </p>
        <p>
          <b>Đã hủy:</b> {Math.floor(Math.random() * 5)}
        </p>
      </div>
    </div>
  </div>
);

const getTierColor = (tier: string) => {
  const colors: Record<string, string> = {
    Diamond: 'bg-cyan-500',
    Platinum: 'bg-purple-500',
    Gold: 'bg-yellow-500',
    'VIP Gold': 'bg-yellow-500',
    'VIP Silver': 'bg-gray-400',
    Regular: 'bg-gray-300',
  };
  return colors[tier] || 'bg-gray-300';
};

// Components
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

const RevenueChart: React.FC<{ data: Record<string, number>; year: string; month?: string }> = ({
  data,
  year,
  month,
}) => {
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  const values = Object.values(data);
  const maxValue = Math.max(...values, 1);

  return (
    <div className="relative w-full h-48 mt-4">
      {/* Lưới nền */}
      <div className="absolute inset-0 grid grid-rows-4 border-l border-b border-gray-300 dark:border-gray-700">
        <div className="border-t border-gray-200 dark:border-gray-700"></div>
        <div className="border-t border-gray-200 dark:border-gray-700"></div>
        <div className="border-t border-gray-200 dark:border-gray-700"></div>
      </div>

      {/* Đường line */}
      <svg className="w-full h-full relative z-10">
        <polyline
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          strokeLinecap="round"
          points={values
            .map((v, i) => {
              const x = (i / (months.length - 1)) * 100;
              const y = 100 - (v / maxValue) * 100;
              return `${x},${y}`;
            })
            .join(' ')}
        />
        {values.map((v, i) => {
          const x = (i / (months.length - 1)) * 100;
          const y = 100 - (v / maxValue) * 100;
          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r="4"
              fill="#6366f1"
              className="transition-transform hover:scale-125"
            />
          );
        })}
      </svg>

      {/* Nhãn tháng */}
      <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 dark:text-gray-400">
        {months.map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>
    </div>
  );
};

const RankingItem: React.FC<{
  rank: number;
  name: string;
  score: number;
  tier: string;
  value: string;
  sessions: number;
  onViewDetail: (type: 'detail' | 'bonus') => void;
}> = ({ rank, name, score, tier, value, sessions, onViewDetail }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700">
    <div className="flex items-center space-x-4">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
          rank <= 3
            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
            : 'bg-gray-400 dark:bg-gray-600'
        }`}
      >
        {rank}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{name}</p>
        <div className="flex items-center space-x-3 mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">{score} điểm</span>
          <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getTierColor(tier)}`}>
            {tier}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{sessions} phiên</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onViewDetail('detail')}
          className="px-3 py-1.5 text-sm font-medium bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Detail
        </button>
        <button
          onClick={() => onViewDetail('bonus')}
          className="px-3 py-1.5 text-sm font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Bonus
        </button>
      </div>
    </div>
  </div>
);

const BonusModal: React.FC<{
  seer: { name: string; revenue: string };
  onClose: () => void;
}> = ({ seer, onClose }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Gift className="w-5 h-5 text-indigo-500" />
            <span>Thưởng Bonus</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Seer</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">{seer.name}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
              Số tiền thưởng
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1.000.000"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Thưởng cho hiệu suất xuất sắc..."
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                alert(`Đã thưởng ${amount} VNĐ cho ${seer.name}`);
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const FinanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'seer' | 'customer'>('system');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedSeer, setSelectedSeer] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [selectedSeerForBonus, setSelectedSeerForBonus] = useState<any>(null);
  const [showSeerDetailModal, setShowSeerDetailModal] = useState(false);
  const [selectedSeerForDetail, setSelectedSeerForDetail] = useState<any>(null);
  const [showCustomerDetailModal, setShowCustomerDetailModal] = useState(false);
  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState<any>(null);

  const currentData = selectedSeer
    ? SEER_REVENUE_DATA[selectedSeer as keyof typeof SEER_REVENUE_DATA]?.data[
        selectedYear as keyof typeof REVENUE_DATA_MONTHLY
      ]
    : selectedCustomer
    ? CUSTOMER_SPENDING_DATA[selectedCustomer as keyof typeof CUSTOMER_SPENDING_DATA]?.data[
        selectedYear as keyof typeof REVENUE_DATA_MONTHLY
      ]
    : REVENUE_DATA_MONTHLY[selectedYear as keyof typeof REVENUE_DATA_MONTHLY];

  const totalRevenue = Object.values(currentData || {}).reduce((sum, val) => sum + val, 0);

  const filteredSeerRankings =
    filterTier === 'all' ? SEER_RANKINGS : SEER_RANKINGS.filter((s) => s.tier === filterTier);

  const filteredCustomerRankings =
    filterTier === 'all'
      ? CUSTOMER_RANKINGS
      : CUSTOMER_RANKINGS.filter((c) => c.tier === filterTier);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tài chính</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Quản lý và theo dõi các chỉ số tài chính
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Tổng doanh thu"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            trend="+12.5%"
          />
          <StatCard title="Phần trăm thuế" value="156" icon={Users} trend="+8 Seer" />
          <StatCard title="Net profit" value="1,234" icon={Users} trend="+45 người" />
          <StatCard
            title="Doanh thu ngày 7/11"
            value="418,000 VNĐ"
            icon={TrendingUp}
            trend="+5.2%"
          />
        </div>

        {/* Tab Navigation */}
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

        {/* System Revenue */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1 - Tổng doanh thu */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Tổng doanh thu
              </h2>
              <div className="flex justify-end space-x-2 mb-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                  <option value="">Tất cả tháng</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <RevenueChart
                data={REVENUE_DATA_MONTHLY[selectedYear as keyof typeof REVENUE_DATA_MONTHLY]}
                year={selectedYear}
                month={selectedMonth}
              />
            </div>

            {/* Chart 2 - Phần trăm thuế */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Phần trăm thuế (%)
              </h2>
              <div className="flex justify-end space-x-2 mb-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                  <option value="">Tất cả tháng</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <RevenueChart
                data={REVENUE_DATA_MONTHLY[selectedYear as keyof typeof REVENUE_DATA_MONTHLY]}
                year={selectedYear}
              />
            </div>

            {/* Chart 3 - Net profit */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Net profit
              </h2>
              <div className="flex justify-end space-x-2 mb-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                  <option value="">Tất cả tháng</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <RevenueChart
                data={REVENUE_DATA_MONTHLY[selectedYear as keyof typeof REVENUE_DATA_MONTHLY]}
                year={selectedYear}
              />
            </div>

            {/* Chart 4 - Doanh thu trong ngày */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Doanh thu ngày 7/11
              </h2>
              <div className="flex justify-end space-x-2 mb-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                  <option value="">Tất cả tháng</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <RevenueChart
                data={REVENUE_DATA_MONTHLY[selectedYear as keyof typeof REVENUE_DATA_MONTHLY]}
                year={selectedYear}
              />
            </div>
          </div>
        )}

        {/* Seer Tab */}
        {activeTab === 'seer' && (
          <div className="space-y-6">
            {/* Seer Revenue Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              {selectedSeer ? (
                <RevenueChart data={currentData || {}} year={selectedYear} />
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Doanh thu trung bình các Seer
                  </h2>
                  <div className="flex justify-end space-x-2 mb-3">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    >
                      <option value="">Tất cả tháng</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Tháng {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    >
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                  </div>

                  <RevenueChart
                    data={REVENUE_DATA_MONTHLY[selectedYear as keyof typeof REVENUE_DATA_MONTHLY]}
                    year={selectedYear}
                  />
                </div>
              )}
            </div>

            {/* Seer Rankings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span>Bảng xếp hạng Seer</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Dựa trên Performance Point và Tier
                  </p>
                </div>
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                  <option value="all">Tất cả Tier</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>
              <div className="space-y-1">
                {filteredSeerRankings.map((seer, index) => (
                  <RankingItem
                    key={seer.id}
                    rank={index + 1}
                    name={seer.name}
                    score={seer.performance}
                    tier={seer.tier}
                    value={seer.revenue}
                    sessions={seer.sessions}
                    onViewDetail={(type) => {
                      if (type === 'detail') {
                        setSelectedSeerForDetail(seer);
                        setShowBonusModal(false);
                        setShowSeerDetailModal(true);
                      } else {
                        setSelectedSeerForBonus(seer);
                        setShowBonusModal(true);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customer Tab */}
        {activeTab === 'customer' && (
          <div className="space-y-6">
            {/* Customer Spending Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              {selectedCustomer ? (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Chi tiêu của{' '}
                        {
                          CUSTOMER_SPENDING_DATA[
                            selectedCustomer as keyof typeof CUSTOMER_SPENDING_DATA
                          ]?.name
                        }
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Tổng chi tiêu: {formatCurrency(totalRevenue)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                      >
                        <option value="">Tất cả tháng</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Tháng {i + 1}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                      >
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>
                  </div>
                  <RevenueChart data={currentData || {}} year={selectedYear} />
                </>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Chi tiêu trung bình của khách hàng
                  </h2>
                  <div className="flex justify-end space-x-2 mb-3">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    >
                      <option value="">Tất cả tháng</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Tháng {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    >
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                  </div>
                  <RevenueChart
                    data={REVENUE_DATA_MONTHLY[selectedYear as keyof typeof REVENUE_DATA_MONTHLY]}
                    year={selectedYear}
                  />
                </div>
              )}
            </div>

            {/* Customer Rankings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    <span>Bảng xếp hạng Customer</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Dựa trên Potential Point và Tier
                  </p>
                </div>
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                  <option value="all">Tất cả Tier</option>
                  <option value="VIP Gold">VIP Gold</option>
                  <option value="VIP Silver">VIP Silver</option>
                  <option value="Regular">Regular</option>
                </select>
              </div>
              <div className="space-y-1">
                {filteredCustomerRankings.map((customer, index) => (
                  <RankingItem
                    key={customer.id}
                    rank={index + 1}
                    name={customer.name}
                    score={customer.potential}
                    tier={customer.tier}
                    value={customer.spending}
                    sessions={customer.sessions}
                    onViewDetail={(type) => {
                      if (type === 'detail') {
                        setSelectedCustomerForDetail(customer);
                        setShowCustomerDetailModal(true);
                      } else {
                        alert(`Bonus cho ${customer.name}`);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bonus Modal */}
      {showBonusModal && selectedSeerForBonus && (
        <BonusModal
          seer={selectedSeerForBonus}
          onClose={() => {
            setShowBonusModal(false);
            setSelectedSeerForBonus(null);
          }}
        />
      )}
      {showSeerDetailModal && selectedSeerForDetail && (
        <SeerDetailModal
          seer={selectedSeerForDetail}
          onClose={() => {
            setShowSeerDetailModal(false);
            setSelectedSeerForDetail(null);
          }}
        />
      )}
      {showCustomerDetailModal && selectedCustomerForDetail && (
        <CustomerDetailModal
          customer={selectedCustomerForDetail}
          onClose={() => {
            setShowCustomerDetailModal(false);
            setSelectedCustomerForDetail(null);
          }}
        />
      )}
    </div>
  );
};

export default FinanceDashboard;
