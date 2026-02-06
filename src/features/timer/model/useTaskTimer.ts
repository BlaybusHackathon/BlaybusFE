import { useState, useEffect } from 'react';
import { useTimerStore } from '@/shared/stores/timerStore';

export const useTaskTimer = (taskId: string) => {
  const { activeTaskId, startTimer, stopTimer, getTimerData } = useTimerStore();
  
  const isRunning = activeTaskId === taskId;
  
  const initialData = getTimerData(taskId);
  const [duration, setDuration] = useState(initialData?.elapsedTime || 0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        const currentData = getTimerData(taskId);
        if (currentData.startTimeISO) {
          const start = new Date(currentData.startTimeISO).getTime();
          const now = Date.now();
          const currentSession = Math.floor((now - start) / 1000);
          setDuration(currentData.elapsedTime + currentSession);
        }
      }, 1000);
    } else {
      const currentData = getTimerData(taskId);
      setDuration(currentData?.elapsedTime || 0);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, taskId, getTimerData]);

  const toggle = () => {
    if (isRunning) {
      stopTimer(taskId);
    } else {
      startTimer(taskId);
    }
  };

  return {
    isRunning,
    toggle,
    duration,
  };
};