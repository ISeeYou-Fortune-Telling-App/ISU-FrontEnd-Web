// ==================== USER INFO ====================
export interface ReportUser {
  id: string;
  username: string;
  avatarUrl: string;
}

// ==================== ENUMS ====================
export type TargetReportType = 'SEER' | 'CHAT' | 'BOOKING' | 'SERVICE_PACKAGE' | 'POST';

export type ReportStatus = 'PENDING' | 'VIEWED' | 'RESOLVED' | 'REJECTED';

export type ActionType =
  | 'NO_ACTION'
  | 'WARNING_ISSUED'
  | 'CONTENT_REMOVED'
  | 'USER_BANNED'
  | 'TEMPORARY_SUSPENSION';

// ==================== REPORT ====================
export interface Report {
  id: string;
  createdAt: string;
  updatedAt: string;
  reporter: ReportUser;
  reported: ReportUser;
  targetReportType: TargetReportType;
  targetId: string;
  reportType: string; // Tên của report type (SPAM, FRAUD, etc.)
  reportDescription: string;
  reportStatus: ReportStatus;
  actionType: ActionType;
  note: string | null;
}

// ==================== API PARAMS ====================
export interface GetReportsParams {
  page?: number;
  limit?: number;
  sortType?: 'asc' | 'desc';
  sortBy?: 'createdAt';
  status?: ReportStatus;
  reportType?: string; // name của report type (SPAM, FRAUD, etc.)
}

// ==================== API RESPONSE ====================
export interface ReportsPaging {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReportsStats {
  totalReports: number;
  newReportsThisMonth: number;
  resolvedReports: number;
  unresolvedReports: number;
}

export interface GetReportsResponse {
  statusCode: number;
  message: string;
  data: Report[];
  paging: ReportsPaging;
}

// ==================== REPORT TYPE ====================
export interface ReportTypeItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
}

export interface GetReportTypesResponse {
  statusCode: number;
  message: string;
  data: ReportTypeItem[];
  paging: ReportsPaging;
}
