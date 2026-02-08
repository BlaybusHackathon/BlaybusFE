import { apiClient } from '@/shared/api/base';
import { DailyPlanner, mapDailyPlannerFromApi } from '@/entities/daily-plan/types';
import { Task, mapTaskFromApi } from '@/entities/task/types';
import { TaskLog, mapTaskLogFromApi } from '@/entities/task-log/types';
import { USE_MOCK } from '@/shared/mocks/mockEnv';
import { mockApi } from '@/shared/mocks/mockApi';
import { asRecord, asOptionalArray, asOptionalString, asString, asNumber, pick, isRecord } from '@/shared/api/parse';
import type { Subject } from '@/shared/constants/enums';

export interface DailyPlanQuery {
  year: number;
  month: number;
  day: number;
  menteeId?: string;
}

export interface DailyPlanResult {
  planner: DailyPlanner | null;
  tasks: Task[];
  taskLogs: TaskLog[];
  totalStudyTime: number;
}

export interface CalendarTaskData {
  id: string;
  title: string;
  subject: Task['subject'];
  hasReview: boolean;
  isCompleted: boolean;
  date: string;
}

export interface PlanFeedback {
  id?: string | number;
  content: string;
}

const normalizePlanner = (raw: unknown): DailyPlanner => mapDailyPlannerFromApi(raw);

const normalizeTask = (raw: unknown): Task => mapTaskFromApi(raw);

const normalizeTaskLog = (raw: unknown): TaskLog => mapTaskLogFromApi(raw);

const SUBJECT_VALUES: readonly Subject[] = ['KOREAN', 'ENGLISH', 'MATH', 'OTHER'];

const normalizeCalendarTaskFromApi = (raw: unknown, fallbackDate?: string): CalendarTaskData => {
  const obj = asRecord(raw, 'CalendarTask');
  const subjectRaw = asOptionalString(pick(obj, ['subject']), 'CalendarTask.subject') ?? 'OTHER';
  const subject = SUBJECT_VALUES.includes(subjectRaw as Subject) ? (subjectRaw as Subject) : 'OTHER';
  const statusRaw = asOptionalString(pick(obj, ['status', 'taskStatus']), 'CalendarTask.status');
  const status = statusRaw ? statusRaw.toUpperCase() : undefined;
  const isCompletedValue = pick(obj, ['isCompleted', 'is_completed', 'completed']);
  const hasReviewValue = pick(obj, ['hasReview', 'has_review', 'submitted', 'isReviewed', 'is_reviewed']);
  const date =
    fallbackDate ??
    asOptionalString(pick(obj, ['taskDate', 'task_date', 'date']), 'CalendarTask.taskDate') ??
    '';
  return {
    id: asString(pick(obj, ['id', 'taskId', 'task_id', 'taskID']), 'CalendarTask.id'),
    title: asOptionalString(pick(obj, ['title']), 'CalendarTask.title') ?? '',
    subject,
    hasReview: Boolean(hasReviewValue),
    isCompleted:
      typeof isCompletedValue === 'boolean'
        ? isCompletedValue
        : status === 'DONE' || status === 'COMPLETED' || status === 'FINISHED',
    date,
  };
};

const normalizeCalendarPage = (raw: unknown): CalendarTaskData[] => {
  const normalizeItem = (item: unknown): CalendarTaskData[] => {
    if (!isRecord(item)) return [];
    const date =
      asOptionalString(pick(item, ['planDate', 'date', 'plan_date']), 'CalendarDay.planDate') ?? '';
    const tasksRaw =
      asOptionalArray(
        pick(item, ['tasks', 'taskList', 'task_list', 'dailyPlanTasks', 'planTasks', 'content']),
        'CalendarDay.tasks'
      ) ?? [];

    if (tasksRaw.length > 0) {
      return tasksRaw.map((task) => normalizeCalendarTaskFromApi(task, date)).filter((t) => Boolean(t.date));
    }

    // If item itself looks like a task response
    if ('taskDate' in item || 'subject' in item || 'title' in item) {
      const task = normalizeCalendarTaskFromApi(item, date);
      return task.date ? [task] : [];
    }

    return [];
  };

  if (Array.isArray(raw)) {
    return raw.flatMap(normalizeItem);
  }

  const obj = asRecord(raw, 'CalendarPage');
  const content = asOptionalArray(pick(obj, ['content']), 'CalendarPage.content') ?? [];
  return content.flatMap(normalizeItem);
};

const normalizeFeedback = (raw: unknown): PlanFeedback => {
  const obj = asRecord(raw, 'PlanFeedback');
  return {
    id: asOptionalString(pick(obj, ['id', 'feedbackId', 'feedback_id']), 'PlanFeedback.id'),
    content: asString(pick(obj, ['content', 'feedback']), 'PlanFeedback.content'),
  };
};

export const planApi = {
  getDailyPlan: async (params: DailyPlanQuery): Promise<DailyPlanResult> => {
    if (USE_MOCK) return mockApi.plan.getDailyPlan(params);
    const data = await apiClient.get('/plans', { params });
    const obj = asRecord(data, 'PlanResponse');

    const plannerRaw = obj.planner ?? obj.plan ?? obj.dailyPlanner ?? obj;
    const tasksRaw = asOptionalArray(pick(obj, ['tasks']), 'PlanResponse.tasks') ?? [];
    const taskLogsRaw = asOptionalArray(pick(obj, ['taskLogs', 'task_logs']), 'PlanResponse.taskLogs') ?? [];

    const planner = plannerRaw ? normalizePlanner(plannerRaw) : null;
    const tasks = tasksRaw.map(normalizeTask);

    let taskLogs: TaskLog[] = taskLogsRaw.map(normalizeTaskLog);
    if (taskLogs.length === 0 && tasks.length > 0) {
      const logsList = await Promise.all(
        tasks.map(async (task) => {
          try {
            const logs = await apiClient.get(`/tasks/${task.id}/logs`);
            return Array.isArray(logs) ? logs : (asRecord(logs, 'TaskLogs').content as unknown[] ?? []);
          } catch {
            return [];
          }
        })
      );
      taskLogs = logsList.flat().map(normalizeTaskLog);
    }

    const rawTotal = (obj as Record<string, unknown>).totalStudyTime ?? (obj as Record<string, unknown>).total_study_time;
    const totalStudyTime = rawTotal !== undefined
      ? asNumber(rawTotal, 'PlanResponse.totalStudyTime')
      : planner?.totalStudyTime ?? 0;

    return {
      planner,
      tasks,
      taskLogs,
      totalStudyTime,
    };
  },

  createPlan: async (payload: { planDate: string; dailyMemo: string | null }): Promise<DailyPlanner> => {
    if (USE_MOCK) return mockApi.plan.createPlan(payload);
    const data = await apiClient.post('/plans', payload);
    return normalizePlanner(data);
  },

  updatePlan: async (planId: string | number, payload: { dailyMemo: string | null }): Promise<DailyPlanner> => {
    if (USE_MOCK) return mockApi.plan.updatePlan(planId, payload);
    const data = await apiClient.put(`/plans/${planId}`, payload);
    return normalizePlanner(data);
  },

  getCalendar: async (params: {
    menteeId?: string;
    year: number;
    month: number;
    subject?: string;
    incompleteOnly?: boolean;
    page?: number;
    size?: number;
  }): Promise<CalendarTaskData[]> => {
    if (USE_MOCK) return mockApi.plan.getCalendar(params);
    const { menteeId, year, month, subject, incompleteOnly } = params;
    const data = await apiClient.get('/plans/calendar', {
      params: {
        menteeId,
        year,
        month,
        subject,
        incompleteOnly,
        page: params.page ?? 0,
        size: params.size ?? 31,
      },
    });
    return normalizeCalendarPage(data);
  },

  getWeeklyCalendar: async (params: {
    menteeId?: string;
    date: string;
    page?: number;
    size?: number;
  }): Promise<CalendarTaskData[]> => {
    if (USE_MOCK) return mockApi.plan.getCalendar({ year: Number(params.date.slice(0, 4)), month: Number(params.date.slice(5, 7)) });
    const data = await apiClient.get('/plans/calendar/weekly', {
      params: {
        menteeId: params.menteeId,
        date: params.date,
        page: params.page ?? 0,
        size: params.size ?? 7,
      },
    });
    return normalizeCalendarPage(data);
  },

  getFeedback: async (planId: string | number): Promise<PlanFeedback | null> => {
    if (USE_MOCK) return mockApi.plan.getFeedback(planId);
    const data = await apiClient.get(`/plans/${planId}/feedback`);
    if (!data) return null;
    return normalizeFeedback(data);
  },

  createFeedback: async (planId: string | number, content: string): Promise<PlanFeedback> => {
    if (USE_MOCK) return mockApi.plan.createFeedback(planId, content);
    const data = await apiClient.post(`/plans/${planId}/feedback`, { content });
    return normalizeFeedback(data);
  },

  updateFeedback: async (planId: string | number, content: string): Promise<PlanFeedback> => {
    if (USE_MOCK) return mockApi.plan.updateFeedback(planId, content);
    const data = await apiClient.put(`/plans/${planId}/feedback`, { content });
    return normalizeFeedback(data);
  },

  deleteFeedback: async (planId: string | number): Promise<void> => {
    if (USE_MOCK) return mockApi.plan.deleteFeedback(planId);
    await apiClient.delete(`/plans/${planId}/feedback`);
  },
};
