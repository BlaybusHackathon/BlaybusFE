export interface DailyPlanner {
  id: string;
  planDate: string;
  totalStudyTime: number;
  dailyMemo: string | null;
  createdAt: string;
  mentorFeedback: string | null;
  menteeId: string;
}

import { asRecord, asString, asNumber, asOptionalString, pick } from '@/shared/api/parse';

export const mapDailyPlannerFromApi = (raw: unknown): DailyPlanner => {
  const obj = asRecord(raw, 'DailyPlanner');
  const totalStudyTime = asNumber(pick(obj, ['totalStudyTime', 'total_study_time', 'totalStudyMinutes']), 'DailyPlanner.totalStudyTime');
  return {
    id: asString(pick(obj, ['id', 'planId', 'plan_id']), 'DailyPlanner.id'),
    planDate: asString(pick(obj, ['planDate', 'plan_date']), 'DailyPlanner.planDate'),
    totalStudyTime,
    dailyMemo: asOptionalString(pick(obj, ['dailyMemo', 'daily_memo']), 'DailyPlanner.dailyMemo') ?? null,
    createdAt: asString(pick(obj, ['createdAt', 'created_at']), 'DailyPlanner.createdAt'),
    mentorFeedback: asOptionalString(pick(obj, ['mentorFeedback', 'mentor_feedback']), 'DailyPlanner.mentorFeedback') ?? null,
    menteeId: asString(pick(obj, ['menteeId', 'mentee_id']), 'DailyPlanner.menteeId'),
  };
};
