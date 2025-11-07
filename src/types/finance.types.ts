export interface MonthlyData {
  [key: string]: number;
}

export interface YearlyData {
  [key: string]: MonthlyData;
}

export interface RevenueData {
  name: string;
  data: YearlyData;
}

export interface Seer {
  id: string;
  name: string;
  performance: number;
  tier: 'Diamond' | 'Platinum' | 'Gold';
  revenue: string;
  sessions: number;
}

export interface Customer {
  id: string;
  name: string;
  potential: number;
  tier: 'VIP Gold' | 'VIP Silver' | 'Regular';
  spending: string;
  sessions: number;
}

export type ActiveTab = 'system' | 'seer' | 'customer';
export type Tier = 'Diamond' | 'Platinum' | 'Gold' | 'VIP Gold' | 'VIP Silver' | 'Regular' | 'all';
