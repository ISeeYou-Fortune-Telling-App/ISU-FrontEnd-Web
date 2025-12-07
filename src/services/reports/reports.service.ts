import { apiFetch } from '@/services/api-client';
import type {
  GetReportsParams,
  GetReportsResponse,
  GetReportTypesResponse,
  Report,
  ReportsStats,
} from '@/types/reports/reports.type';
import type { SingleResponse, SimpleResponse } from '@/types/response.type';

export const ReportsService = {
  /**
   * Lấy danh sách loại báo cáo
   * GET /core/reports/types
   */
  getReportTypes: async (params?: {
    page?: number;
    limit?: number;
    sortType?: 'asc' | 'desc';
    sortBy?: 'name';
  }): Promise<GetReportTypesResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.sortType) queryParams.append('sortType', params.sortType);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    const url = `/core/reports/types${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiFetch<GetReportTypesResponse>(url, { method: 'GET' });

    return response;
  },

  /**
   * Lấy danh sách báo cáo vi phạm với phân trang và filter
   * GET /core/reports
   */
  getReports: async (params?: GetReportsParams): Promise<GetReportsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.sortType) queryParams.append('sortType', params.sortType);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.name) queryParams.append('name', params.name);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.reportType) queryParams.append('reportType', params.reportType);
    if (params?.targetType) queryParams.append('targetType', params.targetType);

    const url = `/core/reports${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiFetch<GetReportsResponse>(url, { method: 'GET' });

    return response;
  },

  /**
   * Lấy chi tiết một báo cáo
   * GET /core/reports/:id
   */
  getReportById: async (id: string): Promise<Report> => {
    const response = await apiFetch<SingleResponse<Report>>(`/core/reports/${id}`, {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * Cập nhật trạng thái báo cáo (Đã xem, Từ chối)
   * PATCH /core/reports/:id
   */
  updateReport: async (
    id: string,
    data: {
      status: 'PENDING' | 'VIEWED' | 'RESOLVED' | 'REJECTED';
      actionType: 'NO_ACTION';
      note?: string;
    },
  ): Promise<Report> => {
    const response = await apiFetch<SingleResponse<Report>>(`/core/reports/${id}`, {
      method: 'PATCH',
      data,
    });
    return response.data;
  },

  /**
   * Xử lý vi phạm (WARNING, SUSPEND, BAN)
   * POST /core/reports/{reportId}/violation-action
   */
  handleViolation: async (
    reportId: string,
    data: {
      action: 'WARNING' | 'SUSPEND' | 'BAN';
      actionReason: string;
      suspendDays?: number;
    },
  ): Promise<Report> => {
    const response = await apiFetch<SingleResponse<Report>>(
      `/core/reports/${reportId}/violation-action`,
      {
        method: 'POST',
        data,
      },
    );
    return response.data;
  },

  getReportsStats: async (): Promise<ReportsStats> => {
    const res = await apiFetch<SingleResponse<ReportsStats>>('/core/reports/stats', {
      method: 'GET',
    });
    return res.data;
  },

  /**
   * Xóa báo cáo
   * DELETE /core/reports/:id
   */
  deleteReport: async (id: string): Promise<void> => {
    await apiFetch<SimpleResponse>(`/core/reports/${id}`, { method: 'DELETE' });
  },

  /**
   * Lấy lịch sử báo cáo của một người dùng (người báo cáo)
   * GET /core/reports/reporter/:reporterId
   */
  getReportsByReporter: async (
    reporterId: string,
    params?: {
      page?: number;
      limit?: number;
      sortType?: 'asc' | 'desc';
      sortBy?: 'createdAt';
    },
  ): Promise<GetReportsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.sortType) queryParams.append('sortType', params.sortType);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    const url = `/core/reports/reporter/${reporterId}${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    const response = await apiFetch<GetReportsResponse>(url, { method: 'GET' });

    return response;
  },

  /**
   * Lấy lịch sử bị báo cáo của một người dùng
   * GET /core/reports/reported-user/:reportedUserId
   */
  getReportsByReportedUser: async (
    reportedUserId: string,
    params?: {
      page?: number;
      limit?: number;
      sortType?: 'asc' | 'desc';
      sortBy?: 'createdAt';
    },
  ): Promise<GetReportsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.sortType) queryParams.append('sortType', params.sortType);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    const url = `/core/reports/reported-user/${reportedUserId}${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    const response = await apiFetch<GetReportsResponse>(url, { method: 'GET' });

    return response;
  },
};
