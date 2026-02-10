import { NotificationType } from '@/shared/constants/enums';
import { asRecord, asString, asBoolean, asOptionalString, asEnum, pick } from '@/shared/api/parse';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId?: string;
  targetType?: string;
  targetId?: string;
  targetTitle?: string;
  feedbackId?: string;
  taskId?: string;
  menteeId?: string;
}

const NOTIFICATION_TYPES: readonly NotificationType[] = [
  'REMINDER',
  'FEEDBACK',
  'SUBMISSION',
  'COMMENT',
  'TASK',
  'PLAN_FEEDBACK',
  'WEEKLY_REPORT',
  'ZOOM_FEEDBACK',
];

const cleanOptionalString = (value?: string): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

export const mapNotificationFromApi = (raw: unknown): Notification => {
  const obj = asRecord(raw, 'Notification');
  const targetType = cleanOptionalString(
    asOptionalString(pick(obj, ['targetType', 'target_type']), 'Notification.targetType')
  );
  const targetId = cleanOptionalString(
    asOptionalString(pick(obj, ['targetId', 'target_id']), 'Notification.targetId')
  );
  const feedbackId = cleanOptionalString(
    asOptionalString(pick(obj, ['feedbackId', 'feedback_id']), 'Notification.feedbackId')
  );
  const taskId = cleanOptionalString(
    asOptionalString(pick(obj, ['taskId', 'task_id']), 'Notification.taskId')
  );
  const menteeId = cleanOptionalString(
    asOptionalString(pick(obj, ['menteeId', 'mentee_id']), 'Notification.menteeId')
  );

  return {
    id: asString(pick(obj, ['id']), 'Notification.id'),
    type: asEnum(pick(obj, ['type']), NOTIFICATION_TYPES, 'Notification.type'),
    message: asString(pick(obj, ['message']), 'Notification.message'),
    isRead: asBoolean(pick(obj, ['isRead', 'is_read']), 'Notification.isRead'),
    createdAt: asString(pick(obj, ['createdAt', 'created_at']), 'Notification.createdAt'),
    userId: asOptionalString(pick(obj, ['userId', 'user_id']), 'Notification.userId'),
    targetType,
    targetId,
    targetTitle: asOptionalString(
      pick(obj, ['targetTitle', 'target_title', 'title', 'taskTitle', 'reportTitle']),
      'Notification.targetTitle'
    ),
    feedbackId,
    taskId,
    menteeId,
  };
};
