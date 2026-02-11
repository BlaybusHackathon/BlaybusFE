import { create } from 'zustand';
import { Task } from '@/entities/task/types';
import { TaskStatus } from '@/shared/constants/enums'; 
import { TaskLog } from '@/entities/task-log/types';
import { DailyPlanner } from '@/entities/daily-plan/types'; 
import { getAdjustedDate, parseDurationToSeconds } from '@/shared/lib/date';
import { getAuthorizedUser } from './authStore'; 
import { planApi } from '@/features/planner/api/planApi';
import { taskApi } from '@/features/task/api/taskApi';

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
  
  updateDailyMemo: (memo: string) => Promise<void>; 
  
  loadDailyPlan: (date: string, menteeId?: string) => Promise<void>;

  getTaskById: (taskId: string) => Task | undefined;
  getLogsByTaskId: (taskId: string) => TaskLog[];
  getTotalDurationByTaskId: (taskId: string) => number;
}

const TODAY = getAdjustedDate();

export const usePlannerStore = create<PlannerState>((set, get) => ({
  selectedDate: TODAY,
  
  taskCache: [],
  taskLogCache: [],
  
  tasks: [],
  taskLogs: [],
  
  currentDailyPlanner: null,
  
  isLoading: false,

  setSelectedDate: (date) => set({
    selectedDate: date,
    tasks: [],
    taskLogs: [],
    currentDailyPlanner: null,
  }),
  
  setTasks: (tasks) => set({ tasks, taskCache: tasks }),
  
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

  setTaskLogs: (logs) => set({ taskLogs: logs, taskLogCache: logs }),
  
  addTaskLog: (log) => set((state) => {
    const newLogCache = [...state.taskLogCache, log];
    const logDate = getDateFromISO(log.startAt);
    const isCurrentDate = logDate === state.selectedDate;
    
    return { 
      taskLogCache: newLogCache,
      taskLogs: isCurrentDate ? [...state.taskLogs, log] : state.taskLogs,
    };
  }),

  updateDailyMemo: async (memo) => {
    try {
      getAuthorizedUser();
    } catch (e) {
      console.error("Failed to update daily memo:", e);
      return;
    }

    const { currentDailyPlanner, selectedDate } = get();

    try {
      if (!currentDailyPlanner) {
        const created = await planApi.createPlan({
          planDate: selectedDate,
          dailyMemo: memo,
        });
        set({ currentDailyPlanner: created });
        return;
      }

      const updated = await planApi.updatePlan(currentDailyPlanner.id, {
        dailyMemo: memo,
      });
      set({ currentDailyPlanner: updated });
    } catch (e) {
      console.error('Failed to save daily memo:', e);
    }
  },

  loadDailyPlan: async (date, menteeId) => {
    set({ isLoading: true });
    try {
      const [year, month, day] = date.split('-').map(Number);
      const data = await planApi.getDailyPlan({ year, month, day, menteeId });
      let enrichedTasks = data.tasks;
      const needsSubmissionCheck = enrichedTasks.filter((task) => task.submitted === undefined);
      if (needsSubmissionCheck.length > 0) {
        const results = await Promise.allSettled(
          needsSubmissionCheck.map((task) => taskApi.hasSubmission(task.id))
        );
        const submissionMap = new Map<string, boolean>();
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            submissionMap.set(needsSubmissionCheck[index].id, result.value);
          }
        });
        enrichedTasks = enrichedTasks.map((task) => {
          const submitted = submissionMap.get(task.id);
          return submitted !== undefined ? { ...task, submitted } : task;
        });
      }
      let taskLogs = data.taskLogs;
      if (taskLogs.length === 0 && enrichedTasks.length > 0) {
        const results = await Promise.allSettled(
          enrichedTasks.map((task) => taskApi.getTaskLogs(task.id))
        );
        taskLogs = results.flatMap((result) =>
          result.status === 'fulfilled' ? result.value : []
        );
      }
      set({
        taskCache: enrichedTasks,
        taskLogCache: taskLogs,
        tasks: enrichedTasks,
        taskLogs,
        currentDailyPlanner: data.planner,
        isLoading: false,
      });
    } catch (e) {
      console.error('Failed to load daily plan:', e);
      set({
        taskCache: [],
        taskLogCache: [],
        tasks: [],
        taskLogs: [],
        currentDailyPlanner: null,
        isLoading: false,
      });
    }
  },
  
  getTaskById: (taskId) => get().tasks.find((t) => t.id === taskId),
  
  getLogsByTaskId: (taskId) => 
    get().taskLogs.filter((l) => l.taskId === taskId),
  
  getTotalDurationByTaskId: (taskId) => {
    const totalFromLogs = get()
      .taskLogs
      .filter((l) => l.taskId === taskId)
      .reduce((sum, l) => sum + l.duration, 0);

    if (totalFromLogs > 0) return totalFromLogs;

    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return 0;

    if (typeof task.actualStudyTime === 'number') return task.actualStudyTime;

    const parsed = parseDurationToSeconds(task.actualStudyTimeFormatted ?? undefined);
    return parsed ?? 0;
  },
}));
