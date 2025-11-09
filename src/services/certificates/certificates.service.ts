import { apiFetch } from '@/services/api';
import { GetCertificatesResponse } from '@/types/certificates/certificates.type';
import { isListResponse } from '@/types/response.type';

export const CertificateService = {
  getCertificates: async () => {
    const response = await apiFetch<GetCertificatesResponse>('/certificates');

    if (isListResponse(response)) {
      return response.data;
    }

    throw new Error('Không nhận được dữ liệu chứng chỉ hợp lệ.');
  },
};
