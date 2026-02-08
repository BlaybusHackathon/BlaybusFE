import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { zoomFeedbackApi } from '../api/zoomFeedbackApi';
import type { ZoomFeedbackData } from './types';

export const useZoomFeedbackDetail = (zoomId?: string) => {
  return useApiQuery<ZoomFeedbackData | null>(
    () => (zoomId ? zoomFeedbackApi.getById(zoomId) : Promise.resolve(null)),
    [zoomId]
  );
};
