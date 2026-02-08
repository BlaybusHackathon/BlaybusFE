import { apiClient } from '@/shared/api/base';
import type { TaskFeedback } from '@/entities/task-feedback/types';
import type { Answer } from '@/entities/answer/types';
import { mapTaskFeedbackFromApi } from '@/entities/task-feedback/types';
import { mapAnswerFromApi } from '@/entities/answer/types';
import type { FeedbackWithTask } from '../model/types';
import { USE_MOCK } from '@/shared/mocks/mockEnv';
import { mockApi } from '@/shared/mocks/mockApi';
import { asArray, asOptionalNumber, asOptionalString, asRecord, isRecord, pick } from '@/shared/api/parse';
import type { Subject } from '@/shared/constants/enums';

const normalizeFeedback = (raw: unknown, fallback?: { imageId?: string }): TaskFeedback => {
  const obj = asRecord(raw, 'TaskFeedback');
  const needsImageFallback = Boolean(
    fallback?.imageId && !('imageId' in obj) && !('image_id' in obj)
  );
  const mapped = mapTaskFeedbackFromApi(needsImageFallback ? { ...obj, imageId: fallback?.imageId } : obj);
  return { ...mapped, imageId: mapped.imageId || fallback?.imageId || '' };
};

const normalizeAnswer = (raw: unknown, fallback?: { feedbackId?: string }): Answer => {
  if (isRecord(raw)) {
    const withFallback = fallback?.feedbackId && !('feedbackId' in raw) && !('feedback_id' in raw)
      ? { ...raw, feedbackId: fallback.feedbackId }
      : raw;
    return mapAnswerFromApi(withFallback, fallback);
  }
  return mapAnswerFromApi(raw, fallback);
};

const normalizeFeedbackWithTask = (raw: unknown): FeedbackWithTask => {
  const obj = asRecord(raw, 'FeedbackWithTask');
  const base = normalizeFeedback(obj);
  const taskTitle = asOptionalString(pick(obj, ['taskTitle', 'task_title']), 'FeedbackWithTask.taskTitle') ?? '';
  const taskDate = asOptionalString(pick(obj, ['taskDate', 'task_date']), 'FeedbackWithTask.taskDate');
  const weekNumber = asOptionalNumber(pick(obj, ['weekNumber', 'week_number']), 'FeedbackWithTask.weekNumber');
  const menteeName =
    asOptionalString(pick(obj, ['menteeName', 'mentee_name']), 'FeedbackWithTask.menteeName') ??
    (isRecord(obj.mentee) ? asOptionalString(pick(obj.mentee, ['name']), 'FeedbackWithTask.mentee.name') : undefined);
  const authorName =
    asOptionalString(pick(obj, ['mentorName', 'authorName', 'author_name']), 'FeedbackWithTask.authorName') ?? '';
  const authorProfileUrl =
    asOptionalString(pick(obj, ['authorProfileUrl', 'author_profile_url']), 'FeedbackWithTask.authorProfileUrl') ?? null;
  const subject = asOptionalString(pick(obj, ['subject']), 'FeedbackWithTask.subject') as Subject | undefined;

  return {
    ...base,
    taskTitle,
    taskDate,
    weekNumber,
    menteeName,
    authorName,
    authorProfileUrl,
    subject,
  };
};

export const feedbackApi = {
  getFeedbacksByImageId: async (imageId: string): Promise<TaskFeedback[]> => {
    if (USE_MOCK) return mockApi.feedback.getFeedbacksByImageId(imageId);
    try {
      const data = await apiClient.get(`/images/${imageId}/feedback`);
      const list = Array.isArray(data)
        ? data
        : asArray(pick(asRecord(data, 'FeedbackList'), ['content']), 'FeedbackList.content');
      return list.map((item) => normalizeFeedback(item, { imageId }));
    } catch (e) {
      if (isRecord(e) && (e.code === '404' || e.code === 'FEEDBACK_NOT_FOUND')) {
        return [];
      }
      throw e;
    }
  },

  getYesterdayFeedbacks: async (): Promise<FeedbackWithTask[]> => {
    if (USE_MOCK) return mockApi.feedback.getYesterdayFeedbacks();
    const data = await apiClient.get('/feedbacks/yesterday');
    const list = Array.isArray(data)
      ? data
      : asArray(pick(asRecord(data, 'FeedbackYesterday'), ['content']), 'FeedbackYesterday.content');
    return list.map(normalizeFeedbackWithTask);
  },

  getFeedbackHistory: async (params: {
    menteeId: string;
    year?: number;
    month?: number;
    weekNumber?: number | 'ALL';
    subject?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<FeedbackWithTask[]> => {
    if (USE_MOCK) return mockApi.feedback.getFeedbackHistory();
    const query: Record<string, string | number> = { menteeId: params.menteeId };
    if (params.year) query.year = params.year;
    if (params.month) query.month = params.month;
    if (params.weekNumber && params.weekNumber !== 'ALL') query.weekNumber = params.weekNumber;
    if (params.subject && params.subject !== 'ALL') query.subject = params.subject;
    if (params.startDate) query.startDate = params.startDate;
    if (params.endDate) query.endDate = params.endDate;

    const data = await apiClient.get('/feedbacks/history', { params: query });
    const list = Array.isArray(data)
      ? data
      : asArray(pick(asRecord(data, 'FeedbackHistory'), ['content']), 'FeedbackHistory.content');
    return list.map(normalizeFeedbackWithTask);
  },

  createFeedback: async (
    imageId: string,
    payload: {
      content: string;
      xPos: number;
      yPos: number;
      file?: File | null;
    }
  ): Promise<TaskFeedback> => {
    if (USE_MOCK) return mockApi.feedback.createFeedback(imageId, payload);
    const form = new FormData();
    const xPos = payload.xPos > 1 ? payload.xPos / 100 : payload.xPos;
    const yPos = payload.yPos > 1 ? payload.yPos / 100 : payload.yPos;
    form.append('content', payload.content);
    form.append('xPos', String(xPos));
    form.append('yPos', String(yPos));
    if (payload.file) form.append('file', payload.file);

    const data = await apiClient.post(`/images/${imageId}/feedback`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return normalizeFeedback(data, { imageId });
  },

  updateFeedback: async (feedbackId: string, payload: { content?: string; imageUrl?: string | null; xPos?: number; yPos?: number; }) => {
    if (USE_MOCK) return mockApi.feedback.updateFeedback(feedbackId, payload);
    const normalized = {
      ...payload,
      xPos: payload.xPos === undefined ? undefined : (payload.xPos > 1 ? payload.xPos / 100 : payload.xPos),
      yPos: payload.yPos === undefined ? undefined : (payload.yPos > 1 ? payload.yPos / 100 : payload.yPos),
    };
    const data = await apiClient.put(`/feedback/${feedbackId}`, normalized);
    return normalizeFeedback(data);
  },

  deleteFeedback: async (feedbackId: string): Promise<void> => {
    if (USE_MOCK) return mockApi.feedback.deleteFeedback(feedbackId);
    await apiClient.delete(`/feedback/${feedbackId}`);
  },

  getComments: async (feedbackId: string): Promise<Answer[]> => {
    if (USE_MOCK) return mockApi.feedback.getComments(feedbackId);
    const data = await apiClient.get(`/feedback/${feedbackId}/comments`);
    const list = Array.isArray(data)
      ? data
      : asArray(pick(asRecord(data, 'FeedbackComments'), ['content']), 'FeedbackComments.content');
    return list.map((item) => normalizeAnswer(item, { feedbackId }));
  },

  createComment: async (feedbackId: string, comment: string): Promise<Answer> => {
    if (USE_MOCK) return mockApi.feedback.createComment(feedbackId, comment);
    const data = await apiClient.post(`/feedback/${feedbackId}/comments`, { comment });
    return normalizeAnswer(data, { feedbackId });
  },

  updateComment: async (_feedbackId: string, commentId: string, comment: string): Promise<Answer | null> => {
    if (USE_MOCK) return mockApi.feedback.updateComment(_feedbackId, commentId, comment);
    const data = await apiClient.put(`/feedback/comments/${commentId}`, { comment });
    return normalizeAnswer(data, { feedbackId: _feedbackId });
  },

  deleteComment: async (_feedbackId: string, commentId: string): Promise<void> => {
    if (USE_MOCK) return mockApi.feedback.deleteComment(_feedbackId, commentId);
    await apiClient.delete(`/feedback/comments/${commentId}`);
  },
};
