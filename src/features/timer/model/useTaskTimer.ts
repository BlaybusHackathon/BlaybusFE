import { useState, useEffect, useCallback } from 'react';
import { useTimerStore } from '@/shared/stores/timerStore';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { TaskLog } from '@/entities/task-log/types';
import { taskApi } from '@/features/task/api/taskApi';
import { isRecord } from '@/shared/api/parse';

const MIN_SAVE_DURATION = 1;

export const useTaskTimer = (taskId: string) => {
  const { activeTaskId, timerStartedAt, startTimer, stopTimer } = useTimerStore();
  const { getTotalDurationByTaskId, addTaskLog } = usePlannerStore();

  const isRunning = activeTaskId === taskId;
  const savedTotalDuration = getTotalDurationByTaskId(taskId);
  const [displayTime, setDisplayTime] = useState(savedTotalDuration);
  const displayValue = isRunning ? displayTime : savedTotalDuration;

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && timerStartedAt) {
      const updateTime = () => {
        const currentSessionSeconds = Math.floor((Date.now() - timerStartedAt) / 1000);
        setDisplayTime(savedTotalDuration + currentSessionSeconds);
      };
      intervalId = setInterval(updateTime, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, timerStartedAt, savedTotalDuration]);

  const stopActiveTimer = useCallback(async () => {
    if (!activeTaskId || !timerStartedAt) return;

    const startedAtMs = timerStartedAt;
    const sessionDuration = stopTimer();

    try {
      const res = await taskApi.stopTaskTimer(activeTaskId);
      const durationSeconds = (() => {
        if (isRecord(res)) {
          if (typeof res.sessionSeconds === 'number') return res.sessionSeconds;
          if (typeof res.sessionMinutes === 'number') return res.sessionMinutes * 60;
        }
        return sessionDuration;
      })();

      if (durationSeconds >= MIN_SAVE_DURATION) {
        const startAt = new Date(startedAtMs);
        const endAt = new Date(startAt.getTime() + durationSeconds * 1000);

        const newLog: TaskLog = {
          id: `log-${Date.now()}`,
          taskId: activeTaskId,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          duration: durationSeconds,
          timerStatus: 'STOPPED',
        };

        addTaskLog(newLog);
      }
    } catch (e) {
      console.error('[Timer] Failed to stop timer:', e);
    }
  }, [activeTaskId, timerStartedAt, stopTimer, addTaskLog]);

  const toggle = useCallback(async () => {
    if (isRunning) {
      await stopActiveTimer();
      return;
    }

    if (activeTaskId && activeTaskId !== taskId) {
      await stopActiveTimer();
    }

    try {
      await taskApi.startTaskTimer(taskId);
      startTimer(taskId);
    } catch (e) {
      console.error('[Timer] Failed to start timer:', e);
    }
  }, [isRunning, taskId, startTimer, stopActiveTimer, activeTaskId]);

  return {
    isRunning,
    toggle,
    duration: displayValue,
  };
};
