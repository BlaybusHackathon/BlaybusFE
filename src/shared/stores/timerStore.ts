import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TimerState {
  activeTaskId: string | null;      // 현재 실행 중인 과제 ID
  timerStartedAt: number | null;    // 시작된 시간 (Timestamp)
  
  startTimer: (taskId: string) => void;
  stopTimer: () => number;          // 정지 시 이번 세션 시간(초) 반환
  cancelTimer: () => void;          // 저장 없이 취소 (필요 시)
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      activeTaskId: null,
      timerStartedAt: null,

      startTimer: (taskId) => {
        const { activeTaskId, stopTimer } = get();
        // 이미 다른 게 돌고 있으면 정지시키고 시작 (자동 저장 로직은 훅에서 처리 권장, 여기선 강제 종료)
        if (activeTaskId) {
          stopTimer(); 
        }
        
        set({
          activeTaskId: taskId,
          timerStartedAt: Date.now(),
        });
      },

      stopTimer: () => {
        const { timerStartedAt } = get();
        if (!timerStartedAt) return 0;

        const now = Date.now();
        const sessionDuration = Math.floor((now - timerStartedAt) / 1000); // 초 단위 변환

        // 상태 초기화
        set({
          activeTaskId: null,
          timerStartedAt: null,
        });

        return sessionDuration; // 이번에 공부한 시간 반환
      },

      cancelTimer: () => {
        set({ activeTaskId: null, timerStartedAt: null });
      }
    }),
    {
      name: 'timer-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);