import { useState, useEffect, useCallback } from 'react';
import { useTimerStore } from '@/shared/stores/timerStore';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { TaskLog } from '@/entities/task-log/types';

const MIN_SAVE_DURATION = 1; 

export const useTaskTimer = (taskId: string) => {
  const { activeTaskId, timerStartedAt, startTimer, stopTimer } = useTimerStore();
  const { getTotalDurationByTaskId, addTaskLog } = usePlannerStore(); 

  const isRunning = activeTaskId === taskId;
  const savedTotalDuration = getTotalDurationByTaskId(taskId);
  const [displayTime, setDisplayTime] = useState(savedTotalDuration);

  // 실시간 타이머 UI 갱신
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && timerStartedAt) {
      const updateTime = () => {
        const currentSessionSeconds = Math.floor((Date.now() - timerStartedAt) / 1000);
        setDisplayTime(savedTotalDuration + currentSessionSeconds);
      };
      updateTime();
      intervalId = setInterval(updateTime, 1000);
    } else {
      setDisplayTime(savedTotalDuration);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, timerStartedAt, savedTotalDuration]);

  // 토글 핸들러
  const toggle = useCallback(() => {
    if (isRunning) {
      // Stop & Save
      const sessionDuration = stopTimer(); 

      // 1초 이상이면 무조건 저장
      if (sessionDuration >= MIN_SAVE_DURATION) {
        const now = new Date();
        const startAt = new Date(now.getTime() - sessionDuration * 1000);

        const newLog: TaskLog = {
          id: `log-${Date.now()}`,
          taskId: taskId,
          startAt: startAt.toISOString(),
          endAt: now.toISOString(),
          duration: sessionDuration, 
          timerStatus: 'COMPLETED',
        };

        addTaskLog(newLog); 
        console.log(`[Timer] Saved: ${sessionDuration}s`);
      } else {
        console.log(`[Timer] Ignored: ${sessionDuration}s (Under 1s)`);
      }

    } else {
      // Start
      startTimer(taskId);
    }
  }, [isRunning, taskId, startTimer, stopTimer, addTaskLog]);

  return {
    isRunning,
    toggle,
    duration: displayTime,
  };
};
