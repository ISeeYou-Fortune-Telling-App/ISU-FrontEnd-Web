import { SingleResponse } from '@/types/response.type';
import { apiFetch } from '../api';
import {
  ChartData,
  ChartType,
  CustomerAction,
  CustomerPotential,
  CustomerPotentialParams,
  FinanceStatistic,
  PageResponse,
  SeerAction,
  SeerPerformance,
  SeerPerformanceParams,
} from '@/types/finance.types';

export const ReportService = {
  // ==================== CUSTOMER POTENTIAL ====================

  getCustomerPotential: async (
    customerId: string,
    month: number,
    year: number,
  ): Promise<SingleResponse<CustomerPotential>> => {
    const res = await apiFetch<SingleResponse<CustomerPotential>>(
      '/statistic-report/customer-potential',
      {
        method: 'GET',
        params: { customerId, month, year },
      },
    );
    return res;
  },

  getMyCustomerPotential: async (
    month: number,
    year: number,
  ): Promise<SingleResponse<CustomerPotential>> => {
    const res = await apiFetch<SingleResponse<CustomerPotential>>(
      '/statistic-report/my-customer-potential',
      {
        method: 'GET',
        params: { month, year },
      },
    );
    return res;
  },

  getAllCustomerPotential: async (
    params?: CustomerPotentialParams,
  ): Promise<SingleResponse<PageResponse<CustomerPotential>>> => {
    const res = await apiFetch<SingleResponse<PageResponse<CustomerPotential>>>(
      '/statistic-report/all-customer-potential',
      {
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 15,
          sortType: params?.sortType ?? 'desc',
          sortBy: params?.sortBy ?? 'createdAt',
          month: params?.month,
          year: params?.year,
          minPotentialPoint: params?.minPotentialPoint,
          maxPotentialPoint: params?.maxPotentialPoint,
          potentialTier: params?.potentialTier,
          minRanking: params?.minRanking,
          maxRanking: params?.maxRanking,
          minTotalBookingRequests: params?.minTotalBookingRequests,
          maxTotalBookingRequests: params?.maxTotalBookingRequests,
          minTotalSpending: params?.minTotalSpending,
          maxTotalSpending: params?.maxTotalSpending,
          minCancelledByCustomer: params?.minCancelledByCustomer,
          maxCancelledByCustomer: params?.maxCancelledByCustomer,
        },
      },
    );
    return res;
  },

  // ==================== SEER PERFORMANCE ====================

  getSeerPerformance: async (
    seerId: string,
    month: number,
    year: number,
  ): Promise<SingleResponse<SeerPerformance>> => {
    const res = await apiFetch<SingleResponse<SeerPerformance>>(
      '/statistic-report/seer-performance',
      {
        method: 'GET',
        params: { seerId, month, year },
      },
    );
    return res;
  },

  getMySeerPerformance: async (
    month: number,
    year: number,
  ): Promise<SingleResponse<SeerPerformance>> => {
    const res = await apiFetch<SingleResponse<SeerPerformance>>(
      '/statistic-report/my-seer-performance',
      {
        method: 'GET',
        params: { month, year },
      },
    );
    return res;
  },

  getAllSeerPerformance: async (
    params?: SeerPerformanceParams,
  ): Promise<SingleResponse<PageResponse<SeerPerformance>>> => {
    // <-- SỬA Ở ĐÂY
    const res = await apiFetch<SingleResponse<PageResponse<SeerPerformance>>>( // <-- VÀ SỬA Ở ĐÂY
      '/statistic-report/all-seer-performance',
      {
        method: 'GET',
        params: {
          // ... (giữ nguyên các params)
          page: params?.page ?? 1,
          limit: params?.limit ?? 15,
          // ...
          maxBonus: params?.maxBonus,
        },
      },
    );
    return res;
  },

  // ==================== INTERNAL API ====================

  getSeerSimpleRating: async (
    seerId: string,
    month: number,
    year: number,
  ): Promise<SingleResponse<SeerPerformance>> => {
    // <-- SỬA Ở ĐÂY
    const res = await apiFetch<SingleResponse<SeerPerformance>>(
      '/internal/statistic-report/seer-simple-rating',
      {
        method: 'GET',
        params: { seerId, month, year },
      },
    );
    return res;
  },

  // ==================== REPORTS CREATION ====================

  createCustomerReports: async (
    customerIds: string[],
    month: number,
    year: number,
  ): Promise<SingleResponse<boolean>> => {
    const res = await apiFetch<SingleResponse<boolean>>('/statistic-report/customer-reports', {
      method: 'POST',
      data: customerIds,
      params: { month, year },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res;
  },

  createSeerPerformanceReports: async (
    seerIds: string[],
    month: number,
    year: number,
  ): Promise<SingleResponse<boolean>> => {
    const res = await apiFetch<SingleResponse<boolean>>(
      '/statistic-report/seer-performance-reports',
      {
        method: 'POST',
        data: seerIds,
        params: { month, year },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return res;
  },

  // ==================== ACTIONS ====================

  customerAction: async (
    customerId: string,
    action: CustomerAction,
    amount?: number,
  ): Promise<boolean> => {
    const res = await apiFetch<SingleResponse<boolean>>('/statistic-report/customer-action', {
      method: 'POST',
      params: {
        customerId,
        action,
        amount,
      },
    });
    return res.data;
  },

  seerAction: async (seerId: string, action: SeerAction, amount?: number): Promise<boolean> => {
    const res = await apiFetch<SingleResponse<boolean>>('/statistic-report/seer-action', {
      method: 'POST',
      params: {
        seerId,
        action,
        amount,
      },
    });
    return res.data;
  },

  // ==================== FINANCE & CHARTS ====================

  getFinanceStatistic: async (): Promise<SingleResponse<FinanceStatistic>> => {
    const res = await apiFetch<SingleResponse<FinanceStatistic>>(
      '/statistic-report/finance-statistic',
      {
        method: 'GET',
      },
    );
    return res;
  },

  getChart: async (
    chartType: ChartType,
    month?: number,
    year?: number,
  ): Promise<SingleResponse<ChartData[]>> => {
    const res = await apiFetch<SingleResponse<ChartData[]>>('/statistic-report/chart', {
      method: 'GET',
      params: {
        chartType,
        month,
        year,
      },
    });
    return res;
  },
};
