import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { mentorDashboardApi } from '../api/mentorDashboardApi';

export const useMentorDashboard = () => {
  return useApiQuery(() => mentorDashboardApi.get(), []);
};
