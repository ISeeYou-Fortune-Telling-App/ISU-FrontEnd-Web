import { apiFetch } from '@/services/api';
import { GetCertificatesResponse } from '@/types/certificates/certificates.type';

export const CertificateService = {
  getCertificates: async (): Promise<GetCertificatesResponse> => {
    const response = await apiFetch<GetCertificatesResponse>('/certificates');
    return response;
  },
};
