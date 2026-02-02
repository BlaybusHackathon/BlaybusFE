import { Subject } from '@/shared/constants/subjects';
import { StudyTimeSlot } from '@/entities/study-time/types';
import { SLOTS_PER_HOUR, MINUTES_PER_SLOT } from '@/shared/constants/studyTime';

export const timeToIndex = (time: string): number => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * SLOTS_PER_HOUR + Math.floor(minute / MINUTES_PER_SLOT);
};

export const indexToTime = (index: number): string => {
  const hour = Math.floor(index / SLOTS_PER_HOUR);
  const minute = (index % SLOTS_PER_HOUR) * MINUTES_PER_SLOT;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export const slotsToGridState = (slots: StudyTimeSlot[]): (Subject | null)[] => {
  const grid = Array(144).fill(null);
  slots.forEach((slot) => {
    const startIdx = timeToIndex(slot.startTime);
    const endIdx = timeToIndex(slot.endTime);
    for (let i = startIdx; i < endIdx; i++) {
      grid[i] = slot.subject;
    }
  });
  return grid;
};

export const gridStateToSlots = (grid: (Subject | null)[], menteeId: string, date: string) => {
  const slots: StudyTimeSlot[] = [];
  let currentSubject: Subject | null = null;
  let startIdx: number | null = null;

  grid.forEach((subject, idx) => {
    if (subject !== currentSubject) {
      if (currentSubject !== null && startIdx !== null) {
        slots.push({
          startTime: indexToTime(startIdx),
          endTime: indexToTime(idx), 
          subject: currentSubject,
        });
      }
      currentSubject = subject;
      startIdx = subject !== null ? idx : null;
    }
  });

  if (currentSubject !== null && startIdx !== null) {
    slots.push({
      startTime: indexToTime(startIdx),
      endTime: indexToTime(144), 
      subject: currentSubject,
    });
  }

  return slots;
};

export const calculateTotalMinutes = (slots: StudyTimeSlot[]): number => {
  return slots.reduce((total, slot) => {
    const start = timeToIndex(slot.startTime);
    const end = timeToIndex(slot.endTime);
    return total + (end - start) * MINUTES_PER_SLOT;
  }, 0);
};

export const formatMinutes = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
};