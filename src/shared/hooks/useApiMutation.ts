import { useState, useCallback } from 'react';
import type { ApiError } from '@/shared/api/types';
import { isRecord } from '@/shared/api/parse';

export const useApiMutation = <T, V>(
  mutator: (vars: V) => Promise<T>
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const normalizeError = (e: unknown): ApiError => {
    if (isRecord(e) && typeof e.code === 'string' && typeof e.message === 'string') {
      return { code: e.code, message: e.message };
    }
    return { code: 'UNKNOWN_ERROR', message: 'Unknown error' };
  };

  const mutate = useCallback(async (vars: V) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mutator(vars);
      setData(result);
      return result;
    } catch (e: unknown) {
      const normalized = normalizeError(e);
      setError(normalized);
      throw normalized;
    } finally {
      setIsLoading(false);
    }
  }, [mutator]);

  return { data, error, isLoading, mutate, setData };
};
