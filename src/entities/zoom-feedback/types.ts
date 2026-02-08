export interface ZoomFeedback {
  id: string;
  meetingDate: string;
  summary: string;
  createdAt: string;
  inforId: string;
}

import { asRecord, asString, pick } from '@/shared/api/parse';

export const mapZoomFeedbackFromApi = (raw: unknown): ZoomFeedback => {
  const obj = asRecord(raw, 'ZoomFeedback');
  return {
    id: asString(pick(obj, ['id', 'feedbackId']), 'ZoomFeedback.id'),
    meetingDate: asString(pick(obj, ['meetingDate', 'meeting_date']), 'ZoomFeedback.meetingDate'),
    summary: asString(pick(obj, ['summary', 'title', 'memo', 'comment']), 'ZoomFeedback.summary'),
    createdAt: asString(pick(obj, ['createdAt', 'created_at']), 'ZoomFeedback.createdAt'),
    inforId: asString(pick(obj, ['inforId', 'infor_id']), 'ZoomFeedback.inforId'),
  };
};
