import { useState, useEffect, useCallback } from 'react';
import { useTimerStore } from '@/shared/stores/timerStore';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { formatDuration } from '@/shared/lib/date';
import { MIN_LOG_DURATION_SECONDS } from '@/shared/constants/studyTime';
import { Subject } from '@/shared/constants/subjects';

export const useTaskTimer = (taskId: string, subject: Subject) => {
  const { activeTaskId, taskTimers, startTimer, stopTimer } = useTimerStore();
  const { addTaskLog, getTotalDurationByTaskId } = usePlannerStore();
  
  const [displayTime, setDisplayTime] = useState('00:00:00');
  
  const timerData = taskTimers[taskId];
  const isRunning = activeTaskId === taskId && !!timerData?.timerStartedAt;
  const savedDuration = getTotalDurationByTaskId(taskId);

  useEffect(() => {
    const updateDisplay = () => {
      let currentSession = 0;
      
      if (isRunning && timerData?.timerStartedAt) {
        currentSession = Math.floor((Date.now() - timerData.timerStartedAt) / 1000);
        currentSession += Math.floor((timerData.elapsedTime || 0) / 1000);
      }
      
      const total = savedDuration + currentSession;
      setDisplayTime(formatDuration(total));
    };

    updateDisplay();
    
    if (isRunning) {
      const intervalId = setInterval(updateDisplay, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isRunning, timerData, savedDuration]);

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
    displayTime,
    isRunning,
    toggle,
  };
};