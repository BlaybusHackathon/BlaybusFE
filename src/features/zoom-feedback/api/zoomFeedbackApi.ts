import { apiClient } from '@/shared/api/base';
import type { ZoomFeedbackData, ZoomFeedbackListItem } from '../model/types';
import { USE_MOCK } from '@/shared/mocks/mockEnv';
import { mockApi } from '@/shared/mocks/mockApi';
import { asArray, asOptionalString, asRecord, asString, isRecord, pick } from '@/shared/api/parse';

const normalizeDetail = (raw: unknown): ZoomFeedbackData => {
  if (typeof raw === 'number' || typeof raw === 'string') {
    return {
      id: String(raw),
      title: '',
      memo: '',
      subjects: { korean: '', english: '', math: '' },
      operation: '',
      meetingDate: undefined,
    };
  }
  const obj = asRecord(raw, 'ZoomFeedbackDetail');
  const subjectsRaw = pick(obj, ['subjects']);
  const subjectsObj = isRecord(subjectsRaw) ? subjectsRaw : undefined;

  const korean =
    (subjectsObj ? asOptionalString(pick(subjectsObj, ['korean']), 'ZoomFeedbackDetail.subjects.korean') : undefined) ??
    asOptionalString(pick(obj, ['koreanFeedback', 'korean', 'korean_feedback']), 'ZoomFeedbackDetail.koreanFeedback') ??
    '';
  const english =
    (subjectsObj ? asOptionalString(pick(subjectsObj, ['english']), 'ZoomFeedbackDetail.subjects.english') : undefined) ??
    asOptionalString(pick(obj, ['englishFeedback', 'english', 'english_feedback']), 'ZoomFeedbackDetail.englishFeedback') ??
    '';
  const math =
    (subjectsObj ? asOptionalString(pick(subjectsObj, ['math']), 'ZoomFeedbackDetail.subjects.math') : undefined) ??
    asOptionalString(pick(obj, ['mathFeedback', 'math', 'math_feedback']), 'ZoomFeedbackDetail.mathFeedback') ??
    '';

  return {
    id: asOptionalString(pick(obj, ['id', 'feedbackId', 'feedback_id']), 'ZoomFeedbackDetail.id'),
    title: asOptionalString(pick(obj, ['title']), 'ZoomFeedbackDetail.title'),
    memo:
      asOptionalString(pick(obj, ['memo', 'comment']), 'ZoomFeedbackDetail.memo') ??
      '',
    subjects: {
      korean,
      english,
      math,
    },
    operation:
      asOptionalString(pick(obj, ['operateFeedback', 'operation', 'operational', 'operation_feedback']), 'ZoomFeedbackDetail.operation') ??
      '',
    meetingDate: asOptionalString(pick(obj, ['meetingDate', 'meeting_date']), 'ZoomFeedbackDetail.meetingDate'),
  };
};

const normalizeListItem = (raw: unknown): ZoomFeedbackListItem => {
  const obj = asRecord(raw, 'ZoomFeedbackListItem');
  return {
    id: asString(pick(obj, ['id', 'feedbackId', 'feedback_id']), 'ZoomFeedbackListItem.id'),
    meetingDate: asString(
      pick(obj, ['meetingDate', 'meeting_date', 'createdAt', 'created_at']),
      'ZoomFeedbackListItem.meetingDate'
    ),
    summary: asOptionalString(pick(obj, ['title', 'summary', 'memo', 'comment']), 'ZoomFeedbackListItem.summary'),
  };
};

export const zoomFeedbackApi = {
  list: async (params?: { menteeId?: string }): Promise<ZoomFeedbackListItem[]> => {
    if (USE_MOCK) return mockApi.zoom.list();
    const data = params?.menteeId
      ? await apiClient.get(`/mentor/list/${params.menteeId}`)
      : await apiClient.get('/mentee/list');
    const list = Array.isArray(data)
      ? data
      : asArray(pick(asRecord(data, 'ZoomFeedbackList'), ['content']), 'ZoomFeedbackList.content');
    return list.map(normalizeListItem);
  },

  getById: async (zoomId: string): Promise<ZoomFeedbackData> => {
    if (USE_MOCK) return mockApi.zoom.getById(zoomId);
    try {
      const data = await apiClient.get(`/mentor/zoom-feedback/${zoomId}`);
      return normalizeDetail(data);
    } catch {
      const data = await apiClient.get(`/mentee/zoom-feedback/${zoomId}`);
      return normalizeDetail(data);
    }
  },

  create: async (payload: { menteeId?: string } & ZoomFeedbackData): Promise<ZoomFeedbackData> => {
    if (USE_MOCK) return mockApi.zoom.create(payload);
    if (!payload.menteeId) throw new Error('menteeId is required');
    const data = await apiClient.post(`/mentor/zoom-feedback/${payload.menteeId}`, {
      title: payload.title ?? '',
      memo: payload.memo,
      koreanFeedback: payload.subjects?.korean ?? '',
      mathFeedback: payload.subjects?.math ?? '',
      englishFeedback: payload.subjects?.english ?? '',
      operateFeedback: payload.operation ?? '',
      meetingDate: payload.meetingDate,
    });
    return normalizeDetail(data);
  },

  update: async (zoomId: string, payload: ZoomFeedbackData): Promise<ZoomFeedbackData> => {
    if (USE_MOCK) return mockApi.zoom.update(zoomId, payload);
    const data = await apiClient.put(`/zoom-feedback/${zoomId}`, {
      title: payload.title ?? '',
      memo: payload.memo,
      koreanFeedback: payload.subjects?.korean ?? '',
      mathFeedback: payload.subjects?.math ?? '',
      englishFeedback: payload.subjects?.english ?? '',
      operateFeedback: payload.operation ?? '',
      meetingDate: payload.meetingDate,
    });
    return normalizeDetail(data);
  },

  remove: async (zoomId: string): Promise<void> => {
    if (USE_MOCK) return mockApi.zoom.remove(zoomId);
    await apiClient.delete(`/mentor/zoom-feedback/${zoomId}`);
  },
};
