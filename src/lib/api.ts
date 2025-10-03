// src/lib/api.ts
// Thư viện gọi API chung cho dự án Next.js

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiOptions {
  method?: ApiMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
  baseUrl?: string;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    params,
    baseUrl = process.env.NEXT_PUBLIC_API_URL || '',
  } = options;

  let url = baseUrl + endpoint;
  if (params) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    url += `?${query}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const res = await fetch(url, fetchOptions);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
