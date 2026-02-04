export interface WeeklyReport {
  id: string;
  weekName: string;
  startDate: string;
  endDate: string;
  overallFeedback: string | null;
  strengths: string | null;
  weaknesses: string | null;
  inforId: string;
}

export const mapWeeklyReportFromApi = (raw: any): WeeklyReport => ({
  id: String(raw.id),
  weekName: raw.week_name,
  startDate: raw.start_date,
  endDate: raw.end_date,
  overallFeedback: raw.overall_feedback,
  strengths: raw.strengths,
  weaknesses: raw.weaknesses,
  inforId: String(raw.infor_id),
});