import type { AxiosRequestConfig } from 'axios';
import { User, mapUserFromApi } from '@/entities/user/types';
import { apiClient, rawClient } from '@/shared/api/base';
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
  if (!res) return null;

  let authHeader: string | null = null;

  if (res.headers) {
    const headersAny = res.headers as unknown as {
      get?: (name: string) => string | null | undefined;
      authorization?: string;
      Authorization?: string;
      [key: string]: unknown;
    };

    if (typeof headersAny.get === 'function') {
      authHeader = headersAny.get('authorization') || headersAny.get('Authorization') || null;
    } else {
      authHeader =
        headersAny.authorization ||
        headersAny.Authorization ||
        (headersAny['authorization'] as string | undefined) ||
        (headersAny['Authorization'] as string | undefined) ||
        null;
    }
  }

  if (typeof authHeader === 'string') {
    const token = authHeader.replace(/^bearer\s+/i, '').trim();
    if (token) return token;
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

  return typeof tokenFromBody === 'string' ? tokenFromBody.trim() : null;
};

export const authApi = {
  login: async (req: LoginRequest): Promise<LoginResponse> => {
    const response = await rawClient.post('/auth/login', req);
    const token = extractToken(response);

    if (!token) {
      throw { code: 'AUTH_TOKEN_INVALID', message: 'Token not found.' };
    }

    const fetchMe = () =>
      apiClient.get(
        '/users/me',
        {
          headers: { Authorization: `Bearer ${token}` },
          skipAuthLogout: true,
        } as AxiosRequestConfig & { skipAuthLogout?: boolean }
      );

    let userRaw;
    try {
      userRaw = await fetchMe();
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
      userRaw = await fetchMe();
    }

    return {
      user: normalizeUser(userRaw),
      token
    };
  },
};

