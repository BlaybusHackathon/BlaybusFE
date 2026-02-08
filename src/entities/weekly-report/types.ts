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

import { asRecord, asString, asOptionalString, pick } from '@/shared/api/parse';

export const mapWeeklyReportFromApi = (raw: unknown): WeeklyReport => {
  const obj = asRecord(raw, 'WeeklyReport');
  return {
    id: asString(pick(obj, ['id', 'reportId']), 'WeeklyReport.id'),
    weekName: asString(pick(obj, ['weekName', 'week_name']), 'WeeklyReport.weekName'),
    startDate: asString(pick(obj, ['startDate', 'start_date']), 'WeeklyReport.startDate'),
    endDate: asString(pick(obj, ['endDate', 'end_date']), 'WeeklyReport.endDate'),
    overallFeedback: asOptionalString(pick(obj, ['overallFeedback', 'overall_feedback']), 'WeeklyReport.overallFeedback') ?? null,
    strengths: asOptionalString(pick(obj, ['strengths']), 'WeeklyReport.strengths') ?? null,
    weaknesses: asOptionalString(pick(obj, ['weaknesses']), 'WeeklyReport.weaknesses') ?? null,
    inforId: asString(pick(obj, ['inforId', 'infor_id']), 'WeeklyReport.inforId'),
  };
};
