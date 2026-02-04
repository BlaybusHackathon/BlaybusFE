import { useCallback } from 'react';
import { useTimerStore } from '@/shared/stores/timerStore';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { MIN_LOG_DURATION_SECONDS } from '@/shared/constants/studyTime';

export const useTaskTimer = (taskId: string) => {
  const { activeTaskId, taskTimers, startTimer, stopTimer } = useTimerStore();
  const { addTaskLog } = usePlannerStore();
  
  const timerData = taskTimers[taskId];
  const isRunning = activeTaskId === taskId && !!timerData?.timerStartedAt;

  const toggle = useCallback(() => {
    if (isRunning) {
      const result = stopTimer(taskId);
      
      if (result && result.duration >= MIN_LOG_DURATION_SECONDS) {
        addTaskLog({
          id: `temp-${Date.now()}`,
          taskId,
          startAt: result.startAt,
          endAt: result.endAt,
          duration: result.duration,
        });
      }
    } else {
      startTimer(taskId);
    }
  }, [isRunning, taskId, startTimer, stopTimer, addTaskLog]);

  return {
    isRunning,
    toggle,
  };
};