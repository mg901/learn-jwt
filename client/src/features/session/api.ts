import * as http from '@/shared/http';
import * as types from './types';

export const registration = (email: Email, password: Password) => {
  return http.request<types.AuthResponse>({
    url: '/registration',
    method: 'POST',
    body: { email, password },
  });
};

export const login = (email: Email, password: Password) => {
  return http.request<types.AuthResponse>({
    url: '/login',
    method: 'POST',
    body: { email, password },
  });
};

export const logout = () => {
  return http.request<void>({
    url: '/logout',
    method: 'POST',
  });
};
