import { useApiMutation } from '@/shared/hooks/useApiMutation';
import { weaknessApi } from '../api/weaknessApi';
import type { Subject } from '@/shared/constants/subjects';

export const useWeaknessMutations = () => {
  const create = useApiMutation((payload: Parameters<typeof weaknessApi.create>[0]) => weaknessApi.create(payload));
  const update = useApiMutation(
    async ({
      weaknessId,
      payload,
    }: {
      weaknessId: string;
      payload: {
        menteeId: string;
        subject: Subject;
        title: string;
        contentId?: string | number;
      };
    }) => {
      await weaknessApi.remove(weaknessId);
      return weaknessApi.create(payload);
    }
  );
  const remove = useApiMutation((weaknessId: string) => weaknessApi.remove(weaknessId));

  return { create, update, remove };
};

