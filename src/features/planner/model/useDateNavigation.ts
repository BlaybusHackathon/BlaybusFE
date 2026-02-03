import { usePlannerStore } from '@/shared/stores/plannerStore';
import { addDays, format, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';

export const useDateNavigation = () => {
  const { selectedDate, setSelectedDate } = usePlannerStore();

  const currentDate = new Date(selectedDate);

  const prevDate = () => {
    setSelectedDate(format(subDays(currentDate, 1), 'yyyy-MM-dd'));
  };

  const nextDate = () => {
    setSelectedDate(format(addDays(currentDate, 1), 'yyyy-MM-dd'));
  };

  const formattedDate = format(currentDate, 'M월 d일 (EEE)', { locale: ko });

  return { selectedDate, formattedDate, prevDate, nextDate };
};