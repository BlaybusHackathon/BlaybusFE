import { Task } from '@/entities/task/types';
import { StudyTimeSlot } from '@/entities/study-time/types';

const TODAY = new Date().toISOString().split('T')[0];

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: '비문학 3지문 풀이',
    subject: 'KOREAN',
    date: TODAY,
    isFixed: true,
    isCompleted: false,
    menteeId: 'mentee-1',
    createdBy: 'MENTOR',
  },
  {
    id: 'task-2',
    title: '미적분 문제 20번',
    subject: 'MATH',
    date: TODAY,
    isFixed: true,
    isCompleted: true,
    menteeId: 'mentee-1',
    createdBy: 'MENTOR',
  },
  {
    id: 'task-3',
    title: '영단어 50개 암기',
    subject: 'ENGLISH',
    date: TODAY,
    isFixed: false,
    isCompleted: false,
    menteeId: 'mentee-1',
    createdBy: 'MENTEE',
  },
];

export const MOCK_STUDY_TIME_SLOTS: StudyTimeSlot[] = [
  { startTime: '09:00', endTime: '10:30', subject: 'KOREAN' , taskId: 'task-1'},
  { startTime: '14:00', endTime: '16:00', subject: 'MATH' , taskId: 'task-2'},
];