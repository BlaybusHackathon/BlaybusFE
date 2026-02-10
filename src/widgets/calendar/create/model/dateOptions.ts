import {
  addDays,
  addWeeks,
  format,
  getWeekOfMonth,
  getWeeksInMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export const WEEK_STARTS_ON = 0 as const;

export const DAY_OPTIONS = [
  { value: 'SUNDAY', label: '일' },
  { value: 'MONDAY', label: '월' },
  { value: 'TUESDAY', label: '화' },
  { value: 'WEDNESDAY', label: '수' },
  { value: 'THURSDAY', label: '목' },
  { value: 'FRIDAY', label: '금' },
  { value: 'SATURDAY', label: '토' },
];

export const getWeekOptions = (date: Date = new Date()) => {
  const weeksCount = getWeeksInMonth(date, { weekStartsOn: WEEK_STARTS_ON });
  return Array.from({ length: weeksCount }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}주차`,
  }));
};

export const getDefaultWeek = (date: Date = new Date()) => {
  const weekNumber = getWeekOfMonth(date, { weekStartsOn: WEEK_STARTS_ON });
  const weeksCount = getWeeksInMonth(date, { weekStartsOn: WEEK_STARTS_ON });
  if (weekNumber < 1) return 1;
  if (weekNumber > weeksCount) return weeksCount;
  return weekNumber;
};

export const getWeekDateRange = (year: number, month: number, weekNumber: number) => {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const weeksCount = getWeeksInMonth(monthStart, { weekStartsOn: WEEK_STARTS_ON });
  const safeWeek = Math.min(Math.max(weekNumber, 1), weeksCount);
  const firstWeekStart = startOfWeek(monthStart, { weekStartsOn: WEEK_STARTS_ON });
  const targetWeekStart = addWeeks(firstWeekStart, safeWeek - 1);
  return {
    weekNumber: safeWeek,
    startDate: format(targetWeekStart, 'yyyy-MM-dd'),
    endDate: format(addDays(targetWeekStart, 6), 'yyyy-MM-dd'),
  };
};
