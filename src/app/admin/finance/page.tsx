'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { TrendingUp, DollarSign, Award, Users, Eye, X, Search, Filter } from 'lucide-react';

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

const BOOKING_REQUEST_DATA = {
  '2025': { '1': 120, '2': 135, '3': 150, '4': 140, '5': 160, '6': 175, '7': 180, '8': 195, '9': 0, '10': 0, '11': 0, '12': 0 },
  '2024': { '1': 100, '2': 115, '3': 130, '4': 120, '5': 140, '6': 155, '7': 160, '8': 175, '9': 180, '10': 185, '11': 190, '12': 200 },
};

const BOOKING_COMPLETE_DATA = {
  '2025': { '1': 110, '2': 125, '3': 140, '4': 130, '5': 150, '6': 165, '7': 170, '8': 185, '9': 0, '10': 0, '11': 0, '12': 0 },
  '2024': { '1': 90, '2': 105, '3': 120, '4': 110, '5': 130, '6': 145, '7': 150, '8': 165, '9': 170, '10': 175, '11': 180, '12': 190 },
};

const TOTAL_PACKAGES_DATA = {
  '2025': { '1': 45, '2': 50, '3': 55, '4': 52, '5': 60, '6': 65, '7': 70, '8': 75, '9': 0, '10': 0, '11': 0, '12': 0 },
  '2024': { '1': 35, '2': 40, '3': 45, '4': 42, '5': 50, '6': 55, '7': 60, '8': 65, '9': 70, '10': 75, '11': 80, '12': 85 },
};

const SEER_RANKINGS = [
  { id: 'seer-1', name: 'Thầy Minh Tuệ', avatar: 'https://i.pravatar.cc/150?img=1', performance: 4850, ranking: 1, tier: 'Diamond', revenue: '65.000.000 VNĐ', sessions: 156, avgRating: 4.9 },
  { id: 'seer-2', name: 'Cô Thanh Lan', avatar: 'https://i.pravatar.cc/150?img=2', performance: 4620, ranking: 2, tier: 'Diamond', revenue: '58.000.000 VNĐ', sessions: 142, avgRating: 4.8 },
  { id: 'seer-3', name: 'A. Thắng', avatar: 'https://i.pravatar.cc/150?img=3', performance: 4350, ranking: 3, tier: 'Platinum', revenue: '52.000.000 VNĐ', sessions: 128, avgRating: 4.7 },
  { id: 'seer-4', name: 'Chị Hằng', avatar: 'https://i.pravatar.cc/150?img=4', performance: 4120, ranking: 4, tier: 'Platinum', revenue: '48.000.000 VNĐ', sessions: 115, avgRating: 4.6 },
  { id: 'seer-5', name: 'Em Thảo', avatar: 'https://i.pravatar.cc/150?img=5', performance: 3890, ranking: 5, tier: 'Gold', revenue: '42.000.000 VNĐ', sessions: 98, avgRating: 4.5 },
];

const CUSTOMER_RANKINGS = [
  { id: 'customer-1', name: 'Nguyễn Thị Mai', avatar: 'https://i.pravatar.cc/150?img=6', potential: 3650, ranking: 1, tier: 'VIP Gold', spending: '8.500.000 VNĐ', sessions: 28 },
  { id: 'customer-2', name: 'Trần Văn Nam', avatar: 'https://i.pravatar.cc/150?img=7', potential: 3420, ranking: 2, tier: 'VIP Gold', spending: '7.200.000 VNĐ', sessions: 24 },
  { id: 'customer-3', name: 'Lê Hoàng Anh', avatar: 'https://i.pravatar.cc/150?img=8', potential: 3180, ranking: 3, tier: 'VIP Silver', spending: '6.100.000 VNĐ', sessions: 20 },
  { id: 'customer-4', name: 'Phạm Thị Lan', avatar: 'https://i.pravatar.cc/150?img=9', potential: 2950, ranking: 4, tier: 'VIP Silver', spending: '5.300.000 VNĐ', sessions: 18 },
  { id: 'customer-5', name: 'Võ Minh Tuấn', avatar: 'https://i.pravatar.cc/150?img=10', potential: 2720, ranking: 5, tier: 'Regular', spending: '4.500.000 VNĐ', sessions: 15 },
];

const TIER_DISTRIBUTION = {
  seer: { Diamond: 35, Platinum: 40, Gold: 25 },
  customer: { 'VIP Gold': 20, 'VIP Silver': 35, Regular: 45 },
};

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
        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <p><b>Tên:</b> {seer.name}</p>
        <p><b>Ranking:</b> #{seer.ranking}</p>
        <p><b>Tier hiện tại:</b> {seer.tier}</p>
        <p><b>Performance Point:</b> {seer.performance}</p>
        <p><b>Doanh thu tháng:</b> {seer.revenue}</p>
        <p><b>Hoàn thành booking:</b> {seer.sessions}</p>
        <p><b>Đánh giá trung bình:</b> {seer.avgRating}/5 ⭐</p>
      </div>
    </div>
  </div>
);

const CustomerDetailModal: React.FC<{ customer: any; onClose: () => void }> = ({ customer, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Eye className="w-5 h-5 text-purple-500" />
          <span>Chi tiết khách hàng</span>
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <p><b>Tên:</b> {customer.name}</p>
        <p><b>Ranking:</b> #{customer.ranking}</p>
        <p><b>Tier:</b> {customer.tier}</p>
        <p><b>Điểm tiềm năng:</b> {customer.potential}</p>
        <p><b>Tổng chi tiêu:</b> {customer.spending}</p>
        <p><b>Số booking:</b> {customer.sessions}</p>
      </div>
    </div>
  </div>
);

const AdvancedFilterModal: React.FC<{ onClose: () => void; onApply: (filters: any) => void; type: 'seer' | 'customer' }> = ({ onClose, onApply, type }) => {
  const [filters, setFilters] = useState<any>({});

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Bộ lọc nâng cao</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Tier</label>
            <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Tất cả</option>
              {type === 'seer' ? (
                <>
                  <option value="Diamond">Diamond</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Gold">Gold</option>
                </>
              ) : (
                <>
                  <option value="VIP Gold">VIP Gold</option>
                  <option value="VIP Silver">VIP Silver</option>
                  <option value="Regular">Regular</option>
                </>
              )}
            </select>
          </div>

          {type === 'seer' && (
            <>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Performance Point (min - max)</label>
                <div className="flex space-x-2">
                  <input type="number" placeholder="Min" className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <input type="number" placeholder="Max" className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Đánh giá (min)</label>
                <input type="number" step="0.1" min="0" max="5" placeholder="4.0" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
            </>
          )}

          {type === 'customer' && (
            <>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Potential Point (min - max)</label>
                <div className="flex space-x-2">
                  <input type="number" placeholder="Min" className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <input type="number" placeholder="Max" className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Tổng chi tiêu (min - max)</label>
                <div className="flex space-x-2">
                  <input type="number" placeholder="Min" className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <input type="number" placeholder="Max" className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
            </>
          )}

          <div className="flex space-x-3 mt-6">
            <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Hủy
            </button>
            <button onClick={() => { onApply(filters); onClose(); }} className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg">
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; trend?: string }> = ({ title, value, icon: Icon, trend }) => (
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

const RevenueChart: React.FC<{ data: Record<string, number>; year: string; title?: string }> = ({ data, year, title }) => {
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  const values = Object.values(data);
  const maxValue = Math.max(...values, 1);

  return (
    <div className="relative w-full h-48 mt-4">
      <div className="absolute inset-0 grid grid-rows-4 border-l border-b border-gray-300 dark:border-gray-700">
        <div className="border-t border-gray-200 dark:border-gray-700"></div>
        <div className="border-t border-gray-200 dark:border-gray-700"></div>
        <div className="border-t border-gray-200 dark:border-gray-700"></div>
      </div>

      <svg className="w-full h-full relative z-10">
        <polyline fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" points={values.map((v, i) => {
          const x = (i / (months.length - 1)) * 100;
          const y = 100 - (v / maxValue) * 100;
          return `${x},${y}`;
        }).join(' ')} />
        {values.map((v, i) => {
          const x = (i / (months.length - 1)) * 100;
          const y = 100 - (v / maxValue) * 100;
          return <circle key={i} cx={`${x}%`} cy={`${y}%`} r="4" fill="#6366f1" className="transition-transform hover:scale-125" />;
        })}
      </svg>

      <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 dark:text-gray-400">
        {months.map((m, i) => <span key={i}>{m}</span>)}
      </div>
    </div>
  );
};

const PieChart: React.FC<{ data: Record<string, number>; title: string }> = ({ data, title }) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  let currentAngle = 0;

  const colors: Record<string, string> = {
    Diamond: '#06b6d4', Platinum: '#a855f7', Gold: '#eab308',
    'VIP Gold': '#eab308', 'VIP Silver': '#9ca3af', Regular: '#d1d5db'
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
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2 text-sm">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: colors[key] || '#9ca3af' }}></div>
            <span className="text-gray-700 dark:text-gray-300">{key}: {value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RankingItem: React.FC<{ item: any; onViewDetail: () => void; showBonus?: boolean }> = ({ item, onViewDetail, showBonus = false }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700">
    <div className="flex items-center space-x-4">
      <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</p>
        <div className="flex items-center space-x-3 mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">#{item.ranking}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{item.performance || item.potential} điểm</span>
          <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getTierColor(item.tier)}`}>{item.tier}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.revenue || item.spending}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{item.sessions} phiên</p>
      </div>
      <button onClick={onViewDetail} className="px-3 py-1.5 text-sm font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
        Detail
      </button>
    </div>
  </div>
);

const FinanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'seer' | 'customer'>('system');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [showSeerDetailModal, setShowSeerDetailModal] = useState(false);
  const [selectedSeerForDetail, setSelectedSeerForDetail] = useState<any>(null);
  const [showCustomerDetailModal, setShowCustomerDetailModal] = useState(false);
  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState<any>(null);

  const filteredSeerRankings = SEER_RANKINGS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCustomerRankings = CUSTOMER_RANKINGS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lịch sử tài chính</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quản lý và theo dõi các chỉ số tài chính</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Tổng doanh thu" value={formatCurrency(Object.values(REVENUE_DATA_MONTHLY['2025']).reduce((sum, val) => sum + val, 0))} icon={DollarSign} trend="+12.5%" />
          <StatCard title="Phần trăm thuế" value="7%" icon={TrendingUp} />
          <StatCard title="Net profit" value={formatCurrency(45000000)} icon={Award} trend="+8.3%" />
          <StatCard title="Tổng Seers" value="156" icon={Users} trend="+8" />
        </div>

        <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => setActiveTab('system')} className={`px-4 py-2 font-medium transition-colors ${activeTab === 'system' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            Doanh thu Hệ thống
          </button>
          <button onClick={() => setActiveTab('seer')} className={`px-4 py-2 font-medium transition-colors ${activeTab === 'seer' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            Hiệu suất tiên tri
          </button>
          <button onClick={() => setActiveTab('customer')} className={`px-4 py-2 font-medium transition-colors ${activeTab === 'customer' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            Tiềm năng khách hàng
          </button>
        </div>

        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Tổng doanh thu', data: REVENUE_DATA_MONTHLY },
              { title: 'Tổng booking requests', data: BOOKING_REQUEST_DATA },
              { title: 'Tổng booking complete', data: BOOKING_COMPLETE_DATA },
              { title: 'Tổng gói dịch vụ', data: TOTAL_PACKAGES_DATA }
            ].map((chart, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{chart.title}</h2>
                <div className="flex justify-end space-x-2 mb-3">
                  <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                    <option value="">Tất cả tháng</option>
                    {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>)}
                  </select>
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <RevenueChart data={chart.data[selectedYear as keyof typeof chart.data]} year={selectedYear} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'seer' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Doanh thu trung bình mỗi seer</h2>
                <div className="flex justify-end space-x-2 mb-3">
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <RevenueChart data={REVENUE_DATA_MONTHLY[selectedYear as keyof typeof REVENUE_DATA_MONTHLY]} year={selectedYear} />
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Rating trung bình mỗi seer</h2>
                <div className="flex justify-end space-x-2 mb-3">
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <RevenueChart data={{ '1': 4.5, '2': 4.6, '3': 4.7, '4': 4.65, '5': 4.8, '6': 4.85, '7': 4.9, '8': 4.88, '9': 0, '10': 0, '11': 0, '12': 0 }} year={selectedYear} />
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Phân phối tier giữa các seer</h2>
                <PieChart data={TIER_DISTRIBUTION.seer} title="Tier Distribution" />
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Performance point trung bình mỗi seer</h2>
                <div className="flex justify-end space-x-2 mb-3">
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <RevenueChart data={{ '1': 3800, '2': 3900, '3': 4000, '4': 3950, '5': 4100, '6': 4200, '7': 4300, '8': 4400, '9': 0, '10': 0, '11': 0, '12': 0 }} year={selectedYear} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span>Bảng xếp hạng Seer</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Dựa trên Performance Point và Tier</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                {filteredSeerRankings.map((seer) => (
                  <RankingItem
                    key={seer.id}
                    item={seer}
                    onViewDetail={() => {
                      setSelectedSeerForDetail(seer);
                      setShowSeerDetailModal(true);
                    }}
                    showBonus={true}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customer' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Tổng chi tiêu của khách hàng</h2>
                <div className="flex justify-end space-x-2 mb-3">
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <RevenueChart data={REVENUE_DATA_MONTHLY[selectedYear as keyof typeof REVENUE_DATA_MONTHLY]} year={selectedYear} />
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Chi tiêu trung bình mỗi khách hàng</h2>
                <div className="flex justify-end space-x-2 mb-3">
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <RevenueChart data={{ '1': 5000000, '2': 5200000, '3': 5400000, '4': 5300000, '5': 5600000, '6': 5800000, '7': 6000000, '8': 6200000, '9': 0, '10': 0, '11': 0, '12': 0 }} year={selectedYear} />
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Potential point trung bình</h2>
                <div className="flex justify-end space-x-2 mb-3">
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <RevenueChart data={{ '1': 2800, '2': 2900, '3': 3000, '4': 2950, '5': 3100, '6': 3200, '7': 3300, '8': 3400, '9': 0, '10': 0, '11': 0, '12': 0 }} year={selectedYear} />
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Tier Contribution</h2>
                <PieChart data={TIER_DISTRIBUTION.customer} title="Customer Tier" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    <span>Bảng xếp hạng Customer</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Dựa trên Potential Point và Tier</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                {filteredCustomerRankings.map((customer) => (
                  <RankingItem
                    key={customer.id}
                    item={customer}
                    onViewDetail={() => {
                      setSelectedCustomerForDetail(customer);
                      setShowCustomerDetailModal(true);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showAdvancedFilter && (
        <AdvancedFilterModal
          type={activeTab === 'seer' ? 'seer' : 'customer'}
          onClose={() => setShowAdvancedFilter(false)}
          onApply={(filters) => console.log(filters)}
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