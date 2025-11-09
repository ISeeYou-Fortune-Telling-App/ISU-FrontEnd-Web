import { ListResponse } from '../response.type';
import { Paging } from '../paging.type';

export type CertificateStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Certificate {
  id: string;
  createdAt: string;
  updatedAt: string;
  seerName: string;
  certificateName: string;
  certificateDescription: string;
  issuedBy: string;
  issuedAt: string;
  expirationDate: string | null;
  certificateUrl: string;
  status: CertificateStatus;
  decisionReason: string | null;
  decisionDate: string | null;
  categories: string[];
}

export type GetCertificatesResponse = ListResponse<Certificate>;

// Request types for Certificate operations
export interface CertificateApprovalRequest {
  action: 'APPROVED' | 'REJECTED';
  decision_reason?: string;
}

export interface CertificateCreateRequest {
  certificateName: string;
  certificateDescription: string;
  issuedBy: string;
  issuedAt: string; // ISO string format
  expirationDate?: string; // ISO string format
  certificateFile: File;
  categoryIds: string[];
}

export interface CertificateUpdateRequest {
  certificateName?: string;
  certificateDescription?: string;
  issuedBy?: string;
  issuedAt?: string;
  expirationDate?: string;
  certificateFile?: File;
  categoryIds?: string[];
}

export interface CertificateQueryParams {
  page?: number;
  limit?: number;
  sortType?: 'asc' | 'desc';
  sortBy?: string;
}
