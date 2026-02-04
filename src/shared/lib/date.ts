import { format, subDays, isBefore, isAfter, startOfDay } from 'date-fns';
import { DAY_START_HOUR } from '@/shared/constants/studyTime';

export const getAdjustedDate = (): string => {
  const now = new Date();
  if (now.getHours() < DAY_START_HOUR) {
    return format(subDays(now, 1), 'yyyy-MM-dd');
  }
  return format(now, 'yyyy-MM-dd');
};

export const getCurrentTimeISO = (): string => {
  return new Date().toISOString();
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hours, minutes, secs]
    .map((v) => String(v).padStart(2, '0'))
    .join(':');
};

export const isToday = (dateString: string): boolean => {
  return dateString === getAdjustedDate();
};

export const isPastDate = (dateString: string): boolean => {
  const today = startOfDay(new Date(getAdjustedDate()));
  const target = startOfDay(new Date(dateString));
  return isBefore(target, today);
};

export const isFutureDate = (dateString: string): boolean => {
  const today = startOfDay(new Date(getAdjustedDate()));
  const target = startOfDay(new Date(dateString));
  return isAfter(target, today);
};

export const canAddTask = (dateString: string): boolean => {
  return !isPastDate(dateString);
};

export const canUseTimer = (dateString: string): boolean => {
  return isToday(dateString);
};