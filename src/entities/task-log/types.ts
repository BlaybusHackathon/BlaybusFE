export interface TaskLog {
  id: string;
  startAt: string;
  endAt: string;
  duration: number;
  taskId: string;
  timerStatus: string;
}

import { asRecord, asString, asNumber, asOptionalString, pick } from '@/shared/api/parse';

export const mapTaskLogFromApi = (raw: unknown): TaskLog => {
  const obj = asRecord(raw, 'TaskLog');
  const duration = asNumber(pick(obj, ['duration']), 'TaskLog.duration');
  return {
    id: asString(pick(obj, ['id']), 'TaskLog.id'),
    startAt: asString(pick(obj, ['startAt', 'start_at']), 'TaskLog.startAt'),
    endAt: asString(pick(obj, ['endAt', 'end_at']), 'TaskLog.endAt'),
    duration,
    taskId: asString(pick(obj, ['taskId', 'task_id']), 'TaskLog.taskId'),
    timerStatus: asOptionalString(pick(obj, ['timerStatus', 'timer_status']), 'TaskLog.timerStatus') ?? 'STOPPED',
  };
};
