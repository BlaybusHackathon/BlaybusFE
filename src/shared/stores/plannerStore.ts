import { create } from 'zustand';
import { Task } from '@/entities/task/types';
import { StudyTimeSlot } from '@/entities/study-time/types';
import { MOCK_TASKS, MOCK_STUDY_TIME_SLOTS } from '@/features/planner/model/mockPlannerData';

const TODAY = new Date().toISOString().split('T')[0];

interface PlannerState {
  selectedDate: string;
  tasks: Task[];      
  taskCache: Task[]; 
  studyTimeSlots: StudyTimeSlot[];
  comment: string;    
  
  // Actions
  setSelectedDate: (date: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  setStudyTimeSlots: (slots: StudyTimeSlot[]) => void;
  setComment: (comment: string) => void;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  selectedDate: TODAY,
  taskCache: MOCK_TASKS,
  tasks: MOCK_TASKS.filter((t) => t.date === TODAY), 
  studyTimeSlots: MOCK_STUDY_TIME_SLOTS,
  comment: '',

  setSelectedDate: (date) => {
    const { taskCache } = get();
    set({
      selectedDate: date,
      tasks: taskCache.filter((t) => t.date === date),
    });
  },
  
  toggleTaskComplete: (taskId) =>
    set((state) => {
      const newTasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      );
      const newTaskCache = state.taskCache.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      );
      return { tasks: newTasks, taskCache: newTaskCache };
    }),

  addTask: (task) =>
    set((state) => {
      const isSameDate = task.date === state.selectedDate;
      return {
        taskCache: [...state.taskCache, task],
        tasks: isSameDate ? [...state.tasks, task] : state.tasks,
      };
    }),
  
  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
      taskCache: state.taskCache.filter((t) => t.id !== taskId),
    })),

  setStudyTimeSlots: (slots) => set({ studyTimeSlots: slots }),
  
  setComment: (comment) => set({ comment }),
}));