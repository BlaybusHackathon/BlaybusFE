import { apiClient } from '@/shared/api/base';
import { USE_MOCK } from '@/shared/mocks/mockEnv';
import { mockApi } from '@/shared/mocks/mockApi';
import { asRecord, asString, asOptionalString, pick } from '@/shared/api/parse';

export interface StudyContent {
  id: string;
  title: string;
  subject?: string;
  fileUrl?: string | null;
}

const normalizeStudyContent = (raw: unknown): StudyContent => {
  if (typeof raw === 'number') {
    return { id: String(raw), title: '', subject: undefined, fileUrl: null };
  }
  const obj = asRecord(raw, 'StudyContent');
  return {
    id: asString(
      pick(obj, ['id', 'contentId', 'studyContentId', 'study_content_id']),
      'StudyContent.id'
    ),
    title: asString(pick(obj, ['title', 'name', 'fileName', 'file_name']), 'StudyContent.title'),
    subject: asOptionalString(pick(obj, ['subject', 'subjectType', 'category']), 'StudyContent.subject'),
    fileUrl:
      asOptionalString(
        pick(obj, ['fileUrl', 'file_url', 'contentUrl', 'content_url', 'url', 'path']),
        'StudyContent.fileUrl'
      ) ?? null,
  };
};

export const studyContentApi = {
  upload: async (file: File, payload?: { title?: string; subject?: string }): Promise<StudyContent> => {
    if (USE_MOCK) return mockApi.studyContent.upload(file, payload);
    const form = new FormData();
    form.append('file', file);
    if (payload?.title) form.append('title', payload.title);
    if (payload?.subject) form.append('subject', payload.subject);

    const data = await apiClient.post('/study-contents', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return normalizeStudyContent(data);
  },
};
