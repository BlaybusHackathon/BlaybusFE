import { Subject } from '@/shared/constants/subjects';
import { Task } from '@/entities/task/types';
import { TaskLog } from '@/entities/task-log/types';
import { 
  DAY_START_HOUR, 
  SLOTS_PER_HOUR, 
  MINUTES_PER_SLOT, 
  TOTAL_SLOTS 
} from '@/shared/constants/studyTime';
import { parseISO, getHours, getMinutes, differenceInMinutes, differenceInSeconds } from 'date-fns';

// ----------------------------------------------------------------------
// [타입 정의]
// ----------------------------------------------------------------------

export interface GridSlotItem {
  subject: Subject;
  leftPercent: number;  
  widthPercent: number; 
}

interface MergedBlock {
  subject: Subject;
  startAt: Date;
  endAt: Date;
}

// ----------------------------------------------------------------------
// [상수 및 내부 로직]
// ----------------------------------------------------------------------

const GAP_THRESHOLD_MINUTES = 5;      
const MIN_DISPLAY_SECONDS = 300;      

/** 연속된 공부 블록 병합 (Gap Filling) */
const mergeLogs = (logs: TaskLog[], tasks: Task[]): MergedBlock[] => {
  if (logs.length === 0) return [];

  const taskSubjectMap = new Map<string, Subject>();
  tasks.forEach(t => taskSubjectMap.set(t.id, t.subject));

  const sortedLogs = [...logs].sort((a, b) => 
    new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );

  const merged: MergedBlock[] = [];
  
  sortedLogs.forEach(log => {
    const subject = taskSubjectMap.get(log.taskId);
    if (!subject) return;

    const currentStart = new Date(log.startAt);
    const currentEnd = new Date(log.endAt);

    if (merged.length === 0) {
      merged.push({ subject, startAt: currentStart, endAt: currentEnd });
      return;
    }

    const lastBlock = merged[merged.length - 1];

    const gapMinutes = differenceInMinutes(currentStart, lastBlock.endAt);
    
    if (lastBlock.subject === subject && gapMinutes < GAP_THRESHOLD_MINUTES) {
      if (currentEnd > lastBlock.endAt) {
        lastBlock.endAt = currentEnd;
      }
    } else {
      merged.push({ subject, startAt: currentStart, endAt: currentEnd });
    }
  });

  return merged.filter(block => 
    differenceInSeconds(block.endAt, block.startAt) >= MIN_DISPLAY_SECONDS
  );
};

const getDayMinuteIndex = (date: Date): number => {
  let h = getHours(date);
  const m = getMinutes(date);
  if (h < DAY_START_HOUR) h += 24; 
  return (h - DAY_START_HOUR) * 60 + m;
};

// ----------------------------------------------------------------------
// [Export 함수들]
// ----------------------------------------------------------------------

/** * [복원] ISO 시간을 슬롯 인덱스로 변환 (Legacy 호환성 유지)
 * - 다른 컴포넌트에서 이 함수를 찾고 있어 복원합니다.
 */
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

/** 태스크 로그를 그리드 상태(비율 포함)로 변환 */
export const logsToGridState = (
  taskLogs: TaskLog[],
  tasks: Task[]
): GridSlotItem[][] => {
  const grid: GridSlotItem[][] = Array.from({ length: TOTAL_SLOTS }, () => []);
  const mergedBlocks = mergeLogs(taskLogs, tasks);

  mergedBlocks.forEach(block => {
    const startTotalMin = getDayMinuteIndex(block.startAt);
    const endTotalMin = getDayMinuteIndex(block.endAt);

    const startSlotIdx = Math.floor(startTotalMin / MINUTES_PER_SLOT);
    const endSlotIdx = Math.floor(endTotalMin / MINUTES_PER_SLOT);

    for (let i = startSlotIdx; i <= endSlotIdx; i++) {
      if (i < 0 || i >= TOTAL_SLOTS) continue;

      const slotStartMin = i * MINUTES_PER_SLOT;
      const slotEndMin = (i + 1) * MINUTES_PER_SLOT;

      const visibleStart = Math.max(startTotalMin, slotStartMin);
      const visibleEnd = Math.min(endTotalMin, slotEndMin);

      if (visibleStart < visibleEnd) {
        const duration = visibleEnd - visibleStart;
        const offset = visibleStart - slotStartMin;
        
        grid[i].push({
          subject: block.subject,
          leftPercent: (offset / MINUTES_PER_SLOT) * 100,
          widthPercent: (duration / MINUTES_PER_SLOT) * 100,
        });
      }
    }
  });

  return grid;
};

/** 그리드 데이터를 기반으로 총 시간 계산 (비율 합산 방식) */
export const calculateTotalMinutes = (grid: GridSlotItem[][]): number => {
  let totalMinutes = 0;
  grid.forEach(slotItems => {
    slotItems.forEach(item => {
      totalMinutes += (item.widthPercent / 100) * MINUTES_PER_SLOT;
    });
  });
  return Math.floor(totalMinutes);
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