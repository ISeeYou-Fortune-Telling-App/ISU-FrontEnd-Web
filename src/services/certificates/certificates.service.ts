import { apiFetch } from '@/services/api-client';
import {
  Certificate,
  CertificateApprovalRequest,
  CertificateCreateRequest,
  CertificateQueryParams,
  CertificateUpdateRequest,
  GetCertificatesResponse,
  CertificateStats,
} from '@/types/certificates/certificates.type';
import { SingleResponse } from '@/types/response.type';

export const CertificateService = {
  getCertificates: async (params?: CertificateQueryParams): Promise<GetCertificatesResponse> => {
    const queryParams = new URLSearchParams({
      page: params?.page?.toString() || '1',
      limit: params?.limit?.toString() || '15',
      sortType: params?.sortType || 'desc',
      sortBy: params?.sortBy || 'createdAt',
    });

    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.seerName) {
      queryParams.append('seerName', params.seerName);
    }

    const response = await apiFetch<GetCertificatesResponse>(`/certificates?${queryParams}`);
    return response;
  },

  getCertificateById: async (id: string): Promise<SingleResponse<Certificate>> => {
    const response = await apiFetch<SingleResponse<Certificate>>(`/certificates/${id}`);
    return response;
  },

  getCertificatesByUserId: async (
    userId: string,
    params?: CertificateQueryParams,
  ): Promise<GetCertificatesResponse> => {
    const queryParams = new URLSearchParams({
      page: params?.page?.toString() || '1',
      limit: params?.limit?.toString() || '15',
      sortType: params?.sortType || 'desc',
      sortBy: params?.sortBy || 'createdAt',
    });

    const response = await apiFetch<GetCertificatesResponse>(
      `/certificates/by-user/${userId}?${queryParams}`,
    );
    return response;
  },

  getCertificatesByCategoryId: async (
    categoryId: string,
    params?: CertificateQueryParams,
  ): Promise<GetCertificatesResponse> => {
    const queryParams = new URLSearchParams({
      page: params?.page?.toString() || '1',
      limit: params?.limit?.toString() || '15',
      sortType: params?.sortType || 'desc',
      sortBy: params?.sortBy || 'createdAt',
    });

    const response = await apiFetch<GetCertificatesResponse>(
      `/certificates/by-category/${categoryId}?${queryParams}`,
    );
    return response;
  },

  getCertificatesByUserAndCategory: async (
    userId: string,
    categoryId: string,
    params?: CertificateQueryParams,
  ): Promise<GetCertificatesResponse> => {
    const queryParams = new URLSearchParams({
      page: params?.page?.toString() || '1',
      limit: params?.limit?.toString() || '15',
      sortType: params?.sortType || 'desc',
      sortBy: params?.sortBy || 'createdAt',
    });

    const response = await apiFetch<GetCertificatesResponse>(
      `/certificates/by-user/${userId}/category/${categoryId}?${queryParams}`,
    );
    return response;
  },

  createCertificate: async (
    request: CertificateCreateRequest,
  ): Promise<SingleResponse<Certificate>> => {
    const formData = new FormData();
    formData.append('certificateName', request.certificateName);
    formData.append('certificateDescription', request.certificateDescription);
    formData.append('issuedBy', request.issuedBy);
    formData.append('issuedAt', request.issuedAt);

    if (request.expirationDate) {
      formData.append('expirationDate', request.expirationDate);
    }

    formData.append('certificateFile', request.certificateFile);

    // Append category IDs as separate entries
    request.categoryIds.forEach((id) => {
      formData.append('categoryIds', id);
    });

    const response = await apiFetch<SingleResponse<Certificate>>('/certificates', {
      method: 'POST',
      data: formData,
    });
    return response;
  },

  updateCertificate: async (
    id: string,
    request: CertificateUpdateRequest,
  ): Promise<SingleResponse<Certificate>> => {
    const formData = new FormData();

    if (request.certificateName) {
      formData.append('certificateName', request.certificateName);
    }
    if (request.certificateDescription) {
      formData.append('certificateDescription', request.certificateDescription);
    }
    if (request.issuedBy) {
      formData.append('issuedBy', request.issuedBy);
    }
    if (request.issuedAt) {
      formData.append('issuedAt', request.issuedAt);
    }
    if (request.expirationDate) {
      formData.append('expirationDate', request.expirationDate);
    }
    if (request.certificateFile) {
      formData.append('certificateFile', request.certificateFile);
    }
    if (request.categoryIds) {
      request.categoryIds.forEach((id) => {
        formData.append('categoryIds', id);
      });
    }

    const response = await apiFetch<SingleResponse<Certificate>>(`/certificates/${id}`, {
      method: 'PATCH',
      data: formData,
    });
    return response;
  },

  deleteCertificate: async (id: string): Promise<SingleResponse<null>> => {
    const response = await apiFetch<SingleResponse<null>>(`/certificates/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  approveCertificate: async (
    id: string,
    request: CertificateApprovalRequest,
  ): Promise<SingleResponse<Certificate>> => {
    const response = await apiFetch<SingleResponse<Certificate>>(`/certificates/${id}/approval`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(request),
    });
    return response;
  },

  getCertificateStats: async (): Promise<SingleResponse<CertificateStats>> => {
    const response = await apiFetch<SingleResponse<CertificateStats>>('/certificates/stats');
    return response;
  },
};
