import { apiClient } from '@/shared/api/base';
import type { MenteeProfileData } from '@/widgets/mentee-profile/model/types';
import { USE_MOCK } from '@/shared/mocks/mockEnv';
import { mockApi } from '@/shared/mocks/mockApi';
import { asRecord, asString, asNumber, asOptionalString, pick } from '@/shared/api/parse';

export type DashboardType = 'WEEK' | 'MONTH';

const normalizeDashboard = (raw: unknown): MenteeProfileData => {
  const obj = asRecord(raw, 'MenteeDashboardResponse');
  return {
    id: asString(pick(obj, ['menteeId', 'id']), 'MenteeDashboardResponse.menteeId'),
    name: asString(pick(obj, ['name']), 'MenteeDashboardResponse.name'),
    school: asOptionalString(pick(obj, ['schoolName', 'school_name']), 'MenteeDashboardResponse.schoolName') ?? '',
    grade: '',
    profileImgUrl:
      asOptionalString(
        pick(obj, ['profileImgUrl', 'profile_img_url', 'profileImageUrl', 'profileUrl']),
        'MenteeDashboardResponse.profileImgUrl'
      ) ?? null,
    stats: {
      todaySubmitted: asNumber(pick(obj, ['submittedTasksCount']), 'MenteeDashboardResponse.submittedTasksCount'),
      todayRemaining: asNumber(pick(obj, ['remainingTasksCount']), 'MenteeDashboardResponse.remainingTasksCount'),
      todayFeedbackComments: asNumber(pick(obj, ['feedbackQuestionsCount']), 'MenteeDashboardResponse.feedbackQuestionsCount'),
      todayTasksCount: asNumber(pick(obj, ['todayPlannerTodoCount']), 'MenteeDashboardResponse.todayPlannerTodoCount'),
    },
    achievement: {
      korean: asNumber(pick(obj, ['koreanProgress']), 'MenteeDashboardResponse.koreanProgress'),
      english: asNumber(pick(obj, ['englishProgress']), 'MenteeDashboardResponse.englishProgress'),
      math: asNumber(pick(obj, ['mathProgress']), 'MenteeDashboardResponse.mathProgress'),
    },
  };
};

export const menteeDashboardApi = {
  getByMenteeId: async (menteeId: string, type: DashboardType = 'WEEK'): Promise<MenteeProfileData> => {
    const data = USE_MOCK
      ? await mockApi.menteeDashboard.getByMenteeId(menteeId, type)
      : await apiClient.get(`/mentor/${menteeId}`, { params: { type } });
    return normalizeDashboard(data);
  },

  getMy: async (type: DashboardType = 'WEEK'): Promise<MenteeProfileData> => {
    const data = USE_MOCK
      ? await mockApi.menteeDashboard.getMy(type)
      : await apiClient.get('/mentee/me', { params: { type } });
    return normalizeDashboard(data);
  },
};
