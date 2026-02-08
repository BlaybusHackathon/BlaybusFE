import { Subject, TaskStatus } from '@/shared/constants/enums';
import { asRecord, asString, asOptionalString, asBoolean, asEnum, pick } from '@/shared/api/parse';

export interface Task {
  id: string;
  subject: Subject;
  title: string;
  status: TaskStatus;
  taskDate: string;
  recurringGroupId: string | null;
  isMentorChecked: boolean;
  isMandatory: boolean;
  contentId: string | null;
  weaknessId: string | null;
  menteeId: string;
}

const SUBJECT_VALUES: readonly Subject[] = ['KOREAN', 'ENGLISH', 'MATH', 'OTHER'];
const TASK_STATUS_VALUES: readonly TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

export const mapTaskFromApi = (raw: unknown): Task => {
  const obj = asRecord(raw, 'Task');
  return {
    id: asString(pick(obj, ['id', 'taskId']), 'Task.id'),
    subject: asEnum(pick(obj, ['subject']), SUBJECT_VALUES, 'Task.subject'),
    title: asString(pick(obj, ['title']), 'Task.title'),
    status: asEnum(pick(obj, ['status', 'taskStatus']), TASK_STATUS_VALUES, 'Task.status'),
    taskDate: asString(pick(obj, ['taskDate', 'task_date', 'date']), 'Task.taskDate'),
    recurringGroupId:
      asOptionalString(pick(obj, ['recurringGroupId', 'recurring_group_id']), 'Task.recurringGroupId') ?? null,
    isMentorChecked: asBoolean(pick(obj, ['isMentorChecked', 'is_mentor_checked']), 'Task.isMentorChecked'),
    isMandatory: asBoolean(pick(obj, ['isMandatory', 'is_mandatory']), 'Task.isMandatory'),
    contentId: asOptionalString(pick(obj, ['contentId', 'content_id']), 'Task.contentId') ?? null,
    weaknessId: asOptionalString(pick(obj, ['weaknessId', 'weakness_id']), 'Task.weaknessId') ?? null,
    menteeId: asString(pick(obj, ['menteeId', 'mentee_id']), 'Task.menteeId'),
  };
};
