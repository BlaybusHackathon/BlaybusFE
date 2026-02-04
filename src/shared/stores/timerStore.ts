import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getCurrentTimeISO } from '@/shared/lib/date';

interface TaskTimerData {
  elapsedTime: number;             
  timerStartedAt: number | null;    
  startTimeISO: string | null;      
}

interface StopTimerResult {
  startAt: string;
  endAt: string;
  duration: number;
}

interface TimerState {
  activeTaskId: string | null;
  taskTimers: Record<string, TaskTimerData>;
  
  startTimer: (taskId: string) => void;
  stopTimer: (taskId: string) => StopTimerResult | null;
  getTimerData: (taskId: string) => TaskTimerData;
}

const DEFAULT_TIMER: TaskTimerData = {
  elapsedTime: 0,
  timerStartedAt: null,
  startTimeISO: null,
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      activeTaskId: null,
      taskTimers: {},

      startTimer: (taskId) => {
        const { activeTaskId, taskTimers, stopTimer } = get();
        
        // 다른 타이머 실행 중이면 정지
        if (activeTaskId && activeTaskId !== taskId) {
          stopTimer(activeTaskId);
        }
        
        const now = Date.now();
        const nowISO = getCurrentTimeISO();
        const current = taskTimers[taskId] || DEFAULT_TIMER;
        
        set({
          activeTaskId: taskId,
          taskTimers: {
            ...taskTimers,
            [taskId]: {
              ...current,
              timerStartedAt: now,
              startTimeISO: current.startTimeISO || nowISO,
            },
          },
        });
      },

      stopTimer: (taskId) => {
        const { taskTimers, activeTaskId } = get();
        const timer = taskTimers[taskId];
        
        if (!timer?.timerStartedAt || !timer?.startTimeISO) return null;
        
        const now = Date.now();
        const endISO = getCurrentTimeISO();
        const sessionElapsed = now - timer.timerStartedAt;
        const totalElapsed = timer.elapsedTime + sessionElapsed;
        
        const result: StopTimerResult = {
          startAt: timer.startTimeISO,
          endAt: endISO,
          duration: Math.floor(totalElapsed / 1000),
        };
        
        // 타이머 리셋
        set({
          activeTaskId: activeTaskId === taskId ? null : activeTaskId,
          taskTimers: {
            ...taskTimers,
            [taskId]: DEFAULT_TIMER,
          },
        });
        
        return result;
      },

      getTimerData: (taskId) => get().taskTimers[taskId] || DEFAULT_TIMER,
    }),
    {
      name: 'timer-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);