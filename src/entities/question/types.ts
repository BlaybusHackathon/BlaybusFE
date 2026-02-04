export interface Question {
  id: string;
  userId: string;
  comment: string;
  createdAt: string;
  taskId: string;
}

export const mapQuestionFromApi = (raw: any): Question => ({
  id: String(raw.id),
  userId: String(raw.user_id),
  comment: raw.comment,
  createdAt: raw.created_at,
  taskId: String(raw.task_id),
});