import * as http from '@/shared/http';
import * as types from './types';

export const fetchUsers = () => {
  return http.request<types.User[]>({
    url: '/users',
    method: 'GET',
  });
};
