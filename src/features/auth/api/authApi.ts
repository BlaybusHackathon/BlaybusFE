import { User, mapUserFromApi } from '@/entities/user/types';
import { apiClient, rawClient } from '@/shared/api/base';
import { USE_MOCK } from '@/shared/mocks/mockEnv';
import { mockApi } from '@/shared/mocks/mockApi';
import { isRecord } from '@/shared/api/parse';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

const normalizeUser = (raw: unknown): User => {
  return mapUserFromApi(raw);
};

type RawResponse = { headers?: Record<string, unknown>; data?: unknown };

const extractToken = (res: RawResponse | null | undefined): string | null => {
  const authHeader = res?.headers?.authorization || res?.headers?.Authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '');
  }

  const body = res?.data;
  if (!isRecord(body)) return null;
  const data = isRecord(body.data) ? body.data : undefined;
  const tokenFromBody =
    (data && (data.accessToken ?? data.access_token ?? data.token)) ||
    body.accessToken ||
    body.access_token ||
    body.token ||
    null;

  return typeof tokenFromBody === 'string' ? tokenFromBody : null;
};

export const authApi = {
  login: async (req: LoginRequest): Promise<LoginResponse> => {
    if (USE_MOCK) {
      return mockApi.auth.login(req);
    }

    const response = await rawClient.post('/auth/login', req);
    const token = extractToken(response);

    if (!token) {
      throw { code: 'AUTH_TOKEN_INVALID', message: 'Token not found.' };
    }

    const userRaw = await apiClient.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      user: normalizeUser(userRaw),
      token
    };
  },
};
