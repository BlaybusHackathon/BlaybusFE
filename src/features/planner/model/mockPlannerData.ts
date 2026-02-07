import { Task } from '@/entities/task/types';
import { TaskLog } from '@/entities/task-log/types';
import { DailyPlanner } from '@/entities/daily-plan/types';
import { getAdjustedDate } from '@/shared/lib/date';

const TODAY = getAdjustedDate();

// [1] 과제 정의 (task-1 존재 확인)
export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: '수능특강 국어 독서 3지문',
    subject: 'KOREAN',
    taskDate: TODAY,
    status: 'PENDING',
    isMandatory: true,
    isMentorChecked: false,
    menteeId: 'mentee1',
    recurringGroupId: null,
    contentId: null,
    weaknessId: null,
  },
  {
    id: 'task-2',
    title: '수능특강 수학 10문제',
    subject: 'MATH',
    taskDate: TODAY,
    status: 'PENDING',
    isMandatory: true,
    isMentorChecked: false,
    menteeId: 'mentee1',
    recurringGroupId: null,
    contentId: null,
    weaknessId: null,
  },
];

// [2] 누적 시간 로그 (task-1에 1시간 30분 부여)
export const MOCK_TASK_LOGS: TaskLog[] = [
  {
    id: 'log-1',
    taskId: 'task-1',
    startAt: `${TODAY}T09:00:00`,
    endAt: `${TODAY}T10:30:00`,
    duration: 5400, // 1시간 30분 (90분)
    timerStatus: 'COMPLETED',
  },
  // task-2에는 로그 없음 -> 00:00:00 시작
];

export const MOCK_DAILY_PLANNERS: DailyPlanner[] = [
  {
    id: 'plan-1',
    planDate: TODAY,
    totalStudyTime: 5400, // 전체 공부 시간도 맞춰줌
    dailyMemo: '오늘도 파이팅!',
    createdAt: `${TODAY}T08:00:00`,
    mentorFeedback: '어제보다 나아진 모습이 보기 좋습니다.',
    menteeId: 'mentee1',
  }
];