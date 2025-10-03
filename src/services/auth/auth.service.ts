import { apiFetch } from '@/lib/api'; 

interface LoginPayload {
  email: string;
  password: string;
}

export const login = (data: LoginPayload) => {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: data,
  });
};





