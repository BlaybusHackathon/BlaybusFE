export interface Answer {
  id: string;
  comment: string;
  userId: string;
  feedbackId: string;
  createdAt: string;
  authorName?: string;
  authorRole?: string;
}

import { asRecord, asString, asOptionalString, pick } from '@/shared/api/parse';

export const mapAnswerFromApi = (raw: unknown, fallback?: { feedbackId?: string; userId?: string }): Answer => {
  const obj = asRecord(raw, 'Answer');
  return {
    id: asString(pick(obj, ['id']), 'Answer.id'),
    comment: asString(pick(obj, ['comment']), 'Answer.comment'),
    userId: asOptionalString(pick(obj, ['userId', 'user_id', 'authorId', 'author_id']), 'Answer.userId') ?? fallback?.userId ?? '',
    feedbackId:
      asOptionalString(pick(obj, ['feedbackId', 'feedback_id']), 'Answer.feedbackId') ?? fallback?.feedbackId ?? '',
    createdAt: asString(pick(obj, ['createdAt', 'created_at']), 'Answer.createdAt'),
    authorName: asOptionalString(pick(obj, ['authorName', 'author_name']), 'Answer.authorName'),
    authorRole: asOptionalString(pick(obj, ['role', 'authorRole', 'author_role']), 'Answer.authorRole'),
  };
};
