import { apiClient } from '@/shared/api/base';
import { Notification, mapNotificationFromApi } from '@/entities/notification/types';
import { USE_MOCK } from '@/shared/mocks/mockEnv';
import { mockApi } from '@/shared/mocks/mockApi';
import { asRecord, asArray, asNumber, pick } from '@/shared/api/parse';

export type NotificationFilter = 'all' | 'unread' | 'read';

export interface NotificationPage {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const normalizePage = (raw: unknown): NotificationPage => {
  const obj = asRecord(raw, 'NotificationPage');
  const contentRaw = asArray(pick(obj, ['content']), 'NotificationPage.content');
  return {
    content: contentRaw.map(mapNotificationFromApi),
    totalElements: asNumber(pick(obj, ['totalElements', 'total_elements']), 'NotificationPage.totalElements'),
    totalPages: asNumber(pick(obj, ['totalPages', 'total_pages']), 'NotificationPage.totalPages'),
    size: asNumber(pick(obj, ['size']), 'NotificationPage.size'),
    number: asNumber(pick(obj, ['number', 'page']), 'NotificationPage.number'),
  };
};

export const notificationApi = {
  list: async (params?: { filter?: NotificationFilter; page?: number; size?: number }): Promise<NotificationPage> => {
    if (USE_MOCK) return mockApi.notification.list(params);
    const data = await apiClient.get('/notifications', { params });
    return normalizePage(data);
  },

  getUnreadCount: async (): Promise<number> => {
    const page = await notificationApi.list({ filter: 'unread', page: 0, size: 1 });
    return page.totalElements ?? page.content.length;
  },

  markRead: async (notificationId: string): Promise<void> => {
    if (USE_MOCK) return mockApi.notification.markRead(notificationId);
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  markReadAll: async (): Promise<void> => {
    if (USE_MOCK) return mockApi.notification.markReadAll();
    await apiClient.patch('/notifications/read-all');
  },
};
