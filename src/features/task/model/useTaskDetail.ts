import { useApiQuery } from '@/shared/hooks/useApiQuery';
import type { TaskDetailFullData } from '@/entities/task-detail/types';
import { taskApi } from '../api/taskApi';

export const useTaskDetail = (taskId?: string) => {
  return useApiQuery<TaskDetailFullData | null>(
    () => (taskId ? taskApi.getTaskDetail(taskId) : Promise.resolve(null)),
    [taskId]
  );
};
