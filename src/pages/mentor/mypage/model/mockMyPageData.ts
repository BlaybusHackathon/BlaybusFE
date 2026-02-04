import { DashboardStats, MenteeSummary, RecentFeedbackComment, RecentSubmittedTask } from './types';

export const MOCK_STATS: DashboardStats = {
  uncheckedTaskCount: 5,
  pendingFeedbackCount: 12,
};

export const MOCK_MY_MENTEES: MenteeSummary[] = [
  {
    id: 'mentee-1',
    name: '이멘티',
    profileImgUrl: 'https://bit.ly/ryan-florence',
    achievement: { korean: 80, english: 45, math: 90 },
  },
  {
    id: 'mentee-2',
    name: '박공부',
    profileImgUrl: null,
    achievement: { korean: 60, english: 75, math: 50 },
  },
  {
    id: 'mentee-3',
    name: '최수학',
    profileImgUrl: 'https://bit.ly/code-beast',
    achievement: { korean: 40, english: 30, math: 95 },
  },
];

export const MOCK_RECENT_TASKS: RecentSubmittedTask[] = [
  {
    id: 'task-101',
    title: '비문학 지문 분석',
    subject: 'KOREAN',
    menteeId: 'mentee-1',
    menteeName: '이멘티',
    submittedAt: '2024-02-14T10:30:00',
  },
  {
    id: 'task-102',
    title: '미적분 30번 문제 풀이',
    subject: 'MATH',
    menteeId: 'mentee-3',
    menteeName: '최수학',
    submittedAt: '2024-02-14T09:15:00',
  },
];

export const MOCK_RECENT_COMMENTS: RecentFeedbackComment[] = [
  {
    id: 'comment-1',
    content: '선생님, 이 부분 이해가 잘 안 돼요 ㅠㅠ',
    menteeId: 'mentee-2',
    menteeName: '박공부',
    taskId: 'task-99',
    feedbackId: 'fb-1',
    createdAt: '2024-02-13T20:00:00',
  },
  {
    id: 'comment-2',
    content: '넵 알겠습니다! 수정해서 다시 올릴게요.',
    menteeId: 'mentee-1',
    menteeName: '이멘티',
    taskId: 'task-88',
    feedbackId: 'fb-2',
    createdAt: '2024-02-13T18:30:00',
  },
];