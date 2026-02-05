import { useState, useEffect, useRef } from 'react';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { 
  parseDateFromState, 
  formatDateKey,
  getWeekDays,
  getMonthGridDays,
  getPrevWeek,
  getNextWeek,
  getPrevMonth,
  getNextMonth,
} from '@/shared/lib/date';
import { startOfWeek } from 'date-fns';

export type ViewMode = 'WEEK' | 'MONTH';

export const useCalendar = () => {
  const { selectedDate, setSelectedDate } = usePlannerStore();
  
  const [viewMode, setViewMode] = useState<ViewMode>('WEEK');
  const [viewDate, setViewDate] = useState<Date>(parseDateFromState(selectedDate));
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    setViewDate(parseDateFromState(selectedDate));
  }, [selectedDate]);

  const handlePrev = () => {
    setViewDate(prev => viewMode === 'WEEK' ? getPrevWeek(prev) : getPrevMonth(prev));
  };

  const handleNext = () => {
    setViewDate(prev => viewMode === 'WEEK' ? getNextWeek(prev) : getNextMonth(prev));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(formatDateKey(date));
    setViewDate(date);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'WEEK' ? 'MONTH' : 'WEEK');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchEndY - touchStartY.current;

    if (Math.abs(diffY) > 50) { 
      if (diffY > 0 && viewMode === 'WEEK') setViewMode('MONTH');
      else if (diffY < 0 && viewMode === 'MONTH') setViewMode('WEEK');
    }
    touchStartY.current = null;
  };

  const daysToRender = viewMode === 'WEEK' 
    ? getWeekDays(viewDate) 
    : getMonthGridDays(viewDate);

  const getWeekInfo = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const currentWeekStart = startOfWeek(date, { weekStartsOn: 0 });
    const firstWeekStart = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
    const weekNumber = Math.floor(
      (currentWeekStart.getTime() - firstWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
    ) + 1;
    return { year, month: month + 1, weekNumber };
  };

  const weekInfo = getWeekInfo(viewDate);

  return {
    viewMode,
    viewDate,
    selectedDate: parseDateFromState(selectedDate),
    daysToRender,
    weekInfo,
    handlePrev,
    handleNext,
    handleDateClick,
    toggleViewMode,
    handleTouchStart,
    handleTouchEnd
  };
};