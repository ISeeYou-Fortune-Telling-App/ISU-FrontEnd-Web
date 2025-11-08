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
