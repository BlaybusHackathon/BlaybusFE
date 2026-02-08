export interface Question {
  id: string;
  userId: string;
  comment: string;
  createdAt: string;
  taskId: string;
}

import { asRecord, asString, pick } from '@/shared/api/parse';

export const mapQuestionFromApi = (raw: unknown): Question => {
  const obj = asRecord(raw, 'Question');
  return {
    id: asString(pick(obj, ['id']), 'Question.id'),
    userId: asString(pick(obj, ['userId', 'user_id']), 'Question.userId'),
    comment: asString(pick(obj, ['comment']), 'Question.comment'),
    createdAt: asString(pick(obj, ['createdAt', 'created_at']), 'Question.createdAt'),
    taskId: asString(pick(obj, ['taskId', 'task_id']), 'Question.taskId'),
  };
};
