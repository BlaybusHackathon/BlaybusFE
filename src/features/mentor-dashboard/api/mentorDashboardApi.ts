import { menteeDashboardApi } from '@/features/mentee-dashboard/api/menteeDashboardApi';
import { mentoringApi } from '@/features/mentoring/api/mentoringApi';
import { notificationApi } from '@/features/notification/api/notificationApi';
import type { Notification } from '@/entities/notification/types';
import type {
  DashboardStats,
  MenteeSummary,
  RecentSubmittedTask,
  RecentFeedbackComment,
} from '@/pages/mentor/mypage/model/types';
import type { MenteeProfileData } from '@/widgets/mentee-profile/model/types';

export interface MentorDashboardData {
  stats: DashboardStats;
  mentees: MenteeSummary[];
  recentTasks: RecentSubmittedTask[];
  recentComments: RecentFeedbackComment[];
}

const DEFAULT_STATS: DashboardStats = {
  uncheckedTaskCount: 0,
  pendingFeedbackCount: 0,
};

const RECENT_LIMIT = 5;
const SUBJECT_LABEL_MAP: Record<string, RecentSubmittedTask['subject']> = {
  국어: 'KOREAN',
  수학: 'MATH',
  영어: 'ENGLISH',
};

const parseGrade = (value?: string): number | undefined => {
  if (!value) return undefined;
  const match = value.match(/\d+/);
  if (!match) return undefined;
  const parsed = Number(match[0]);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const toMenteeSummary = (profile: MenteeProfileData, fallbackName?: string): MenteeSummary => ({
  id: profile.id,
  name: profile.name || fallbackName || '',
  profileImgUrl: profile.profileImgUrl ?? null,
  achievement: profile.achievement,
  school: profile.school || undefined,
  grade: parseGrade(profile.grade),
  lastActiveAt: null,
});

const toFallbackSummary = (mentee: { id: string; name: string }): MenteeSummary => ({
  id: mentee.id,
  name: mentee.name,
  profileImgUrl: null,
  achievement: { korean: 0, english: 0, math: 0 },
  school: undefined,
  grade: undefined,
  lastActiveAt: null,
});

const extractAuthorName = (message: string): string | undefined => {
  const trimmed = message.trim();
  if (!trimmed) return undefined;
  const match = trimmed.match(/^(.+?)\s*(멘티|멘토)?님?이/);
  return match ? match[1].trim() : undefined;
};

const parseSubmissionMessage = (message: string) => {
  const parts = message.split(':');
  if (parts.length < 2) {
    return { subject: 'OTHER' as RecentSubmittedTask['subject'], title: message };
  }
  const rest = parts.slice(1).join(':').trim();
  if (!rest) return { subject: 'OTHER' as RecentSubmittedTask['subject'], title: message };
  const [subjectLabel, ...titleParts] = rest.split(' ');
  const subject = SUBJECT_LABEL_MAP[subjectLabel] ?? 'OTHER';
  const title = SUBJECT_LABEL_MAP[subjectLabel] ? titleParts.join(' ').trim() : rest;
  return { subject, title: title || rest };
};

const toRecentSubmittedTask = (item: Notification): RecentSubmittedTask | null => {
  const taskId = item.taskId || item.targetId;
  const menteeId = item.menteeId;
  if (!taskId || !menteeId) return null;
  const message = item.message ?? '';
  const { subject, title } = parseSubmissionMessage(message);
  return {
    id: taskId,
    title: title || message || '과제',
    subject,
    menteeId,
    menteeName: extractAuthorName(message) ?? '멘티',
    submittedAt: item.createdAt,
  };
};

const toRecentComment = (item: Notification): RecentFeedbackComment | null => {
  const taskId = item.taskId;
  const feedbackId = item.feedbackId || item.targetId;
  const menteeId = item.menteeId;
  if (!taskId || !feedbackId || !menteeId) return null;
  const message = item.message ?? '';
  return {
    id: item.id,
    content: message || '댓글 알림',
    menteeId,
    menteeName: extractAuthorName(message) ?? '멘티',
    taskId,
    feedbackId,
    createdAt: item.createdAt,
    isRead: item.isRead,
  };
};

export const mentorDashboardApi = {
  get: async (): Promise<MentorDashboardData> => {
    // Backend spec does not expose /mentor/dashboard. Build a minimal dashboard from existing endpoints.
    const mentees = await mentoringApi.listMentees({ page: 0, size: 20 });
    if (mentees.length === 0) {
      return {
        stats: DEFAULT_STATS,
        mentees: [],
        recentTasks: [],
        recentComments: [],
      };
    }

    const [results, notifications] = await Promise.all([
      Promise.allSettled(
        mentees.map((mentee) => menteeDashboardApi.getByMenteeId(mentee.id))
      ),
      notificationApi.list({ filter: 'all', page: 0, size: 50 }).catch(() => ({
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 0,
        number: 0,
      })),
    ]);

    const sortedNotifications = [...notifications.content].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });

    const recentTasks = sortedNotifications
      .filter((item) => item.type === 'SUBMISSION')
      .map(toRecentSubmittedTask)
      .filter((item): item is RecentSubmittedTask => Boolean(item))
      .slice(0, RECENT_LIMIT);

    const recentComments = sortedNotifications
      .filter((item) => item.type === 'COMMENT')
      .map(toRecentComment)
      .filter((item): item is RecentFeedbackComment => Boolean(item))
      .slice(0, RECENT_LIMIT);

    return {
      stats: DEFAULT_STATS,
      mentees: results.map((result, index) => {
        const mentee = mentees[index];
        if (result.status === 'fulfilled') {
          return toMenteeSummary(result.value, mentee.name);
        }
        return toFallbackSummary(mentee);
      }),
      recentTasks,
      recentComments,
    };
  },
};
