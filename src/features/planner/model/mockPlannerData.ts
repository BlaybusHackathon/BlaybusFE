import { Task } from '@/entities/task/types';
import { TaskLog } from '@/entities/task-log/types';
import { DailyPlanner } from '@/entities/daily-plan/types'; 
import { getAdjustedDate } from '@/shared/lib/date';
import { format, subDays } from 'date-fns';

const TODAY_OBJ = new Date(getAdjustedDate());
const TODAY = format(TODAY_OBJ, 'yyyy-MM-dd');
const YESTERDAY = format(subDays(TODAY_OBJ, 1), 'yyyy-MM-dd');

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: '비문학 3지문 풀이',
    subject: 'KOREAN',
    status: 'PENDING',
    taskDate: TODAY,
    isMandatory: true,
    isMentorChecked: false,
    menteeId: 'mentee-1',
    recurringGroupId: null,
    contentId: null,
    weaknessId: null,
  },
  {
    id: 'task-2',
    title: '미적분 문제 20번',
    subject: 'MATH',
    status: 'COMPLETED',
    taskDate: TODAY,
    isMandatory: true,
    isMentorChecked: false,
    menteeId: 'mentee-1',
    recurringGroupId: null,
    contentId: null,
    weaknessId: null,
  },
  {
    id: 'task-3',
    title: '영단어 50개 암기',
    subject: 'ENGLISH',
    status: 'IN_PROGRESS',
    taskDate: TODAY,
    isMandatory: false,
    isMentorChecked: false,
    menteeId: 'mentee-1',
    recurringGroupId: null,
    contentId: null,
    weaknessId: null,
  },
  {
    id: 'task-4',
    title: '[어제] 문학 작품 분석',
    subject: 'KOREAN',
    status: 'COMPLETED',
    taskDate: YESTERDAY,
    isMandatory: true,
    isMentorChecked: true,
    menteeId: 'mentee-1',
    recurringGroupId: null,
    contentId: null,
    weaknessId: null,
  },
  {
    id: 'task-5',
    title: '[어제] 수열 문제 풀이',
    subject: 'MATH',
    status: 'COMPLETED',
    taskDate: YESTERDAY,
    isMandatory: false,
    isMentorChecked: false,
    menteeId: 'mentee-1',
    recurringGroupId: null,
    contentId: null,
    weaknessId: null,
  },
];

export const MOCK_TASK_LOGS: TaskLog[] = [
  { 
    id: 'log-1',
    startAt: `${TODAY}T09:00:00`, 
    endAt: `${TODAY}T10:30:00`, 
    duration: 5400,
    taskId: 'task-1'
  },
  { 
    id: 'log-2',
    startAt: `${YESTERDAY}T14:00:00`, 
    endAt: `${YESTERDAY}T16:00:00`, 
    duration: 7200,
    taskId: 'task-4'
  },
  { 
    id: 'log-3',
    startAt: `${YESTERDAY}T19:00:00`, 
    endAt: `${YESTERDAY}T20:30:00`, 
    duration: 5400,
    taskId: 'task-5'
  },
];

export const MOCK_DAILY_PLANNERS: DailyPlanner[] = [
  {
    id: 'dp-1',
    planDate: TODAY,
    totalStudyTime: 0,
    dailyMemo: '오늘은 수학이 너무 어려웠다. 그래도 끝까지 포기하지 않고 풀어서 뿌듯하다!',
    createdAt: TODAY,
    mentorFeedback: null,
    menteeId: 'mentee-1',
  },
  {
    id: 'dp-2',
    planDate: YESTERDAY,
    totalStudyTime: 320,
    dailyMemo: '영어 단어 외우는 게 지루하지만 꾹 참고 다 외웠다!',
    createdAt: YESTERDAY,
    mentorFeedback: '꾸준히 하는 모습이 보기 좋아요! 영어 단어는 자투리 시간을 활용해보세요.',
    menteeId: 'mentee-1',
  }
];