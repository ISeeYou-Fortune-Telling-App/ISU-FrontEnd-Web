// Statistics API Response Types
export interface CategoryDistribution {
  [category: string]: number;
}

export interface StatisticsResponse {
  statusCode: number;
  message: string;
  data: CategoryDistribution;
}

// Monthly Users Statistics
export interface MonthlyUsersData {
  [month: string]: number;
}

export interface MonthlyUsersResponse {
  statusCode: number;
  message: string;
  data: MonthlyUsersData;
}

// Top Seer Performance
export interface SeerPerformance {
  seerId: string;
  fullName: string;
  avatarUrl?: string;
  performancePoint: number;
  ranking: number;
  performanceTier: string;
  totalRevenue: number;
  completedBookings: number;
  avgRating: number;
}

export interface TopSeerChartData {
  name: string;
  revenue: number;
  sessions: number;
  rating: number;
  [key: string]: string | number;
}

// Chart Data Types
export interface ServiceDistributionData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Index signature for recharts compatibility
}

export interface MonthlyChartData {
  month: string;
  users: number;
  [key: string]: string | number;
}
