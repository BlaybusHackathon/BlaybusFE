import { Subject, TaskStatus } from '@/shared/constants/enums';
import {
  asRecord,
  asString,
  asOptionalString,
  asOptionalNumber,
  asOptionalBoolean,
  asBoolean,
  asEnum,
  pick,
} from '@/shared/api/parse';

export interface Task {
  id: string;
  subject: Subject;
  title: string;
  status: TaskStatus;
  taskDate: string;
  isMentorChecked: boolean;
  isMandatory: boolean;
  contentId: string | null;
  weaknessId: string | null;
  menteeId: string;
  submitted?: boolean;
  actualStudyTime?: number | null;
  actualStudyTimeFormatted?: string | null;
}

const SUBJECT_VALUES: readonly Subject[] = ['KOREAN', 'ENGLISH', 'MATH', 'OTHER'];
const TASK_STATUS_VALUES: readonly TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

const normalizeTaskStatus = (raw: unknown): TaskStatus => {
  if (typeof raw === 'string') {
    const normalized = raw.trim().toUpperCase().replace(/[\s-]+/g, '_');
    if (normalized === 'INPROGRESS') return 'IN_PROGRESS';
    if (normalized === 'IN_PROGRESS') return 'IN_PROGRESS';
    if (normalized === 'DONE' || normalized === 'COMPLETE' || normalized === 'COMPLETED' || normalized === 'FINISHED') {
      return 'DONE';
    }
    if (normalized === 'TODO' || normalized === 'PENDING' || normalized === 'READY') return 'TODO';
  }

  console.warn('[Task.status] Unrecognized status value:', raw);
  return 'TODO';
};

export const mapTaskFromApi = (raw: unknown): Task => {
  const obj = asRecord(raw, 'Task');
  const statusRaw = pick(obj, ['status', 'taskStatus', 'task_status']);
  return {
    id: asString(pick(obj, ['id', 'taskId']), 'Task.id'),
    subject: asEnum(pick(obj, ['subject']), SUBJECT_VALUES, 'Task.subject'),
    title: asString(pick(obj, ['title']), 'Task.title'),
    status: statusRaw !== undefined ? normalizeTaskStatus(statusRaw) : asEnum('TODO', TASK_STATUS_VALUES, 'Task.status'),
    taskDate: asString(pick(obj, ['taskDate', 'task_date', 'date']), 'Task.taskDate'),
    isMentorChecked: asBoolean(pick(obj, ['isMentorChecked', 'is_mentor_checked']), 'Task.isMentorChecked'),
    isMandatory: asBoolean(pick(obj, ['isMandatory', 'is_mandatory']), 'Task.isMandatory'),
    contentId: asOptionalString(pick(obj, ['contentId', 'content_id']), 'Task.contentId') ?? null,
    weaknessId: asOptionalString(pick(obj, ['weaknessId', 'weakness_id']), 'Task.weaknessId') ?? null,
    menteeId: asString(pick(obj, ['menteeId', 'mentee_id']), 'Task.menteeId'),
    submitted: asOptionalBoolean(
      pick(obj, ['submitted', 'isSubmitted', 'hasSubmission', 'has_submission']),
      'Task.submitted'
    ),
    actualStudyTime:
      asOptionalNumber(
        pick(obj, ['actualStudyTime', 'actual_study_time', 'actualStudySeconds', 'actual_study_seconds']),
        'Task.actualStudyTime'
      ) ?? null,
    actualStudyTimeFormatted:
      asOptionalString(
        pick(obj, ['actualStudyTimeFormatted', 'actual_study_time_formatted']),
        'Task.actualStudyTimeFormatted'
      ) ?? null,
  };
};
