import { SingleResponse } from '@/types/response.type';
import { apiFetch } from '../api-client';

import {
  ChartData,
  ChartDto,
  ChartType,
  CustomerAction,
  CustomerPotential,
  CustomerPotentialParams,
  FinanceStatistic,
  SeerAction,
  SeerPerformance,
  SeerPerformanceParams,
  PaymentResponse,
} from '@/types/finance/finance.types';
import { PageResponse } from '@/types/paging.type';

export const ReportService = {
  // ==================== CUSTOMER POTENTIAL ====================

  getCustomerPotential: async (
    customerId: string,
    month: number,
    year: number,
  ): Promise<SingleResponse<CustomerPotential>> => {
    const res = await apiFetch<SingleResponse<CustomerPotential>>('/report/customer-potential', {
      method: 'GET',
      params: { customerId, month, year },
    });
    return res;
  },

  getMyCustomerPotential: async (
    month: number,
    year: number,
  ): Promise<SingleResponse<CustomerPotential>> => {
    const res = await apiFetch<SingleResponse<CustomerPotential>>('/report/my-customer-potential', {
      method: 'GET',
      params: { month, year },
    });
    return res;
  },

  getAllCustomerPotential: async (
    params?: CustomerPotentialParams,
  ): Promise<PageResponse<CustomerPotential>> => {
    const res = await apiFetch<PageResponse<CustomerPotential>>('/report/all-customer-potential', {
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
    });
    return res;
  },

  // ==================== SEER PERFORMANCE ====================

  getSeerPerformance: async (
    seerId: string,
    month: number,
    year: number,
  ): Promise<SingleResponse<SeerPerformance>> => {
    const res = await apiFetch<SingleResponse<SeerPerformance>>('/report/seer-performance', {
      method: 'GET',
      params: { seerId, month, year },
    });
    return res;
  },

  getMySeerPerformance: async (
    month: number,
    year: number,
  ): Promise<SingleResponse<SeerPerformance>> => {
    const res = await apiFetch<SingleResponse<SeerPerformance>>('/report/my-seer-performance', {
      method: 'GET',
      params: { month, year },
    });
    return res;
  },

  getAllSeerPerformance: async (
    params?: SeerPerformanceParams,
  ): Promise<PageResponse<SeerPerformance>> => {
    const res = await apiFetch<PageResponse<SeerPerformance>>('/report/all-seer-performance', {
      method: 'GET',
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        sortBy: params?.sortBy ?? 'createdAt',
        sortType: params?.sortType ?? 'desc',
        month: params?.month,
        year: params?.year,
        minPerformancePoint: params?.minPerformancePoint,
        maxPerformancePoint: params?.maxPerformancePoint,
        performanceTier: params?.performanceTier,
        minRanking: params?.minRanking,
        maxRanking: params?.maxRanking,
        minTotalPackages: params?.minTotalPackages,
        maxTotalPackages: params?.maxTotalPackages,
        minTotalRates: params?.minTotalRates,
        maxTotalRates: params?.maxTotalRates,
        minAvgRating: params?.minAvgRating,
        maxAvgRating: params?.maxAvgRating,
        minTotalBookings: params?.minTotalBookings,
        maxTotalBookings: params?.maxTotalBookings,
        minCompletedBookings: params?.minCompletedBookings,
        maxCompletedBookings: params?.maxCompletedBookings,
        minCancelledBySeer: params?.minCancelledBySeer,
        maxCancelledBySeer: params?.maxCancelledBySeer,
        minTotalRevenue: params?.minTotalRevenue,
        maxTotalRevenue: params?.maxTotalRevenue,
        minBonus: params?.minBonus,
        maxBonus: params?.maxBonus,
      },
    });
    return res;
  },

  // ==================== INTERNAL API ====================

  getSeerSimpleRating: async (
    seerId: string,
    month: number,
    year: number,
  ): Promise<SingleResponse<SeerPerformance>> => {
    const res = await apiFetch<SingleResponse<SeerPerformance>>(
      '/report/internal/seer-simple-rating',
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
    const res = await apiFetch<SingleResponse<boolean>>('/report/customer-reports', {
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
    const res = await apiFetch<SingleResponse<boolean>>('/report/seer-performance-reports', {
      method: 'POST',
      data: seerIds,
      params: { month, year },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res;
  },

  // ==================== ACTIONS ====================

  customerAction: async (
    customerId: string,
    action: CustomerAction,
    amount?: number,
  ): Promise<boolean> => {
    const res = await apiFetch<SingleResponse<boolean>>('/report/customer-action', {
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
    const res = await apiFetch<SingleResponse<boolean>>('/report/seer-action', {
      method: 'POST',
      params: {
        seerId,
        action,
        amount,
      },
    });
    return res.data;
  },

  payBonus: async (
    seerId: string,
    amount: number,
    reason: string,
  ): Promise<SingleResponse<PaymentResponse>> => {
    const res = await apiFetch<SingleResponse<PaymentResponse>>('/core/admin/bonus', {
      method: 'POST',
      data: {
        seerId,
        amount,
        reason,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res;
  },

  // ==================== FINANCE & CHARTS ====================

  getFinanceStatistic: async (): Promise<SingleResponse<FinanceStatistic>> => {
    const res = await apiFetch<SingleResponse<FinanceStatistic>>('/report/finance-statistic', {
      method: 'GET',
    });
    return res;
  },

  getChart: async (
    chartType: ChartType,
    month?: number,
    year?: number,
  ): Promise<SingleResponse<ChartData[]>> => {
    const res = await apiFetch<SingleResponse<ChartDto>>('/report/chart', {
      method: 'GET',
      params: {
        chartType,
        month,
        year,
      },
    });

    const transformedData: ChartData[] = Object.entries(res.data.data).map(([key, value]) => ({
      label: key,
      value: value,
    }));

    return {
      data: transformedData,
      message: res.message,
      statusCode: res.statusCode,
    };
  },
};
