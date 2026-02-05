import { useState, useMemo } from 'react';
import { getYear, getMonth, getWeekOfMonth, parseISO } from 'date-fns';
import { MOCK_FEEDBACKS_With_Task } from '@/features/task-feedback/model/mockFeedbackData';

export const useFeedbackFilter = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [week, setWeek] = useState<number | 'ALL'>('ALL');
  const [subject, setSubject] = useState<string>('ALL');

  const filteredData = useMemo(() => {
    return MOCK_FEEDBACKS_With_Task.filter(item => {
      const date = parseISO(item.createdAt);
      
      if (getYear(date) !== year) return false;
      if (getMonth(date) + 1 !== month) return false;
      
      if (week !== 'ALL') {
        const weekNum = getWeekOfMonth(date, { weekStartsOn: 0 });
        if (weekNum !== week) return false;
      }

      if (subject !== 'ALL' && item.subject !== subject) return false;

      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [year, month, week, subject]);

  return {
    filters: { year, month, week, subject },
    setters: { setYear, setMonth, setWeek, setSubject },
    data: filteredData
  };
};