import { Subject, TaskStatus } from '@/shared/constants/enums';

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

export const mapTaskFromApi = (raw: any): Task => ({
  id: String(raw.id),
  subject: raw.subject,
  title: raw.title,
  status: raw.status,
  taskDate: raw.task_date,
  recurringGroupId: raw.recurring_group_id ? String(raw.recurring_group_id) : null,
  isMentorChecked: raw.is_mentor_checked,
  isMandatory: raw.is_mandatory,
  contentId: raw.content_id ? String(raw.content_id) : null,
  weaknessId: raw.weakness_id ? String(raw.weakness_id) : null,
  menteeId: String(raw.mentee_id),
});