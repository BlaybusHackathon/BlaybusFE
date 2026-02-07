export interface TaskLog {
  id: string;
  startAt: string;
  endAt: string;
  duration: number;
  taskId: string;
  timerStatus: string;
}

export const mapTaskLogFromApi = (raw: any): TaskLog => ({
  id: String(raw.id),
  startAt: raw.start_at,
  endAt: raw.end_at,
  duration: raw.duration,
  taskId: String(raw.task_id),
  timerStatus: raw.timer_status || 'COMPLETED',
});