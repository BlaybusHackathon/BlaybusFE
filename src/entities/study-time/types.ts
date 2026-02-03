import { Subject } from '@/shared/constants/subjects';

export interface StudyTimeSlot {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  subject: Subject;
}

export interface StudyTime {
  id: string;
  date: string;
  menteeId: string;
  slots: StudyTimeSlot[];
}