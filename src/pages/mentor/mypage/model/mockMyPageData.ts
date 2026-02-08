import { DashboardStats, MenteeSummary, RecentFeedbackComment, RecentSubmittedTask } from './types';

export const MOCK_STATS: DashboardStats = {
  uncheckedTaskCount: 5,
  pendingFeedbackCount: 12,
};

export const MOCK_MY_MENTEES: MenteeSummary[] = [
  {
    id: 'mentee-1',
    name: '홍길동',
    school: '중앙중',
    grade: 2,
    profileImgUrl: 'https://bit.ly/ryan-florence',
    achievement: {
      korean: 78,
      english: 64,
      math: 82,
    },
    lastActiveAt: '2026-02-07T12:00:00Z',
  },
  {
    id: 'mentee-2',
    name: '박영희',
    school: '한빛중',
    grade: 1,
    profileImgUrl: null,
    achievement: {
      korean: 55,
      english: 70,
      math: 61,
    },
    lastActiveAt: '2026-02-06T09:20:00Z',
  },
  {
    id: 'mentee-3',
    name: '최민수',
    school: '새빛중',
    grade: 3,
    profileImgUrl: 'https://bit.ly/code-beast',
    achievement: {
      korean: 66,
      english: 58,
      math: 73,
    },
    lastActiveAt: '2026-02-05T16:45:00Z',
  },
];

export const MOCK_RECENT_TASKS: RecentSubmittedTask[] = [
  {
    id: 'task-101',
    title: '비문학 지문 분석',
    subject: 'KOREAN',
    menteeId: 'mentee-1',
    menteeName: '홍길동',
    submittedAt: '2026-02-07T10:30:00Z',
  },
  {
    id: 'task-102',
    title: '미적분 30번 문제 풀이',
    subject: 'MATH',
    menteeId: 'mentee-3',
    menteeName: '최민수',
    submittedAt: '2026-02-07T09:15:00Z',
  },
];

export const MOCK_RECENT_COMMENTS: RecentFeedbackComment[] = [
  {
    id: 'comment-1',
    content: '학생이 이 부분을 특히 궁금해합니다.',
    menteeId: 'mentee-2',
    menteeName: '박영희',
    taskId: 'task-99',
    feedbackId: 'fb-1',
    createdAt: '2026-02-07T11:00:00Z',
    isRead: false,
  },
  {
    id: 'comment-2',
    content: '다음에 이 부분 다시 설명 부탁드립니다.',
    menteeId: 'mentee-1',
    menteeName: '홍길동',
    taskId: 'task-88',
    feedbackId: 'fb-2',
    createdAt: '2026-02-07T10:20:00Z',
    isRead: true,
  },
];
