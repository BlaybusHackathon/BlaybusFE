import { User } from '@/entities/user/types';
import { MOCK_USERS } from '../model/mockUsers';

interface LoginRequest {
  loginId: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token?: string; 
}

export const authApi = {
  login: async (req: LoginRequest): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = MOCK_USERS.find(
          (u) => u.username === req.loginId && u.password === req.password
        );

        if (found) {
          const { password, ...user } = found;
          resolve({ user, token: 'mock-jwt-token' });
        } else {
          reject(new Error('INVALID_CREDENTIALS'));
        }
      }, 500);
    });
  },
};