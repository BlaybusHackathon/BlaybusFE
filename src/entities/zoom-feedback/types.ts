export interface ZoomFeedback {
  id: string;
  meetingDate: string;
  summary: string;
  createdAt: string;
  inforId: string;
}

export const mapZoomFeedbackFromApi = (raw: any): ZoomFeedback => ({
  id: String(raw.id),
  meetingDate: raw.meeting_date,
  summary: raw.summary,
  createdAt: raw.created_at,
  inforId: String(raw.infor_id),
});