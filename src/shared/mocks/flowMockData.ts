import type { User } from '@/entities/user/types';
import type { Task } from '@/entities/task/types';
import type { TaskLog } from '@/entities/task-log/types';
import type { DailyPlanner } from '@/entities/daily-plan/types';
import type { TaskFeedback } from '@/entities/task-feedback/types';
import type { Answer } from '@/entities/answer/types';
import type { Notification } from '@/entities/notification/types';
import type { ReportData } from '@/features/report/model/types';
import type { ZoomFeedbackData } from '@/features/zoom-feedback/model/types';
import type { Weakness } from '@/entities/weakness/types';
import type { StudyContent } from '@/features/study-content/api/studyContentApi';

let seq = 1000;
const nextId = (prefix: string) => `${prefix}-${seq++}`;

export const mockImage = (label: string, width = 200, height = 200) => {
  const text = encodeURIComponent(label);
  return (
    `data:image/svg+xml;utf8,` +
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>` +
    `<rect width='100%' height='100%' fill='%23F1F5F9'/>` +
    `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' ` +
    `font-family='Arial' font-size='16' fill='%236B7280'>${text}</text>` +
    `</svg>`
  );
};

export const mockUsers = {
  mentee: {
    id: 'mentee-1',
    username: 'mentee01',
    name: 'Mentee One',
    nickName: 'Mentee',
    role: 'MENTEE',
    profileImgUrl: mockImage('Mentee', 200, 200),
    fcmToken: 'fcm-mentee-1',
    isAlarmEnabled: true,
    createdAt: '2026-02-01T09:00:00',
    updatedAt: '2026-02-08T10:00:00',
  } as User,
  mentor: {
    id: 'mentor-1',
    username: 'mentor01',
    name: 'Mentor One',
    nickName: 'Mentor',
    role: 'MENTOR',
    profileImgUrl: mockImage('Mentor', 200, 200),
    fcmToken: 'fcm-mentor-1',
    isAlarmEnabled: true,
    createdAt: '2026-02-01T09:00:00',
    updatedAt: '2026-02-08T10:00:00',
  } as User,
};

export const mockMentees = [
  { id: 'mentee-1', name: 'Mentee One' },
  { id: 'mentee-2', name: 'Mentee Two' },
];

export const mockPlans: DailyPlanner[] = [
  {
    id: 'plan-1',
    planDate: '2026-02-08',
    totalStudyTime: 5400,
    dailyMemo: 'Mock memo for today',
    createdAt: '2026-02-08T08:30:00',
    mentorFeedback: null,
    menteeId: 'mentee-1',
  },
  {
    id: 'plan-2',
    planDate: '2026-02-07',
    totalStudyTime: 3600,
    dailyMemo: 'Mock memo for yesterday',
    createdAt: '2026-02-07T08:30:00',
    mentorFeedback: null,
    menteeId: 'mentee-1',
  },
];

export const mockTasks: Task[] = [
  {
    id: 'task-101',
    subject: 'ENGLISH',
    title: 'English Words 20',
    status: 'TODO',
    taskDate: '2026-02-08',
    recurringGroupId: null,
    isMentorChecked: false,
    isMandatory: false,
    contentId: null,
    weaknessId: null,
    menteeId: 'mentee-1',
  },
  {
    id: 'task-102',
    subject: 'KOREAN',
    title: 'Reading Passage 1',
    status: 'DONE',
    taskDate: '2026-02-08',
    recurringGroupId: null,
    isMentorChecked: true,
    isMandatory: true,
    contentId: null,
    weaknessId: null,
    menteeId: 'mentee-1',
  },
  {
    id: 'task-103',
    subject: 'MATH',
    title: 'Fractions Drill',
    status: 'DONE',
    taskDate: '2026-02-07',
    recurringGroupId: null,
    isMentorChecked: false,
    isMandatory: true,
    contentId: null,
    weaknessId: null,
    menteeId: 'mentee-1',
  },
];

export const mockTaskLogs: TaskLog[] = [
  {
    id: 'log-1',
    taskId: 'task-102',
    startAt: '2026-02-08T07:00:00',
    endAt: '2026-02-08T07:30:00',
    duration: 1800,
    timerStatus: 'STOPPED',
  },
  {
    id: 'log-2',
    taskId: 'task-103',
    startAt: '2026-02-07T19:00:00',
    endAt: '2026-02-07T19:45:00',
    duration: 2700,
    timerStatus: 'STOPPED',
  },
];

export const mockSubmissions: Record<string, { id: string; images: { id: string; imageUrl: string }[]; menteeComment: string; createdAt: string; menteeName: string }> = {
  'task-103': {
    id: 'submission-1',
    images: [
      { id: 'img-501', imageUrl: '/test-files/1000020259.jpg' },
      { id: 'img-502', imageUrl: '/test-files/1000020269.jpg' },
    ],
    menteeComment: 'Solved and reviewed.',
    createdAt: '2026-02-07T20:00:00',
    menteeName: 'Mentee One',
  },
};

export const mockFeedbacksByImageId: Record<string, TaskFeedback[]> = {
  'img-501': [
    {
      id: 'feedback-1',
      content: 'Good work, check step 2.',
      imageUrl: null,
      createdAt: '2026-02-08T09:30:00',
      xPos: 0.45,
      yPos: 0.4,
      taskId: 'task-103',
      mentorId: 'mentor-1',
      imageId: 'img-501',
    },
  ],
  'img-502': [
    {
      id: 'feedback-2',
      content: 'Nice improvement, review the last step.',
      imageUrl: null,
      createdAt: '2026-02-08T09:35:00',
      xPos: 0.6,
      yPos: 0.55,
      taskId: 'task-103',
      mentorId: 'mentor-1',
      imageId: 'img-502',
    },
  ],
};

export const mockCommentsByFeedbackId: Record<string, Answer[]> = {
  'feedback-1': [
    {
      id: 'comment-1',
      feedbackId: 'feedback-1',
      comment: 'Thanks, fixed it.',
      userId: 'mentee-1',
      createdAt: '2026-02-08T09:50:00',
    },
  ],
};

export const mockWeaknesses: Weakness[] = [
  {
    id: 'weak-1',
    title: 'Fractions',
    inforId: 'infor-1',
    contentId: 'content-1',
    menteeId: 'mentee-1',
    subject: 'MATH',
    fileName: 'Fractions Pack',
    fileUrl: mockImage('Content', 800, 600),
  },
];

export const mockStudyContents: StudyContent[] = [
  {
    id: 'content-1',
    title: 'Fractions Pack',
    subject: 'MATH',
    fileUrl: mockImage('PDF', 800, 600),
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'FEEDBACK',
    message: '',
    isRead: false,
    createdAt: '2026-02-08T09:30:00',
    userId: 'mentee-1',
    targetType: 'FEEDBACK',
    targetId: 'task-103',
    targetTitle: 'Fractions Drill',
  },
  {
    id: 'notif-2',
    type: 'COMMENT',
    message: '',
    isRead: false,
    createdAt: '2026-02-08T09:50:00',
    userId: 'mentee-1',
    targetType: 'COMMENT',
    targetId: 'task-103',
    targetTitle: 'Fractions Drill',
  },
  {
    id: 'notif-3',
    type: 'TASK',
    message: '',
    isRead: true,
    createdAt: '2026-02-07T08:30:00',
    userId: 'mentee-1',
    targetType: 'TASK',
    targetId: 'task-101',
    targetTitle: 'English Words 20',
  },
  {
    id: 'notif-4',
    type: 'WEEKLY_REPORT',
    message: '',
    isRead: true,
    createdAt: '2026-02-06T18:00:00',
    userId: 'mentee-1',
    targetType: 'WEEKLY_REPORT',
    targetId: 'report-1',
    targetTitle: 'Week 1 Report',
  },
  {
    id: 'notif-5',
    type: 'ZOOM_FEEDBACK',
    message: '',
    isRead: false,
    createdAt: '2026-02-06T20:00:00',
    userId: 'mentee-1',
    targetType: 'ZOOM_FEEDBACK',
    targetId: 'zoom-1',
    targetTitle: 'Zoom Feedback',
  },
];

export const mockWeeklyReports: ReportData[] = [
  {
    id: 'report-1',
    menteeId: 'mentee-1',
    startDate: '2026-02-01',
    endDate: '2026-02-07',
    totalReview: 'Weekly summary of study.',
    wellDone: 'Consistent daily study.',
    improvements: 'Need more math practice.',
  },
];

export const mockZoomFeedbacks: ZoomFeedbackData[] = [
  {
    id: 'zoom-1',
    title: 'Weekly Zoom',
    memo: 'Good progress.',
    subjects: {
      korean: 'Keep reading.',
      english: 'Vocabulary improvement needed.',
      math: 'Practice fractions.',
    },
    operation: 'Great attendance.',
    meetingDate: '2026-02-06',
  },
];

export const mockDb = {
  users: mockUsers,
  mentees: mockMentees,
  plans: mockPlans,
  tasks: mockTasks,
  taskLogs: mockTaskLogs,
  submissions: mockSubmissions,
  feedbacksByImageId: mockFeedbacksByImageId,
  commentsByFeedbackId: mockCommentsByFeedbackId,
  notifications: mockNotifications,
  weeklyReports: mockWeeklyReports,
  zoomFeedbacks: mockZoomFeedbacks,
  weaknesses: mockWeaknesses,
  studyContents: mockStudyContents,
  nextId,
};
