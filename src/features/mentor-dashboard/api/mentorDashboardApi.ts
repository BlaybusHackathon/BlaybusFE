import { apiClient } from '@/shared/api/base';
import type {
  DashboardStats,
  MenteeSummary,
  RecentSubmittedTask,
  RecentFeedbackComment,
} from '@/pages/mentor/mypage/model/types';
import { USE_MOCK } from '@/shared/mocks/mockEnv';
import { mockApi } from '@/shared/mocks/mockApi';
import { asRecord, asString, asNumber, asOptionalString, asOptionalBoolean, asOptionalNumber, pick } from '@/shared/api/parse';

export interface MentorDashboardData {
  stats: DashboardStats;
  mentees: MenteeSummary[];
  recentTasks: RecentSubmittedTask[];
  recentComments: RecentFeedbackComment[];
}

const normalizeStats = (raw: unknown): DashboardStats => {
  const obj = asRecord(raw, 'MentorDashboard.stats');
  return {
    uncheckedTaskCount: asNumber(
      pick(obj, ['uncheckedTaskCount', 'unchecked_task_count']),
      'MentorDashboard.stats.uncheckedTaskCount'
    ),
    pendingFeedbackCount: asNumber(
      pick(obj, ['pendingFeedbackCount', 'pending_feedback_count']),
      'MentorDashboard.stats.pendingFeedbackCount'
    ),
  };
};

const normalizeAchievement = (raw: unknown) => {
  const obj = asRecord(raw, 'MentorDashboard.achievement');
  return {
    korean: asNumber(pick(obj, ['korean', 'korean_achievement']), 'MentorDashboard.achievement.korean'),
    english: asNumber(pick(obj, ['english', 'english_achievement']), 'MentorDashboard.achievement.english'),
    math: asNumber(pick(obj, ['math', 'math_achievement']), 'MentorDashboard.achievement.math'),
  };
};

const normalizeMentee = (raw: unknown): MenteeSummary => {
  const obj = asRecord(raw, 'MentorDashboard.mentee');
  return {
    id: asString(pick(obj, ['id']), 'MentorDashboard.mentee.id'),
    name: asString(pick(obj, ['name']), 'MentorDashboard.mentee.name'),
    profileImgUrl:
      asOptionalString(pick(obj, ['profileImageUrl', 'profile_img_url', 'profileImgUrl']), 'MentorDashboard.mentee.profileImgUrl') ?? null,
    achievement: normalizeAchievement(obj.achievement ?? obj),
    school: asOptionalString(pick(obj, ['school']), 'MentorDashboard.mentee.school'),
    grade: asOptionalNumber(pick(obj, ['grade']), 'MentorDashboard.mentee.grade') ?? undefined,
    lastActiveAt: asOptionalString(pick(obj, ['lastActiveAt', 'last_active_at']), 'MentorDashboard.mentee.lastActiveAt') ?? null,
  };
};

const normalizeTask = (raw: unknown): RecentSubmittedTask => {
  const obj = asRecord(raw, 'MentorDashboard.recentTask');
  return {
    id: asString(pick(obj, ['taskId', 'id']), 'MentorDashboard.recentTask.id'),
    title: asString(pick(obj, ['title']), 'MentorDashboard.recentTask.title'),
    subject: asString(pick(obj, ['subject']), 'MentorDashboard.recentTask.subject'),
    menteeId: asString(pick(obj, ['menteeId', 'mentee_id']), 'MentorDashboard.recentTask.menteeId'),
    menteeName: asString(pick(obj, ['menteeName', 'mentee_name']), 'MentorDashboard.recentTask.menteeName'),
    submittedAt: asString(pick(obj, ['submittedAt', 'submitted_at']), 'MentorDashboard.recentTask.submittedAt'),
  };
};

const normalizeComment = (raw: unknown): RecentFeedbackComment => {
  const obj = asRecord(raw, 'MentorDashboard.recentComment');
  return {
    id: asString(pick(obj, ['commentId', 'id']), 'MentorDashboard.recentComment.id'),
    content: asString(pick(obj, ['content']), 'MentorDashboard.recentComment.content'),
    menteeId: asString(pick(obj, ['menteeId', 'mentee_id']), 'MentorDashboard.recentComment.menteeId'),
    menteeName: asString(pick(obj, ['menteeName', 'mentee_name']), 'MentorDashboard.recentComment.menteeName'),
    taskId: asString(pick(obj, ['taskId', 'task_id']), 'MentorDashboard.recentComment.taskId'),
    feedbackId: asString(pick(obj, ['feedbackId', 'feedback_id']), 'MentorDashboard.recentComment.feedbackId'),
    createdAt: asString(pick(obj, ['createdAt', 'created_at']), 'MentorDashboard.recentComment.createdAt'),
    isRead: asOptionalBoolean(pick(obj, ['isRead', 'is_read']), 'MentorDashboard.recentComment.isRead') ?? false,
  };
};

export const mentorDashboardApi = {
  get: async (): Promise<MentorDashboardData> => {
    if (USE_MOCK) return mockApi.mentorDashboard.get();
    const data = await apiClient.get('/mentor/dashboard');
    const obj = asRecord(data, 'MentorDashboardResponse');

    return {
      stats: normalizeStats(obj.stats ?? obj),
      mentees: Array.isArray(obj.mentees) ? obj.mentees.map(normalizeMentee) : [],
      recentTasks: Array.isArray(obj.recentTasks) ? obj.recentTasks.map(normalizeTask) : [],
      recentComments: Array.isArray(obj.recentComments) ? obj.recentComments.map(normalizeComment) : [],
    };
  },
};
