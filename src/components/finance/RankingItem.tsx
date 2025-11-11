/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const getTierColor = (tier: string) => {
  const colors: Record<string, string> = {
    MASTER: 'bg-cyan-500',
    EXPERT: 'bg-purple-500',
    PROFESSIONAL: 'bg-yellow-500',
    APPRENTICE: 'bg-gray-400',
    VIP: 'bg-yellow-500',
    PREMIUM: 'bg-purple-400',
    STANDARD: 'bg-gray-400',
    CASUAL: 'bg-gray-300',
  };
  return colors[tier] || 'bg-gray-300';
};

interface RankingItemProps {
  item: any;
  type: 'seer' | 'customer';
}

const RankingItem: React.FC<RankingItemProps> = ({ item, type }) => {
  const router = useRouter();

  const handleViewDetail = () => {
    if (type === 'seer') {
      router.push(`/admin/finance/seer/${item.id}`);
    } else {
      router.push(`/admin/finance/customer/${item.id}`);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <img
          src={item.avatar || 'https://i.pravatar.cc/150'}
          alt={item.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</p>
          <div className="flex items-center space-x-3 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">#{item.ranking}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {item.performance || item.potential} điểm
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full text-white ${getTierColor(item.tier)}`}
            >
              {item.tier}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {item.revenue || item.spending}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{item.sessions} phiên</p>
        </div>
        <button
          onClick={handleViewDetail}
          className="px-3 py-1.5 text-sm font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Detail
        </button>
      </div>
    </div>
  );
};

export default RankingItem;
