import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getCurrentTimeString } from '@/shared/lib/date';

interface TaskTimerData {
  elapsedTime: number;           // 누적 시간 (ms)
  timerStartedAt: number | null; // 시작 시각 (Timestamp)
  startTimeOfDay: string | null; // 그리드 반영용 시작 시각 (HH:mm)
}

interface TimerState {
  activeTaskId: string | null;
  taskTimers: Record<string, TaskTimerData>;
  
  startTimer: (taskId: string) => void;
  stopTimer: (taskId: string) => void;
  getTimerData: (taskId: string) => TaskTimerData;
}

const DEFAULT_TIMER_DATA: TaskTimerData = {
  elapsedTime: 0,
  timerStartedAt: null,
  startTimeOfDay: null,
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      activeTaskId: null,
      taskTimers: {},

      startTimer: (taskId) => {
        const { activeTaskId, taskTimers } = get();
        const now = Date.now();
        const currentTime = getCurrentTimeString();
        
        let updatedTimers = { ...taskTimers };
        
        //기존 실행 중인 타이머가 있다면 정지 처리
        if (activeTaskId && activeTaskId !== taskId) {
          const prevTimer = updatedTimers[activeTaskId];
          if (prevTimer?.timerStartedAt) {
            updatedTimers[activeTaskId] = {
              ...prevTimer,
              elapsedTime: prevTimer.elapsedTime + (now - prevTimer.timerStartedAt),
              timerStartedAt: null,
            };
          }
        }
        
        //새 타이머 시작
        const currentTaskTimer = updatedTimers[taskId] || DEFAULT_TIMER_DATA;
        updatedTimers[taskId] = {
          ...currentTaskTimer,
          timerStartedAt: now,
          startTimeOfDay: currentTaskTimer.startTimeOfDay || currentTime,
        };
        
        set({
          activeTaskId: taskId,
          taskTimers: updatedTimers,
        });
      },

      stopTimer: (taskId) => {
        const { taskTimers, activeTaskId } = get();
        const timer = taskTimers[taskId];
        
        if (!timer?.timerStartedAt) return;
        
        const now = Date.now();
        const updatedTimer: TaskTimerData = {
          ...timer,
          elapsedTime: timer.elapsedTime + (now - timer.timerStartedAt),
          timerStartedAt: null,
        };
        
        set({
          activeTaskId: activeTaskId === taskId ? null : activeTaskId,
          taskTimers: {
            ...taskTimers,
            [taskId]: updatedTimer,
          },
        });
      },

      getTimerData: (taskId) => {
        return get().taskTimers[taskId] || DEFAULT_TIMER_DATA;
      },
    }),
    {
      name: 'timer-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);