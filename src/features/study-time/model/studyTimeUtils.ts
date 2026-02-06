import { Subject } from '@/shared/constants/subjects';
import { Task } from '@/entities/task/types';
import { TaskLog } from '@/entities/task-log/types';
import { 
  DAY_START_HOUR, 
  SLOTS_PER_HOUR, 
  MINUTES_PER_SLOT, 
  TOTAL_SLOTS 
} from '@/shared/constants/studyTime';
import { parseISO, getHours, getMinutes } from 'date-fns';

export const isoToSlotIndex = (isoString: string): number => {
  const date = parseISO(isoString);
  let hour = getHours(date);
  const minute = getMinutes(date);
  
  if (hour < DAY_START_HOUR) {
    hour += 24;
  }
  
  const hourOffset = hour - DAY_START_HOUR;
  return hourOffset * SLOTS_PER_HOUR + Math.floor(minute / MINUTES_PER_SLOT);
};

export const logsToGridState = (
  taskLogs: TaskLog[],
  tasks: Task[]
): (Subject | null)[] => {
  const grid: (Subject | null)[] = Array(TOTAL_SLOTS).fill(null);
  
  const taskSubjectMap = new Map<string, Subject>();
  tasks.forEach((task) => {
    taskSubjectMap.set(task.id, task.subject);
  });
  
  taskLogs.forEach((log) => {
    const subject = taskSubjectMap.get(log.taskId);
    if (!subject) return;
    
    const startIdx = isoToSlotIndex(log.startAt);
    let endIdx = isoToSlotIndex(log.endAt);
    
    if (startIdx === endIdx) endIdx = startIdx + 1;
    if (endIdx < startIdx) endIdx = TOTAL_SLOTS;
    
    for (let i = startIdx; i < endIdx && i < TOTAL_SLOTS; i++) {
      if (i >= 0) grid[i] = subject;
    }
  });
  
  return grid;
};

export const calculateTotalMinutes = (grid: (Subject | null)[]): number => {
  return grid.filter((s) => s !== null).length * MINUTES_PER_SLOT;
};

export const getTaskDurationMinutes = (logs: TaskLog[]): number => {
  if (!logs || logs.length === 0) return 0;
  
  const totalSeconds = logs.reduce((acc, log) => acc + (log.duration || 0), 0);
  return Math.floor(totalSeconds / 60);
};

export const formatMinutes = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) return `${minutes}분`;
  return `${hours}시간 ${minutes}분`;
};