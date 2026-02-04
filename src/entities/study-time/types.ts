import { Subject } from '@/shared/constants/subjects';

export interface StudyTimeSlot {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  subject: Subject;
  taskId: string;
}

export interface StudyTime {
  id: string;
  date: string;
  menteeId: string;
  slots: StudyTimeSlot[];
}