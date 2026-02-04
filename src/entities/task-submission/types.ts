export interface TaskSubmission {
  id: string;
  menteeComment: string | null;
  createdAt: string;
  taskId: string;
}

export const mapTaskSubmissionFromApi = (raw: any): TaskSubmission => ({
  id: String(raw.id),
  menteeComment: raw.mentee_comment,
  createdAt: raw.created_at,
  taskId: String(raw.task_id),
});