import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { feedbackApi } from '../api/feedbackApi';

export const useFeedbackHistory = (params: {
  menteeId: string;
  year?: number;
  month?: number;
  weekNumber?: number | 'ALL';
  subject?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useApiQuery(
    () => (params.menteeId ? feedbackApi.getFeedbackHistory(params) : Promise.resolve([])),
    [params.menteeId, params.year, params.month, params.weekNumber, params.subject, params.startDate, params.endDate]
  );
};
