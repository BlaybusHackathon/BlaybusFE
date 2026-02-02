import { Subject } from '@/shared/constants/subjects';

export interface Task {
  id: string;
  title: string;
  subject: Subject;
  date: string;
  isFixed: boolean;
  isCompleted: boolean;
  menteeId: string;
  createdBy: 'MENTOR' | 'MENTEE';
}