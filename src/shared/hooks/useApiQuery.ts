import { useEffect, useState, useCallback, useRef } from 'react';
import type { ApiError } from '@/shared/api/types';
import { isRecord } from '@/shared/api/parse';

const normalizeError = (e: unknown): ApiError => {
  if (isRecord(e) && typeof e.code === 'string' && typeof e.message === 'string') {
    return { code: e.code, message: e.message };
  }
  return { code: 'UNKNOWN_ERROR', message: 'Unknown error' };
};

export const useApiQuery = <T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetcherRef = useRef(fetcher);
  const depsKey = JSON.stringify(deps);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const run = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
      return result;
    } catch (e: unknown) {
      const normalized = normalizeError(e);
      setError(normalized);
      throw normalized;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    run();
  }, [run, depsKey]);

  return { data, error, isLoading, refetch: run, setData };
};
