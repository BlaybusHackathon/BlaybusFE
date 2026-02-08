import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { weaknessApi } from '../api/weaknessApi';

export const useMenteeWeaknesses = (menteeId?: string) => {
  return useApiQuery(
    () => (menteeId ? weaknessApi.listByMentee(menteeId) : Promise.resolve([])),
    [menteeId]
  );
};
