import { apiFetch } from '@/services/api';
import type {
  GetReportsParams,
  GetReportsResponse,
  GetReportTypesResponse,
  Report,
} from '@/types/reports/reports.type';
import type { SingleResponse, SimpleResponse } from '@/types/response.type';

export const ReportsService = {
  /**
   * Lấy danh sách loại báo cáo
   * GET /reports/types
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

    const url = `/reports/types${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiFetch<GetReportTypesResponse>(url, { method: 'GET' });

    return response;
  },

  /**
   * Lấy danh sách báo cáo vi phạm với phân trang và filter
   * GET /reports
   */
  getReports: async (params?: GetReportsParams): Promise<GetReportsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.sortType) queryParams.append('sortType', params.sortType);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.reportType) queryParams.append('reportType', params.reportType);

    const url = `/reports${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiFetch<GetReportsResponse>(url, { method: 'GET' });

    return response;
  },

  /**
   * Lấy chi tiết một báo cáo
   * GET /reports/:id
   */
  getReportById: async (id: string): Promise<Report> => {
    const response = await apiFetch<SingleResponse<Report>>(`/reports/${id}`, { method: 'GET' });
    return response.data;
  },

  /**
   * Cập nhật trạng thái và hành động xử lý báo cáo
   * PUT /reports/:id
   */
  updateReport: async (
    id: string,
    data: {
      reportStatus?: 'PENDING' | 'VIEWED' | 'RESOLVED' | 'REJECTED';
      actionType?:
        | 'NO_ACTION'
        | 'WARNING_ISSUED'
        | 'CONTENT_REMOVED'
        | 'USER_BANNED'
        | 'TEMPORARY_SUSPENSION';
      note?: string;
    },
  ): Promise<Report> => {
    const response = await apiFetch<SingleResponse<Report>>(`/reports/${id}`, {
      method: 'PUT',
      data,
    });
    return response.data;
  },

  /**
   * Xử lý vi phạm (WARNING, SUSPEND, BAN)
   * POST /reports/{reportId}/violation-action
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
      `/reports/${reportId}/violation-action`,
      {
        method: 'POST',
        data,
      },
    );
    return response.data;
  },

  /**
   * Update report status (PENDING, NO_ACTION)
   * PATCH /reports/{id}
   */
  updateReportStatus: async (
    id: string,
    data: {
      status: 'PENDING' | 'NO_ACTION';
      actionType: 'NO_ACTION';
      note?: string;
    },
  ): Promise<Report> => {
    const response = await apiFetch<SingleResponse<Report>>(`/reports/${id}`, {
      method: 'PATCH',
      data,
    });
    return response.data;
  },

  /**
   * Xóa báo cáo
   * DELETE /reports/:id
   */
  deleteReport: async (id: string): Promise<void> => {
    await apiFetch<SimpleResponse>(`/reports/${id}`, { method: 'DELETE' });
  },
};
