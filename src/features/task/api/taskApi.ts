import { apiClient } from '@/shared/api/base';
import { mapTaskFromApi } from '@/entities/task/types';
import type { TaskDetailFullData, FileData } from '@/entities/task-detail/types';
import type { Subject } from '@/shared/constants/subjects';
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

const safeOptionalString = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return undefined;
};

const toWeakness = (taskObj: Record<string, unknown>): TaskDetailFullData['weakness'] => {
  const weaknessRaw = pick(taskObj, ['weakness', 'weaknessInfo', 'weakness_info', 'weaknessDetail', 'weakness_detail']);
  const weaknessObj = isRecord(weaknessRaw) ? weaknessRaw : null;

  const title =
    safeOptionalString(
      weaknessObj ? pick(weaknessObj, ['title', 'weaknessTitle', 'weakness_title']) : undefined
    ) ??
    safeOptionalString(
      pick(taskObj, ['weaknessTitle', 'weakness_title', 'weaknessName', 'weakness_name', 'supplementTitle', 'supplement_title'])
    );

  const candidates: unknown[] = [];
  if (weaknessObj) {
    const nestedContent = pick(weaknessObj, [
      'studyContent',
      'study_content',
      'content',
      'file',
      'fileInfo',
      'file_info',
      'studyFile',
      'study_file',
    ]);
    if (nestedContent) candidates.push(nestedContent);
    candidates.push(weaknessObj);
  }

  const rootWeaknessFile = pick(taskObj, [
    'weaknessFile',
    'weakness_file',
    'weaknessContent',
    'weakness_content',
    'weaknessStudyContent',
    'weakness_study_content',
  ]);
  if (rootWeaknessFile) candidates.push(rootWeaknessFile);

  const rootFileInfo = {
    title: safeOptionalString(
      pick(taskObj, [
        'weaknessContentTitle',
        'weakness_content_title',
        'weaknessFileName',
        'weakness_file_name',
        'weaknessFileTitle',
        'weakness_file_title',
      ])
    ),
    url: safeOptionalString(
      pick(taskObj, [
        'weaknessContentUrl',
        'weakness_content_url',
        'weaknessFileUrl',
        'weakness_file_url',
      ])
    ),
  };
  if (rootFileInfo.title || rootFileInfo.url) candidates.push(rootFileInfo);

  let file: FileData | null = null;
  for (const candidate of candidates) {
    const parsed = toFileData(candidate);
    if (parsed) {
      file = parsed;
      break;
    }
  }

  if (!title && !file) return null;
  return {
    title: title ?? file?.title ?? '보완점',
    file,
  };
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
    const weakness = toWeakness(taskObj);

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
      weakness,
      submission,
    };
  },

  createMenteeTask: async (payload: { date: string; title: string; subject: string }) => {
    const data = await apiClient.post('/tasks', payload);
    return mapTaskFromApi(data);
  },

  updateTask: async (taskId: string, payload: { title?: string; subject?: string; status?: string }) => {
    const data = await apiClient.put(`/tasks/${taskId}`, payload);
    return mapTaskFromApi(data);
  },

  deleteTask: async (taskId: string): Promise<void> => {
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
    await apiClient.post(`/tasks/${menteeId}`, payload);
  },

  confirmMentorTask: async (taskId: string): Promise<void> => {
    await apiClient.patch(`/mentor/tasks/${taskId}/confirm`);
  },

  startTaskTimer: async (taskId: string) => {
    const data = await apiClient.patch(`/tasks/${taskId}/timer/start`);
    return data;
  },

  stopTaskTimer: async (taskId: string) => {
    const data = await apiClient.patch(`/tasks/${taskId}/timer/stop`);
    return data;
  },

  getTaskLogs: async (taskId: string) => {
    const data = await apiClient.get(`/tasks/${taskId}/logs`);
    if (Array.isArray(data)) return data;
    const obj = asRecord(data, 'TaskLogs');
    const list = asArray(pick(obj, ['content']), 'TaskLogs.content');
    return list;
  },
};
const SUBJECT_VALUES: readonly Subject[] = ['KOREAN', 'ENGLISH', 'MATH', 'OTHER'];
