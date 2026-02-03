import { Subject } from "./subjects";

export const MINUTES_PER_SLOT = 10;
export const SLOTS_PER_HOUR = 6;
export const HOURS_PER_DAY = 24;
export const TOTAL_SLOTS = 144;

export const DAY_START_HOUR = 4;
export const DAY_END_HOUR = 28;

export const SUBJECT_COLORS: Record<Subject, { bg: string; border: string; text: string }> = {
  KOREAN: { bg: 'red.100', border: 'red.300', text: 'red.700' },
  ENGLISH: { bg: 'blue.100', border: 'blue.300', text: 'blue.700' },
  MATH: { bg: 'green.100', border: 'green.300', text: 'green.700' },
  OTHER: { bg: 'gray.100', border: 'gray.300', text: 'gray.700' },
} as const;