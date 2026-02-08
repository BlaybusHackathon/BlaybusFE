import { useState } from 'react';

export const useFeedbackFilter = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [week, setWeek] = useState<number | 'ALL'>('ALL');
  const [subject, setSubject] = useState<string>('ALL');

  return {
    filters: { year, month, week, subject },
    setters: { setYear, setMonth, setWeek, setSubject },
  };
};
