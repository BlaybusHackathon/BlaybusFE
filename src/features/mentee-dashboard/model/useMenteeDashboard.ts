import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { menteeDashboardApi, DashboardType } from '../api/menteeDashboardApi';

export const useMenteeDashboard = (menteeId?: string, type: DashboardType = 'WEEK') => {
  return useApiQuery(
    () => (menteeId ? menteeDashboardApi.getByMenteeId(menteeId, type) : Promise.resolve(null)),
    [menteeId, type]
  );
};
