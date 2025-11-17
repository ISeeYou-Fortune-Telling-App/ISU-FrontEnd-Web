import { PagingParams } from '../paging.type';

export interface PagingResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

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

export interface CustomerPotentialParams extends PagingParams {
  month?: number;
  year?: number;
  minPotentialPoint?: number;
  maxPotentialPoint?: number;
  potentialTier?: 'CASUAL' | 'STANDARD' | 'PREMIUM' | 'VIP';
  minRanking?: number;
  maxRanking?: number;
  minTotalBookingRequests?: number;
  maxTotalBookingRequests?: number;
  minTotalSpending?: number;
  maxTotalSpending?: number;
  minCancelledByCustomer?: number;
  maxCancelledByCustomer?: number;
}

export interface SeerPerformanceParams extends PagingParams {
  month?: number;
  year?: number;
  minPerformancePoint?: number;
  maxPerformancePoint?: number;
  performanceTier?: 'APPRENTICE' | 'PROFESSIONAL' | 'EXPERT' | 'MASTER';
  minRanking?: number;
  maxRanking?: number;
  minTotalPackages?: number;
  maxTotalPackages?: number;
  minTotalRates?: number;
  maxTotalRates?: number;
  minAvgRating?: number;
  maxAvgRating?: number;
  minTotalBookings?: number;
  maxTotalBookings?: number;
  minCompletedBookings?: number;
  maxCompletedBookings?: number;
  minCancelledBySeer?: number;
  maxCancelledBySeer?: number;
  minTotalRevenue?: number;
  maxTotalRevenue?: number;
  minBonus?: number;
  maxBonus?: number;
}

export interface CustomerPotential {
  id: string;
  customerId: string;
  fullName: string; 
  avatarUrl: string; 
  month: number;
  year: number;
  potentialPoint: number;
  potentialTier: 'CASUAL' | 'STANDARD' | 'PREMIUM' | 'VIP'; 
  ranking: number;
  totalBookingRequests: number;
  totalSpending: number;
  cancelledByCustomer: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeerPerformance {
  id: string;
  seerId: string;
  month: number;
  year: number;
  performanceTier: string;
  performancePoint: number;
  ranking: number;
  totalPackages: number;
  totalRates: number;
  avgRating: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBySeer: number;
  totalRevenue: number;
  bonus: number;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  avatarUrl: string;
}

export interface FinanceStatistic {
  totalRevenue: number;
  percentChangeTotalRevenue: number;
  totalNet: number;
  percentChangeTotalNet: number;
  totalTax: number;
  percentChangeTotalTax: number;
  totalRevenueDay: number;
  percentChangeTotalRevenueDay: number;
}

export interface ChartDto {
  month: number;
  year: number;
  data: Record<string, number>;
}

export interface ChartData {
  label: string;
  value: number;
}

export type ChartType =
  | 'TOTAL_REVENUE'
  | 'TOTAL_BOOKING_REQUESTS'
  | 'TOTAL_BOOKING_COMPLETED'
  | 'TOTAL_PACKAGES';

export type CustomerAction = 'BOOKING' | 'SPENDING' | 'CANCELLING';
export type SeerAction =
  | 'CREATE_PACKAGE'
  | 'RATED'
  | 'RECEIVED_BOOKING'
  | 'COMPLETED_BOOKING'
  | 'CANCELLING'
  | 'EARNING';

export interface PageResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
  paging: PagingResponse;
}

export interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}
