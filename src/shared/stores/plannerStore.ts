import { create } from 'zustand';
import { Task, TaskStatus } from '@/entities/task/types';
import { TaskLog } from '@/entities/task-log/types';
import { getAdjustedDate } from '@/shared/lib/date';
import { MOCK_TASKS, MOCK_TASK_LOGS } from '@/features/planner/model/mockPlannerData';

interface PlannerState {
  selectedDate: string;
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

export const usePlannerStore = create<PlannerState>((set, get) => ({
  selectedDate: getAdjustedDate(),
  // 초기 데이터 (실제로는 API 연동 시 빈 배열이어야 함)
  tasks: MOCK_TASKS,
  taskLogs: MOCK_TASK_LOGS,
  isLoading: false,

  setSelectedDate: (date) => set({ 
    selectedDate: date,
    // 날짜 변경 시 데이터 초기화 (API 재호출 유도)
    // 현재는 Mock 데이터 유지 위해 주석 처리하거나 필터링 로직 필요
    // tasks: [], 
    // taskLogs: [],
  }),
  
  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  
  updateTaskStatus: (taskId, status) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === taskId ? { ...t, status } : t
    ),
  })),
  
  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== taskId),
    taskLogs: state.taskLogs.filter((l) => l.taskId !== taskId),
  })),

  setTaskLogs: (logs) => set({ taskLogs: logs }),
  
  addTaskLog: (log) => set((state) => ({ 
    taskLogs: [...state.taskLogs, log] 
  })),
  
  getTaskById: (taskId) => get().tasks.find((t) => t.id === taskId),
  
  getLogsByTaskId: (taskId) => 
    get().taskLogs.filter((l) => l.taskId === taskId),
  
  getTotalDurationByTaskId: (taskId) => 
    get().taskLogs
      .filter((l) => l.taskId === taskId)
      .reduce((sum, l) => sum + l.duration, 0),
}));