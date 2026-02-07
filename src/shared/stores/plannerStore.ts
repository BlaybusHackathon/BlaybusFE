import { create } from 'zustand';
import { Task } from '@/entities/task/types';
import { TaskStatus } from '@/shared/constants/enums'; 
import { TaskLog } from '@/entities/task-log/types';
import { DailyPlanner } from '@/entities/daily-plan/types'; 
import { getAdjustedDate } from '@/shared/lib/date';
import { 
  MOCK_TASKS, 
  MOCK_TASK_LOGS, 
  MOCK_DAILY_PLANNERS 
} from '@/features/planner/model/mockPlannerData';
import { getAuthorizedUser } from './authStore'; 

const getDateFromISO = (isoString: string): string => {
  return isoString.split('T')[0];
};

const normalizeTaskDate = (dateString: string): string => {
  return dateString.includes('T') ? getDateFromISO(dateString) : dateString;
};

interface PlannerState {
  selectedDate: string;
  
  taskCache: Task[];
  taskLogCache: TaskLog[];
  
  tasks: Task[];
  taskLogs: TaskLog[];
  currentDailyPlanner: DailyPlanner | null;
  isLoading: boolean;
  
  setSelectedDate: (date: string) => void;
  
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  
  setTaskLogs: (logs: TaskLog[]) => void;
  addTaskLog: (log: TaskLog) => void;
  
  updateDailyMemo: (memo: string) => void; 
  
  getTaskById: (taskId: string) => Task | undefined;
  getLogsByTaskId: (taskId: string) => TaskLog[];
  getTotalDurationByTaskId: (taskId: string) => number;
}

const TODAY = getAdjustedDate();

export const usePlannerStore = create<PlannerState>((set, get) => ({
  selectedDate: TODAY,
  
  taskCache: MOCK_TASKS,
  taskLogCache: MOCK_TASK_LOGS,
  
  tasks: MOCK_TASKS.filter(t => normalizeTaskDate(t.taskDate) === TODAY),
  taskLogs: MOCK_TASK_LOGS.filter(log => getDateFromISO(log.startAt) === TODAY),
  
  currentDailyPlanner: MOCK_DAILY_PLANNERS.find(p => p.planDate === TODAY) || null,
  
  isLoading: false,

  setSelectedDate: (date) => {
    const { taskCache, taskLogCache } = get();
    
    const targetPlanner = MOCK_DAILY_PLANNERS.find(p => p.planDate === date) || null;

    set({
      selectedDate: date,
      tasks: taskCache.filter(t => normalizeTaskDate(t.taskDate) === date),
      taskLogs: taskLogCache.filter(log => getDateFromISO(log.startAt) === date),
      currentDailyPlanner: targetPlanner, 
    });
  },
  
  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => {
    const newTaskCache = [...state.taskCache, task];
    const isCurrentDate = normalizeTaskDate(task.taskDate) === state.selectedDate;
    return { 
      taskCache: newTaskCache,
      tasks: isCurrentDate ? [...state.tasks, task] : state.tasks,
    };
  }),
  
  updateTaskStatus: (taskId, status) => set((state) => {
    const updateTask = (t: Task) => 
      t.id === taskId ? { ...t, status } : t;
      
    return {
      taskCache: state.taskCache.map(updateTask),
      tasks: state.tasks.map(updateTask),
    };
  }),
  
  deleteTask: (taskId) => set((state) => ({
    taskCache: state.taskCache.filter(t => t.id !== taskId),
    tasks: state.tasks.filter(t => t.id !== taskId),
    taskLogCache: state.taskLogCache.filter(l => l.taskId !== taskId),
    taskLogs: state.taskLogs.filter(l => l.taskId !== taskId),
  })),

  setTaskLogs: (logs) => set({ taskLogs: logs }),
  
  addTaskLog: (log) => set((state) => {
    const newLogCache = [...state.taskLogCache, log];
    const logDate = getDateFromISO(log.startAt);
    const isCurrentDate = logDate === state.selectedDate;
    
    return { 
      taskLogCache: newLogCache,
      taskLogs: isCurrentDate ? [...state.taskLogs, log] : state.taskLogs,
    };
  }),

  updateDailyMemo: (memo) => {
    let user;
    try {
      user = getAuthorizedUser();
    } catch (e) {
      console.error("Failed to update daily memo:", e);
      return; 
    }

    set((state) => {
      const current = state.currentDailyPlanner;
      
      if (!current) {
        const newPlanner: DailyPlanner = {
          id: Date.now().toString(),
          planDate: state.selectedDate,
          totalStudyTime: 0,
          dailyMemo: memo,
          createdAt: new Date().toISOString(),
          mentorFeedback: null,
          menteeId: user.id, 
        };
        return { currentDailyPlanner: newPlanner };
      }
      
      return {
        currentDailyPlanner: { ...current, dailyMemo: memo }
      };
    });
  },
  
  getTaskById: (taskId) => get().tasks.find((t) => t.id === taskId),
  
  getLogsByTaskId: (taskId) => 
    get().taskLogs.filter((l) => l.taskId === taskId),
  
  getTotalDurationByTaskId: (taskId) => 
    get().taskLogs
      .filter((l) => l.taskId === taskId)
      .reduce((sum, l) => sum + l.duration, 0),
}));