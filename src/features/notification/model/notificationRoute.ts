import type { Notification } from '@/entities/notification/types';
import type { UserRole } from '@/shared/constants/enums';

const buildMentorTaskRoute = (menteeId: string, taskId: string, feedbackId?: string) => {
  const base = `/mentor/mentee/${menteeId}/task/${taskId}`;
  return feedbackId ? `${base}?feedbackId=${feedbackId}` : base;
};

const buildMenteeTaskRoute = (taskId: string, feedbackId?: string) => {
  const base = `/mentee/task/${taskId}`;
  return feedbackId ? `${base}?feedbackId=${feedbackId}` : base;
};

export const getNotificationRoute = (item: Notification, role: UserRole): string | null => {
  const taskId = item.taskId || (item.type === 'TASK' || item.type === 'SUBMISSION' ? item.targetId : undefined);
  const feedbackId = item.feedbackId || (item.type === 'COMMENT' || item.type === 'FEEDBACK' ? item.targetId : undefined);
  const menteeId = item.menteeId;

  if (item.type === 'COMMENT' || item.type === 'FEEDBACK') {
    if (!taskId) return null;
    if (role === 'MENTOR') {
      if (!menteeId) return null;
      return buildMentorTaskRoute(menteeId, taskId, feedbackId);
    }
    return buildMenteeTaskRoute(taskId, feedbackId);
  }

  if (item.type === 'SUBMISSION' || item.type === 'TASK') {
    if (!taskId) return null;
    if (role === 'MENTOR') {
      if (!menteeId) return null;
      return buildMentorTaskRoute(menteeId, taskId);
    }
    return buildMenteeTaskRoute(taskId);
  }

  if (item.type === 'WEEKLY_REPORT' && item.targetId) {
    if (role === 'MENTOR') {
      if (!menteeId) return null;
      return `/mentor/mentee/${menteeId}/report/${item.targetId}`;
    }
    return `/mentee/report/${item.targetId}`;
  }

  if (item.type === 'ZOOM_FEEDBACK' && item.targetId) {
    if (role === 'MENTOR') {
      if (!menteeId) return null;
      return `/mentor/mentee/${menteeId}/zoom/${item.targetId}`;
    }
    return `/mentee/feedback/zoom/${item.targetId}`;
  }

  if (item.type === 'PLAN_FEEDBACK' || item.type === 'REMINDER') {
    return role === 'MENTOR' ? '/mentor' : '/mentee/planner';
  }

  return null;
};
