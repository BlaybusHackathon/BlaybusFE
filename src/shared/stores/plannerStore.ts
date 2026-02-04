import { create } from 'zustand';
import { Task } from '@/entities/task/types';
import { TaskStatus } from '@/shared/constants/enums'; 
import { TaskLog } from '@/entities/task-log/types';
import { getAdjustedDate } from '@/shared/lib/date';
import { MOCK_TASKS, MOCK_TASK_LOGS } from '@/features/planner/model/mockPlannerData';

const getDateFromISO = (isoString: string): string => {
  return isoString.split('T')[0];
};

interface PlannerState {
  selectedDate: string;
  
  taskCache: Task[];
  taskLogCache: TaskLog[];
  
  tasks: Task[];
  taskLogs: TaskLog[];
  
  isLoading: boolean;
  
  setSelectedDate: (date: string) => void;
  
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  
  setTaskLogs: (logs: TaskLog[]) => void;
  addTaskLog: (log: TaskLog) => void;
  
  getTaskById: (taskId: string) => Task | undefined;
  getLogsByTaskId: (taskId: string) => TaskLog[];
  getTotalDurationByTaskId: (taskId: string) => number;
}

const TODAY = getAdjustedDate();

export const usePlannerStore = create<PlannerState>((set, get) => ({
  selectedDate: TODAY,
  
  taskCache: MOCK_TASKS,
  taskLogCache: MOCK_TASK_LOGS,
  
  tasks: MOCK_TASKS.filter(t => t.taskDate === TODAY),
  taskLogs: MOCK_TASK_LOGS.filter(log => getDateFromISO(log.startAt) === TODAY),
  
  isLoading: false,

  setSelectedDate: (date) => {
    const { taskCache, taskLogCache } = get();
    set({
      selectedDate: date,
      tasks: taskCache.filter(t => t.taskDate === date),
      taskLogs: taskLogCache.filter(log => getDateFromISO(log.startAt) === date),
    });
  },
  
  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => {
    const newTaskCache = [...state.taskCache, task];
    const isCurrentDate = task.taskDate === state.selectedDate;
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
  
  getTaskById: (taskId) => get().tasks.find((t) => t.id === taskId),
  
  getLogsByTaskId: (taskId) => 
    get().taskLogs.filter((l) => l.taskId === taskId),
  
  getTotalDurationByTaskId: (taskId) => 
    get().taskLogs
      .filter((l) => l.taskId === taskId)
      .reduce((sum, l) => sum + l.duration, 0),
}));