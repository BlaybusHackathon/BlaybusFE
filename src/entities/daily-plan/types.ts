export interface DailyPlanner {
  id: string;
  planDate: string;
  totalStudyTime: number;
  dailyMemo: string | null;
  createdAt: string;
  mentorFeedback: string | null;
  menteeId: string;
}

export const mapDailyPlannerFromApi = (raw: any): DailyPlanner => ({
  id: String(raw.id),
  planDate: raw.plan_date,
  totalStudyTime: raw.total_study_time,
  dailyMemo: raw.daily_memo,
  createdAt: raw.created_at,
  mentorFeedback: raw.mentor_feedback,
  menteeId: String(raw.mentee_id),
});