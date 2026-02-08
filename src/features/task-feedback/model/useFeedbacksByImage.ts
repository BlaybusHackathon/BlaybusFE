import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { feedbackApi } from '../api/feedbackApi';

export const useFeedbacksByImage = (imageId?: string) => {
  return useApiQuery(
    () => (imageId ? feedbackApi.getFeedbacksByImageId(imageId) : Promise.resolve([])),
    [imageId]
  );
};
