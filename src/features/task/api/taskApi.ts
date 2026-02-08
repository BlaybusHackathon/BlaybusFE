import { apiClient } from '@/shared/api/base';
import { mapTaskFromApi } from '@/entities/task/types';
import type { TaskDetailFullData, FileData } from '@/entities/task-detail/types';
import type { Subject } from '@/shared/constants/subjects';
import { USE_MOCK } from '@/shared/mocks/mockEnv';
import { mockApi } from '@/shared/mocks/mockApi';
import { asArray, asOptionalString, asRecord, asString, isRecord, pick } from '@/shared/api/parse';

const toFileData = (raw: unknown): FileData | null => {
  if (!isRecord(raw)) return null;
  const url = asOptionalString(
    pick(raw, ['url', 'fileUrl', 'file_url', 'contentUrl', 'content_url', 'path']),
    'FileData.url'
  );
  const title = asOptionalString(
    pick(raw, ['title', 'fileName', 'file_name', 'name']),
    'FileData.title'
  ) ?? 'file';
  if (!url) return null;
  return { title, url };
};

const toSubmission = (raw: unknown): TaskDetailFullData['submission'] | null => {
  if (raw === null || raw === undefined) return null;
  const item = Array.isArray(raw)
    ? raw[0]
    : isRecord(raw) && Array.isArray(raw.content)
      ? raw.content[0]
      : raw;
  if (!isRecord(item)) return null;

  const imagesRaw = pick(item, ['images', 'imageUrls', 'image_urls']) ?? [];
  const imagesArray = Array.isArray(imagesRaw) ? imagesRaw : [];
  const images: string[] = [];
  const imageIds: string[] = [];

  imagesArray.forEach((img, idx) => {
    if (typeof img === 'string') {
      images.push(img);
      imageIds.push(String(idx));
      return;
    }
    if (!isRecord(img)) return;
    const url = asOptionalString(pick(img, ['imageUrl', 'url', 'image_url']), 'SubmissionImage.url');
    if (url) images.push(url);
    if (pick(img, ['id']) !== undefined && pick(img, ['id']) !== null) {
      imageIds.push(asString(pick(img, ['id']), 'SubmissionImage.id'));
    } else {
      imageIds.push(String(idx));
    }
  });

  return {
    id: asString(pick(item, ['id']), 'Submission.id'),
    images,
    imageIds: imageIds.length ? imageIds : undefined,
    memo: asOptionalString(pick(item, ['menteeComment', 'memo', 'comment']), 'Submission.memo') ?? '',
    isFeedbackReceived: true,
  };
};

export const taskApi = {
  getTaskDetail: async (taskId: string): Promise<TaskDetailFullData> => {
    if (USE_MOCK) return mockApi.task.getTaskDetail(taskId);
    const taskRaw = await apiClient.get(`/tasks/${taskId}`);
    let submissionRaw: unknown = null;
    try {
      submissionRaw = await apiClient.get(`/tasks/${taskId}/submissions`);
    } catch {
      submissionRaw = null;
    }

    const taskObj = asRecord(taskRaw, 'TaskDetail');
    const taskFileRaw = {
      title: asOptionalString(pick(taskObj, ['fileName', 'file_name']), 'TaskDetail.fileName') ?? '',
      url: asOptionalString(pick(taskObj, ['fileUrl', 'file_url']), 'TaskDetail.fileUrl') ?? '',
    };

    const submission = toSubmission(submissionRaw);

    return {
      id: asString(pick(taskObj, ['id']), 'TaskDetail.id'),
      title: asString(pick(taskObj, ['title']), 'TaskDetail.title'),
      subject: (() => {
        const raw = asOptionalString(pick(taskObj, ['subject']), 'TaskDetail.subject') ?? 'OTHER';
        return SUBJECT_VALUES.includes(raw as Subject) ? (raw as Subject) : 'OTHER';
      })(),
      taskDate: asString(pick(taskObj, ['taskDate', 'task_date', 'date']), 'TaskDetail.taskDate'),
      isMentorChecked: Boolean(pick(taskObj, ['isMentorChecked', 'is_mentor_checked'])),
      description: asOptionalString(pick(taskObj, ['description', 'desc']), 'TaskDetail.description'),
      taskFile: taskFileRaw.url ? toFileData(taskFileRaw) : null,
      weakness: null,
      submission,
    };
  },

  createMenteeTask: async (payload: { date: string; title: string; subject: string }) => {
    if (USE_MOCK) return mockApi.task.createMenteeTask(payload);
    const data = await apiClient.post('/tasks', payload);
    return mapTaskFromApi(data);
  },

  updateTask: async (taskId: string, payload: { title?: string; subject?: string; status?: string }) => {
    if (USE_MOCK) return mockApi.task.updateTask(taskId, payload);
    const data = await apiClient.put(`/tasks/${taskId}`, payload);
    return mapTaskFromApi(data);
  },

  deleteTask: async (taskId: string): Promise<void> => {
    if (USE_MOCK) return mockApi.task.deleteTask(taskId);
    await apiClient.delete(`/tasks/${taskId}`);
  },

  createMentorTask: async (
    menteeId: string,
    payload: {
      subject: string;
      weekNumber: number;
      startDate: string;
      endDate: string;
      daysOfWeek: string[];
      title: string;
      weaknessId?: string | number | null;
      dayContents: Array<{ day: string; contentId?: string | number | null }>;
    }
  ): Promise<void> => {
    if (USE_MOCK) return mockApi.task.createMentorTask(menteeId, payload);
    await apiClient.post(`/tasks/${menteeId}`, payload);
  },

  confirmMentorTask: async (taskId: string): Promise<void> => {
    if (USE_MOCK) return mockApi.task.confirmMentorTask(taskId);
    await apiClient.patch(`/mentor/tasks/${taskId}/confirm`);
  },

  startTaskTimer: async (taskId: string) => {
    if (USE_MOCK) return mockApi.task.startTaskTimer(taskId);
    const data = await apiClient.patch(`/tasks/${taskId}/timer/start`);
    return data;
  },

  stopTaskTimer: async (taskId: string) => {
    if (USE_MOCK) return mockApi.task.stopTaskTimer(taskId);
    const data = await apiClient.patch(`/tasks/${taskId}/timer/stop`);
    return data;
  },

  getTaskLogs: async (taskId: string) => {
    if (USE_MOCK) return mockApi.task.getTaskLogs(taskId);
    const data = await apiClient.get(`/tasks/${taskId}/logs`);
    if (Array.isArray(data)) return data;
    const obj = asRecord(data, 'TaskLogs');
    const list = asArray(pick(obj, ['content']), 'TaskLogs.content');
    return list;
  },
};
const SUBJECT_VALUES: readonly Subject[] = ['KOREAN', 'ENGLISH', 'MATH', 'OTHER'];
