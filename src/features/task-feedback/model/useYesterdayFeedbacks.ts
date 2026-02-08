import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { feedbackApi } from '../api/feedbackApi';

export const useYesterdayFeedbacks = () => {
  return useApiQuery(() => feedbackApi.getYesterdayFeedbacks(), []);
};
