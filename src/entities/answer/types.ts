export interface Answer {
  id: string;
  userId: string;
  comment: string;
  createdAt: string;
  questionId: string;
}

export const mapAnswerFromApi = (raw: any): Answer => ({
  id: String(raw.id),
  userId: String(raw.user_id),
  comment: raw.commment,
  createdAt: raw.created_at,
  questionId: String(raw.question_id),
});