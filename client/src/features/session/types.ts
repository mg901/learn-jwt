import * as user from '@/entities/user';

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: user.types.User;
};
