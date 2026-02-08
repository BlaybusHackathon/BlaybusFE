import { apiClient } from '@/shared/api/base';
import type { MenteeNavItem } from '@/widgets/main-layout/desktop/components/MenteeMenuItem';
import { USE_MOCK } from '@/shared/mocks/mockEnv';
import { mockApi } from '@/shared/mocks/mockApi';
import { asRecord, asString, pick } from '@/shared/api/parse';

const normalizeMentee = (raw: unknown): MenteeNavItem => {
  const obj = asRecord(raw, 'MenteeNavItem');
  return {
    id: asString(pick(obj, ['menteeId', 'id']), 'MenteeNavItem.id'),
    name: asString(pick(obj, ['name', 'menteeName']), 'MenteeNavItem.name'),
  };
};

export const mentoringApi = {
  listMentees: async (params?: { page?: number; size?: number }): Promise<MenteeNavItem[]> => {
    if (USE_MOCK) return mockApi.mentoring.listMentees();
    const data = await apiClient.get('/mentor/mentees', { params });
    const list = Array.isArray(data) ? data : asRecord(data, 'MenteeNavList').content ?? asRecord(data, 'MenteeNavList').mentees ?? [];
    return list.map(normalizeMentee);
  },
};
