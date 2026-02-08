import type { DailyPlanner } from '@/entities/daily-plan/types';
import type { Task } from '@/entities/task/types';
import type { TaskLog } from '@/entities/task-log/types';
import type { TaskDetailFullData } from '@/entities/task-detail/types';
import type { TaskFeedback } from '@/entities/task-feedback/types';
import type { Answer } from '@/entities/answer/types';
import type { PlanFeedback } from '@/features/planner/api/planApi';
import type { ReportData } from '@/features/report/model/types';
import type { ZoomFeedbackData, ZoomFeedbackListItem } from '@/features/zoom-feedback/model/types';
import type { NotificationPage, NotificationFilter } from '@/features/notification/api/notificationApi';
import type { FeedbackWithTask } from '@/features/task-feedback/model/types';
import { mockDb, mockImage } from './flowMockData';

const delay = async (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

const pickPlanByDate = (date: string) =>
  mockDb.plans.find((p) => p.planDate === date) ?? null;

const pickTasksByDate = (date: string) =>
  mockDb.tasks.filter((t) => t.taskDate === date);

const pickLogsByTaskIds = (taskIds: string[]) =>
  mockDb.taskLogs.filter((l) => taskIds.includes(l.taskId));

const sumLogs = (logs: TaskLog[]) =>
  logs.reduce((acc, log) => acc + (log.duration || 0), 0);

const toTaskDetail = (task: Task): TaskDetailFullData => {
  const submission = mockDb.submissions[task.id];
  const submissionImages = submission?.images ?? [];
  return {
    id: task.id,
    title: task.title,
    subject: task.subject,
    taskDate: task.taskDate,
    isMentorChecked: task.isMentorChecked,
    description: undefined,
    taskFile: null,
    weakness: null,
    submission: submission
      ? {
          id: submission.id,
          images: submissionImages.map((img) => img.imageUrl),
          imageIds: submissionImages.map((img) => img.id),
          memo: submission.menteeComment,
          isFeedbackReceived: true,
        }
      : null,
  };
};

const toFeedbackWithTask = (fb: TaskFeedback): FeedbackWithTask => {
  const task = mockDb.tasks.find((t) => t.id === fb.taskId);
  return {
    ...fb,
    authorName: mockDb.users.mentor.name,
    authorProfileUrl: mockDb.users.mentor.profileImgUrl,
    subject: task?.subject ?? 'OTHER',
    taskTitle: task?.title ?? 'Task',
    taskDate: task?.taskDate,
    weekNumber: 1,
    menteeName: mockDb.users.mentee.name,
  };
};

export const mockApi = {
  auth: {
    login: async (req?: { username?: string }) => {
      await delay();
      const useMentor = req?.username?.toLowerCase().includes('mentor');
      return {
        user: useMentor ? mockDb.users.mentor : mockDb.users.mentee,
        token: 'mock-token',
      };
    },
  },

  user: {
    getMe: async () => {
      await delay();
      return mockDb.users.mentee;
    },
    updateMe: async (payload: { name?: string; nickName?: string }) => {
      await delay();
      mockDb.users.mentee = {
        ...mockDb.users.mentee,
        name: payload.name ?? mockDb.users.mentee.name,
        nickName: payload.nickName ?? mockDb.users.mentee.nickName,
        updatedAt: '2026-02-08T12:00:00',
      };
      return mockDb.users.mentee;
    },
    uploadProfile: async () => {
      await delay();
      const url = mockImage('Profile', 200, 200);
      mockDb.users.mentee = {
        ...mockDb.users.mentee,
        profileImgUrl: url,
        updatedAt: '2026-02-08T12:00:00',
      };
      return url;
    },
    registerFcmToken: async (token: string) => {
      await delay();
      mockDb.users.mentee = {
        ...mockDb.users.mentee,
        fcmToken: token,
      };
    },
  },

  mentoring: {
    listMentees: async () => {
      await delay();
      return mockDb.mentees;
    },
  },

  plan: {
    getDailyPlan: async (params: { year: number; month: number; day: number }) => {
      await delay();
      const date = `${params.year.toString().padStart(4, '0')}-${String(params.month).padStart(2, '0')}-${String(params.day).padStart(2, '0')}`;
      const planner = pickPlanByDate(date);
      const tasks = pickTasksByDate(date);
      const logs = pickLogsByTaskIds(tasks.map((t) => t.id));
      return {
        planner,
        tasks,
        taskLogs: logs,
        totalStudyTime: sumLogs(logs),
      };
    },
    createPlan: async (payload: { planDate: string; dailyMemo: string | null }) => {
      await delay();
      const newPlan: DailyPlanner = {
        id: mockDb.nextId('plan'),
        planDate: payload.planDate,
        totalStudyTime: 0,
        dailyMemo: payload.dailyMemo,
        createdAt: '2026-02-08T12:00:00',
        mentorFeedback: null,
        menteeId: mockDb.users.mentee.id,
      };
      mockDb.plans.push(newPlan);
      return newPlan;
    },
    updatePlan: async (planId: string, payload: { dailyMemo: string | null }) => {
      await delay();
      const plan = mockDb.plans.find((p) => p.id === planId);
      if (plan) {
        plan.dailyMemo = payload.dailyMemo;
      }
      return plan as DailyPlanner;
    },
    getCalendar: async (params?: { year?: number; month?: number; subject?: string; incompleteOnly?: boolean }) => {
      await delay();
      const list = mockDb.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        subject: task.subject,
        hasReview: false,
        isCompleted: task.status === 'DONE',
        date: task.taskDate,
      }));
      return list.filter((item) => {
        if (params?.year && params?.month) {
          const prefix = `${params.year}-${String(params.month).padStart(2, '0')}`;
          if (!item.date.startsWith(prefix)) return false;
        }
        if (params?.subject && item.subject !== params.subject) return false;
        if (params?.incompleteOnly && item.isCompleted) return false;
        return true;
      });
    },
    getFeedback: async (_planId?: string | number) => {
      void _planId;
      await delay();
      return null;
    },
    createFeedback: async (_planId: string | number, content: string) => {
      void _planId;
      await delay();
      return { id: mockDb.nextId('plan-feedback'), content } as PlanFeedback;
    },
    updateFeedback: async (planId: string | number, content: string) => {
      await delay();
      return { id: planId, content } as PlanFeedback;
    },
    deleteFeedback: async (_planId?: string | number) => {
      void _planId;
      await delay();
    },
  },

  task: {
    getTaskDetail: async (taskId: string) => {
      await delay();
      const task = mockDb.tasks.find((t) => t.id === taskId) ?? mockDb.tasks[0];
      return toTaskDetail(task);
    },
    createMenteeTask: async (payload: { date: string; title: string; subject: string }) => {
      await delay();
      const newTask: Task = {
        id: mockDb.nextId('task'),
        title: payload.title,
        subject: payload.subject as Task['subject'],
        status: 'TODO',
        taskDate: payload.date,
        isMandatory: false,
        isMentorChecked: false,
        menteeId: mockDb.users.mentee.id,
        recurringGroupId: null,
        contentId: null,
        weaknessId: null,
      };
      mockDb.tasks.push(newTask);
      mockDb.notifications.unshift({
        id: mockDb.nextId('notif'),
        type: 'TASK',
        message: '',
        isRead: false,
        createdAt: '2026-02-08T12:05:00',
        userId: mockDb.users.mentee.id,
        targetType: 'TASK',
        targetId: newTask.id,
        targetTitle: newTask.title,
      });
      return newTask;
    },
    createMentorTask: async (
      menteeId: string,
      payload: {
        subject: string;
        weekNumber: number;
        startDate: string;
        endDate: string;
        daysOfWeek: string[];
        title: string;
        weaknessId?: string | number | null;
        dayContents: Array<{ day: string; contentId?: string | number | null }>;
      }
    ) => {
      await delay();
      const baseTask: Task = {
        id: mockDb.nextId('task'),
        title: payload.title,
        subject: payload.subject as Task['subject'],
        status: 'TODO',
        taskDate: payload.startDate,
        isMandatory: true,
        isMentorChecked: false,
        menteeId,
        recurringGroupId: mockDb.nextId('recurring'),
        contentId: payload.dayContents?.[0]?.contentId ? String(payload.dayContents[0].contentId) : null,
        weaknessId: payload.weaknessId ? String(payload.weaknessId) : null,
      };
      mockDb.tasks.push(baseTask);
      mockDb.notifications.unshift({
        id: mockDb.nextId('notif'),
        type: 'TASK',
        message: '',
        isRead: false,
        createdAt: '2026-02-08T12:15:00',
        userId: menteeId,
        targetType: 'TASK',
        targetId: baseTask.id,
        targetTitle: baseTask.title,
      });
    },
    updateTask: async (taskId: string, payload: { title?: string; subject?: string; status?: string }) => {
      await delay();
      const task = mockDb.tasks.find((t) => t.id === taskId);
      if (task) {
        if (payload.title !== undefined) task.title = payload.title;
        if (payload.subject !== undefined) task.subject = payload.subject as Task['subject'];
        if (payload.status !== undefined) task.status = payload.status as Task['status'];
      }
      return task as Task;
    },
    confirmMentorTask: async (taskId: string) => {
      await delay();
      const task = mockDb.tasks.find((t) => t.id === taskId);
      if (task) {
        task.isMentorChecked = true;
      }
    },
    deleteTask: async (taskId: string) => {
      await delay();
      mockDb.tasks = mockDb.tasks.filter((t) => t.id !== taskId);
      delete mockDb.submissions[taskId];
    },
    startTaskTimer: async (taskId: string) => {
      await delay();
      return { taskId, timerStatus: 'RUNNING', timerStartedAt: '2026-02-08T12:00:00' };
    },
    stopTaskTimer: async (taskId: string) => {
      await delay();
      const minutes = 25;
      const log: TaskLog = {
        id: mockDb.nextId('log'),
        taskId,
        startAt: '2026-02-08T12:00:00',
        endAt: '2026-02-08T12:25:00',
        duration: minutes * 60,
        timerStatus: 'STOPPED',
      };
      mockDb.taskLogs.push(log);
      const seconds = minutes * 60;
      return {
        taskId,
        sessionSeconds: seconds,
        accumulatedSeconds: seconds,
        sessionMinutes: minutes,
        accumulatedMinutes: minutes,
      };
    },
    getTaskLogs: async (taskId: string) => {
      await delay();
      return mockDb.taskLogs.filter((l) => l.taskId === taskId);
    },
  },

  submission: {
    submit: async (taskId: string, memo: string, files: File[]) => {
      await delay();
      const images = files.map((file) => ({
        id: mockDb.nextId('img'),
        imageUrl: mockImage(file.name || 'Submission', 800, 600),
      }));
      mockDb.submissions[taskId] = {
        id: mockDb.nextId('submission'),
        images,
        menteeComment: memo ?? '',
        createdAt: '2026-02-08T12:10:00',
        menteeName: mockDb.users.mentee.name,
      };
      return mockDb.submissions[taskId];
    },
    deleteSubmission: async (submissionId: string) => {
      await delay();
      const entry = Object.entries(mockDb.submissions).find(([, value]) => value.id === submissionId);
      if (entry) {
        delete mockDb.submissions[entry[0]];
      }
    },
  },

  feedback: {
    getFeedbacksByImageId: async (imageId: string) => {
      await delay();
      return mockDb.feedbacksByImageId[imageId] ?? [];
    },
    createFeedback: async (imageId: string, payload: { content: string; xPos: number; yPos: number }) => {
      await delay();
      const feedback: TaskFeedback = {
        id: mockDb.nextId('feedback'),
        content: payload.content,
        imageUrl: null,
        createdAt: '2026-02-08T12:20:00',
        xPos: payload.xPos,
        yPos: payload.yPos,
        taskId: 'task-103',
        mentorId: mockDb.users.mentor.id,
        imageId,
      };
      if (!mockDb.feedbacksByImageId[imageId]) mockDb.feedbacksByImageId[imageId] = [];
      mockDb.feedbacksByImageId[imageId].push(feedback);
      return feedback;
    },
    updateFeedback: async (feedbackId: string, payload: { content?: string; imageUrl?: string | null; xPos?: number; yPos?: number }) => {
      await delay();
      for (const list of Object.values(mockDb.feedbacksByImageId)) {
        const target = list.find((fb) => fb.id === feedbackId);
        if (target) {
          if (payload.content !== undefined) target.content = payload.content;
          if (payload.imageUrl !== undefined) target.imageUrl = payload.imageUrl ?? null;
          if (payload.xPos !== undefined) target.xPos = payload.xPos;
          if (payload.yPos !== undefined) target.yPos = payload.yPos;
          return target;
        }
      }
      return null;
    },
    deleteFeedback: async (feedbackId: string) => {
      await delay();
      Object.keys(mockDb.feedbacksByImageId).forEach((key) => {
        mockDb.feedbacksByImageId[key] = mockDb.feedbacksByImageId[key].filter((fb) => fb.id !== feedbackId);
      });
    },
    getComments: async (feedbackId: string) => {
      await delay();
      return mockDb.commentsByFeedbackId[feedbackId] ?? [];
    },
    createComment: async (feedbackId: string, comment: string) => {
      await delay();
      const newComment: Answer = {
        id: mockDb.nextId('comment'),
        feedbackId,
        comment,
        userId: mockDb.users.mentor.id,
        createdAt: '2026-02-08T12:30:00',
      };
      if (!mockDb.commentsByFeedbackId[feedbackId]) mockDb.commentsByFeedbackId[feedbackId] = [];
      mockDb.commentsByFeedbackId[feedbackId].push(newComment);
      return newComment;
    },
    updateComment: async (_feedbackId: string, commentId: string, comment: string) => {
      await delay();
      for (const list of Object.values(mockDb.commentsByFeedbackId)) {
        const target = list.find((c) => c.id === commentId);
        if (target) {
          target.comment = comment;
          return target;
        }
      }
      return null;
    },
    deleteComment: async (_feedbackId: string, commentId: string) => {
      await delay();
      Object.keys(mockDb.commentsByFeedbackId).forEach((key) => {
        mockDb.commentsByFeedbackId[key] = mockDb.commentsByFeedbackId[key].filter((c) => c.id !== commentId);
      });
    },
    getYesterdayFeedbacks: async () => {
      await delay();
      const list = Object.values(mockDb.feedbacksByImageId).flat();
      return list.map(toFeedbackWithTask);
    },
    getFeedbackHistory: async () => {
      await delay();
      const list = Object.values(mockDb.feedbacksByImageId).flat();
      return list.map(toFeedbackWithTask);
    },
  },

  weakness: {
    listByMentee: async (menteeId: string) => {
      await delay();
      return mockDb.weaknesses.filter((w) => w.menteeId === menteeId);
    },
    create: async (payload: { menteeId: string; subject: string; title: string; contentId?: string | number }) => {
      await delay();
      const created = {
        id: mockDb.nextId('weak'),
        title: payload.title,
        inforId: mockDb.nextId('infor'),
        contentId: payload.contentId ? String(payload.contentId) : '',
        menteeId: payload.menteeId,
        subject: payload.subject as Task['subject'],
        fileName: 'Mock Content',
        fileUrl: mockImage('Content', 800, 600),
      };
      mockDb.weaknesses.push(created);
      return created;
    },
    remove: async (weaknessId: string) => {
      await delay();
      mockDb.weaknesses = mockDb.weaknesses.filter((w) => w.id !== weaknessId);
    },
  },

  studyContent: {
    upload: async (file: File, payload?: { title?: string; subject?: string }) => {
      await delay();
      const created = {
        id: mockDb.nextId('content'),
        title: payload?.title ?? file.name,
        subject: payload?.subject,
        fileUrl: mockImage(file.name || 'File', 800, 600),
      };
      mockDb.studyContents.push(created);
      return created;
    },
  },

  mentorDashboard: {
    get: async () => {
      await delay();
      return {
        stats: {
          uncheckedTaskCount: 2,
          pendingFeedbackCount: 1,
        },
        mentees: [
          {
            id: mockDb.users.mentee.id,
            name: mockDb.users.mentee.name,
            profileImgUrl: mockDb.users.mentee.profileImgUrl,
            achievement: { korean: 75, english: 60, math: 80 },
            school: 'Central Middle',
            grade: 2,
            lastActiveAt: '2026-02-08T10:00:00',
          },
        ],
        recentTasks: [
          {
            id: 'task-103',
            title: 'Fractions Drill',
            subject: 'MATH',
            menteeId: mockDb.users.mentee.id,
            menteeName: mockDb.users.mentee.name,
            submittedAt: '2026-02-08T09:40:00',
          },
        ],
        recentComments: [
          {
            id: 'comment-1',
            content: 'Thanks, fixed it.',
            menteeId: mockDb.users.mentee.id,
            menteeName: mockDb.users.mentee.name,
            taskId: 'task-103',
            feedbackId: 'feedback-1',
            createdAt: '2026-02-08T09:50:00',
            isRead: false,
          },
        ],
      };
    },
  },

  menteeDashboard: {
    getByMenteeId: async (menteeId: string, _type?: string) => {
      void _type;
      await delay();
      return {
        menteeId,
        name: mockDb.users.mentee.name,
        profileImgUrl: mockDb.users.mentee.profileImgUrl,
        schoolName: 'Central Middle',
        submittedTasksCount: 2,
        remainingTasksCount: 3,
        feedbackQuestionsCount: 1,
        todayPlannerTodoCount: 18,
        koreanProgress: 75,
        mathProgress: 80,
        englishProgress: 60,
      };
    },
    getMy: async (_type?: string) => {
      void _type;
      await delay();
      return {
        menteeId: mockDb.users.mentee.id,
        name: mockDb.users.mentee.name,
        profileImgUrl: mockDb.users.mentee.profileImgUrl,
        schoolName: 'Central Middle',
        submittedTasksCount: 2,
        remainingTasksCount: 3,
        feedbackQuestionsCount: 1,
        todayPlannerTodoCount: 18,
        koreanProgress: 75,
        mathProgress: 80,
        englishProgress: 60,
      };
    },
  },

  notification: {
    list: async (params?: { filter?: NotificationFilter; page?: number; size?: number }): Promise<NotificationPage> => {
      await delay();
      const filter = params?.filter ?? 'all';
      const size = params?.size ?? 20;
      const page = params?.page ?? 0;
      const filtered =
        filter === 'all'
          ? mockDb.notifications
          : mockDb.notifications.filter((n) => (filter === 'read' ? n.isRead : !n.isRead));
      const start = page * size;
      const content = filtered.slice(start, start + size);
      return {
        content,
        totalElements: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / size)),
        size,
        number: page,
      };
    },
    markRead: async (notificationId: string) => {
      await delay();
      const target = mockDb.notifications.find((n) => n.id === notificationId);
      if (target) target.isRead = true;
    },
    markReadAll: async () => {
      await delay();
      mockDb.notifications.forEach((n) => (n.isRead = true));
    },
  },

  report: {
    list: async () => {
      await delay();
      return mockDb.weeklyReports;
    },
    getById: async (reportId: string) => {
      await delay();
      return (mockDb.weeklyReports.find((r) => r.id === reportId) ?? mockDb.weeklyReports[0]) as ReportData;
    },
    create: async (payload: ReportData) => {
      await delay();
      const created: ReportData = {
        ...payload,
        id: payload.id ?? mockDb.nextId('report'),
      };
      mockDb.weeklyReports.push(created);
      return created;
    },
    update: async (reportId: string, payload: ReportData) => {
      await delay();
      const idx = mockDb.weeklyReports.findIndex((r) => r.id === reportId);
      const updated: ReportData = { ...payload, id: reportId };
      if (idx >= 0) {
        mockDb.weeklyReports[idx] = updated;
      } else {
        mockDb.weeklyReports.push(updated);
      }
      return updated;
    },
    remove: async (reportId: string) => {
      await delay();
      mockDb.weeklyReports = mockDb.weeklyReports.filter((r) => r.id !== reportId);
    },
  },

  zoom: {
    list: async () => {
      await delay();
      return mockDb.zoomFeedbacks.map((item) => ({
        id: item.id,
        meetingDate: item.meetingDate ?? '',
        summary: item.title ?? item.memo ?? '',
      })) as ZoomFeedbackListItem[];
    },
    getById: async (zoomId: string) => {
      await delay();
      return (mockDb.zoomFeedbacks.find((z) => z.id === zoomId) ?? mockDb.zoomFeedbacks[0]) as ZoomFeedbackData;
    },
    create: async (payload: ZoomFeedbackData) => {
      await delay();
      const created: ZoomFeedbackData = {
        ...payload,
        id: payload.id ?? mockDb.nextId('zoom'),
      };
      mockDb.zoomFeedbacks.push(created);
      return created;
    },
    update: async (zoomId: string, payload: ZoomFeedbackData) => {
      await delay();
      const idx = mockDb.zoomFeedbacks.findIndex((z) => z.id === zoomId);
      const updated: ZoomFeedbackData = { ...payload, id: zoomId };
      if (idx >= 0) {
        mockDb.zoomFeedbacks[idx] = updated;
      } else {
        mockDb.zoomFeedbacks.push(updated);
      }
      return updated;
    },
    remove: async (zoomId: string) => {
      await delay();
      mockDb.zoomFeedbacks = mockDb.zoomFeedbacks.filter((z) => z.id !== zoomId);
    },
  },
};
