import { apiFetch } from '@/services/api-core';
import { apiFetch as apiFetch2 } from '@/services/api-report-service';
import {
  StatisticsResponse,
  MonthlyUsersResponse,
  SeerPerformance,
} from '@/types/dashboard/dashboard.type';
import { PageResponse } from '@/types/paging.type';

export const dashboardService = {
  // Get package distribution by category
  getCategoryDistribution: async (year?: number, month?: number): Promise<StatisticsResponse> => {
    const params: any = {};
    if (year) params.year = year;
    if (month) params.month = month;
    return await apiFetch<StatisticsResponse>('/statistics/packages/category-distribution', {
      method: 'GET',
      params,
    });
  },

  // Get monthly new users statistics
  getMonthlyUsers: async (year: number): Promise<MonthlyUsersResponse> => {
    return await apiFetch<MonthlyUsersResponse>(`/statistics/users/monthly?year=${year}`, {
      method: 'GET',
    });
  },

  // Get top seer performance
  getTopSeerPerformance: async (
    year: number,
    limit: number = 10,
    month?: number,
  ): Promise<PageResponse<SeerPerformance>> => {
    const params: any = {
      page: 1,
      limit,
      sortBy: 'performancePoint',
      sortType: 'desc',
      year,
    };
    if (month) params.month = month;
    return await apiFetch2<PageResponse<SeerPerformance>>(
      '/all-seer-performance',
      {
        method: 'GET',
        params,
      },
    );
  },
};
