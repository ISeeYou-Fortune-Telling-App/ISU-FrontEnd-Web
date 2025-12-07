/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trophy } from 'lucide-react';

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

const formatMonth = (month: number, year: number) => {
  return `T${month}/${year}`;
};

const getRankingIcon = (ranking: number) => {
  if (ranking === 1) return <Trophy className="w-4 h-4 text-yellow-500" />;
  if (ranking === 2) return <Trophy className="w-4 h-4 text-gray-400" />;
  if (ranking === 3) return <Trophy className="w-4 h-4 text-amber-700" />;
  return null;
};

interface RankingItemProps {
  item: any;
  type: 'seer' | 'customer';
}

const RankingItem: React.FC<RankingItemProps> = ({ item, type }) => {
  const router = useRouter();

  const handleViewDetail = () => {
    const month = item.month || new Date().getMonth() + 1;
    const year = item.year || new Date().getFullYear();

    // Save to sessionStorage for detail page to use
    if (type === 'seer') {
      sessionStorage.setItem(`seer_${item.seerId}_period`, JSON.stringify({ month, year }));
      router.push(`/admin/finance/seer/${item.seerId}`);
    } else {
      sessionStorage.setItem(`customer_${item.customerId}_period`, JSON.stringify({ month, year }));
      router.push(`/admin/finance/customer/${item.customerId}`);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <img
          src={item.avatar || '/default_avatar.jpg'}
          alt={item.name}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/default_avatar.jpg';
          }}
        />
        <div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</p>
            {item.month && item.year && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                ({formatMonth(item.month, item.year)})
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3 mt-1">
            <div className="flex items-center space-x-1">
              {getRankingIcon(item.ranking)}
              <span className="text-xs text-gray-500 dark:text-gray-400">#{item.ranking}</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {item.performance || item.potential} điểm
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full text-white ${getTierColor(item.tier)}`}
            >
              {item.tier}
            </span>
            {type === 'seer' && item.avgRating && (
              <div className="flex items-center space-x-0.5">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                  {item.avgRating.toFixed(2)}
                </span>
              </div>
            )}
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
