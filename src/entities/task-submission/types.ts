export interface TaskSubmission {
  id: string;
  menteeComment: string | null;
  createdAt: string;
  taskId: string;
}

import { asRecord, asString, asOptionalString, pick } from '@/shared/api/parse';

export const mapTaskSubmissionFromApi = (raw: unknown): TaskSubmission => {
  const obj = asRecord(raw, 'TaskSubmission');
  return {
    id: asString(pick(obj, ['id']), 'TaskSubmission.id'),
    menteeComment: asOptionalString(pick(obj, ['menteeComment', 'mentee_comment']), 'TaskSubmission.menteeComment') ?? null,
    createdAt: asString(pick(obj, ['createdAt', 'created_at']), 'TaskSubmission.createdAt'),
    taskId: asString(pick(obj, ['taskId', 'task_id']), 'TaskSubmission.taskId'),
  };
};
