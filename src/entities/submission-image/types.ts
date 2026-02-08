export interface SubmissionImage {
  id: string;
  imageUrl: string | null;
  submissionId: string | null;
  questionId: string | null;
  answerId: string | null;
}

import { asRecord, asString, asOptionalString, pick } from '@/shared/api/parse';

export const mapSubmissionImageFromApi = (raw: unknown): SubmissionImage => {
  const obj = asRecord(raw, 'SubmissionImage');
  return {
    id: asString(pick(obj, ['id']), 'SubmissionImage.id'),
    imageUrl: asOptionalString(pick(obj, ['imageUrl', 'image_url', 'url']), 'SubmissionImage.imageUrl') ?? null,
    submissionId:
      asOptionalString(pick(obj, ['submissionId', 'submission_id']), 'SubmissionImage.submissionId') ?? null,
    questionId: asOptionalString(pick(obj, ['questionId', 'question_id']), 'SubmissionImage.questionId') ?? null,
    answerId: asOptionalString(pick(obj, ['answerId', 'answer_id']), 'SubmissionImage.answerId') ?? null,
  };
};
