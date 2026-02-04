export interface SubmissionImage {
  id: string;
  imageUrl: string | null;
  submissionId: string | null;
  questionId: string | null;
  answerId: string | null;
}

export const mapSubmissionImageFromApi = (raw: any): SubmissionImage => ({
  id: String(raw.id),
  imageUrl: raw.image_url,
  submissionId: raw.submission_id ? String(raw.submission_id) : null,
  questionId: raw.question_id ? String(raw.question_id) : null,
  answerId: raw.answer_id ? String(raw.answer_id) : null,
});