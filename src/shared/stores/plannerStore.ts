import { create } from 'zustand';
import { Task } from '@/entities/task/types';
import { StudyTimeSlot } from '@/entities/study-time/types';
import { MOCK_TASKS, MOCK_STUDY_TIME_SLOTS } from '@/features/planner/model/mockPlannerData';

interface PlannerState {
  selectedDate: string;
  tasks: Task[];
  studyTimeSlots: StudyTimeSlot[];
  
  // Actions
  setSelectedDate: (date: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  setStudyTimeSlots: (slots: StudyTimeSlot[]) => void;
}

export const usePlannerStore = create<PlannerState>((set) => ({
  selectedDate: new Date().toISOString().split('T')[0],
  tasks: MOCK_TASKS, // 초기값 Mock
  studyTimeSlots: MOCK_STUDY_TIME_SLOTS,

  setSelectedDate: (date) => set({ selectedDate: date }),
  
  toggleTaskComplete: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      ),
    })),

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  
  deleteTask: (taskId) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) })),

  setStudyTimeSlots: (slots) => set({ studyTimeSlots: slots }),
}));