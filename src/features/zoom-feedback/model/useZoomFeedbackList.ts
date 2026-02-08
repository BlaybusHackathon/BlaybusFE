import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { zoomFeedbackApi } from '../api/zoomFeedbackApi';
import type { ZoomFeedbackListItem } from './types';

export const useZoomFeedbackList = (menteeId?: string) => {
  return useApiQuery<ZoomFeedbackListItem[]>(
    () => zoomFeedbackApi.list(menteeId ? { menteeId } : undefined),
    [menteeId]
  );
};
