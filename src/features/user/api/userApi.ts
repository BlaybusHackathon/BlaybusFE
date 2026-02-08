import { apiClient } from '@/shared/api/base';
import { User, mapUserFromApi } from '@/entities/user/types';
import { USE_MOCK } from '@/shared/mocks/mockEnv';
import { mockApi } from '@/shared/mocks/mockApi';
import { asOptionalString, isRecord, pick } from '@/shared/api/parse';

export const userApi = {
  getMe: async (): Promise<User> => {
    if (USE_MOCK) return mockApi.user.getMe();
    const data = await apiClient.get('/users/me');
    return mapUserFromApi(data);
  },

  updateMe: async (payload: { name?: string; nickName?: string }): Promise<User> => {
    if (USE_MOCK) return mockApi.user.updateMe(payload);
    const body: Record<string, string> = {};
    if (payload.name) body.name = payload.name;
    if (payload.nickName) body.nickname = payload.nickName;
    const data = await apiClient.patch('/users/me', body);
    return mapUserFromApi(data);
  },

  uploadProfile: async (file: File): Promise<string> => {
    if (USE_MOCK) return mockApi.user.uploadProfile();
    const form = new FormData();
    form.append('file', file);
    const data = await apiClient.patch('/users/me/profile', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (typeof data === 'string') return data;
    if (!isRecord(data)) return '';
    return (
      asOptionalString(
        pick(data, ['profileUrl', 'profile_url', 'fileUrl', 'file_name', 'fileName']),
        'User.uploadProfile'
      ) ?? ''
    );
  },

  registerFcmToken: async (fcmToken: string): Promise<void> => {
    if (USE_MOCK) return mockApi.user.registerFcmToken(fcmToken);
    await apiClient.post('/users/me/fcm-token', { fcmToken });
  },
};
