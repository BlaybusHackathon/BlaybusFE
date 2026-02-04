import { useState, useMemo } from 'react';
import { Box, Flex, Text, VStack, IconButton, HStack } from '@chakra-ui/react';
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachWeekOfInterval, addDays, addMonths, subMonths, isSameMonth
} from 'date-fns';
import { MOCK_WEEKLY_REPORTS } from '@/features/report/model/mockReportData';
import { WeeklyReportItem } from './WeeklyReportItem';

export const WeeklyReportList = () => {
  const navigate = useNavigate();
  const { menteeId } = useParams();
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const weeksInMonth = useMemo(() => {
    const monthStart = startOfMonth(currentMonthDate);
    const monthEnd = endOfMonth(currentMonthDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); 
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const weeks = eachWeekOfInterval({
      start: calendarStart,
      end: calendarEnd
    }, { weekStartsOn: 0 });

    return weeks.map((weekStart, index) => {
      const weekEnd = addDays(weekStart, 6);
      return {
        weekNumber: index + 1,
        startDate: format(weekStart, 'yyyy-MM-dd'),
        endDate: format(weekEnd, 'yyyy-MM-dd'),
        displayRange: `${format(weekStart, 'yyyy.MM.dd')} ~ ${format(weekEnd, 'dd')}`
      };
    }).filter(week => {
      const s = new Date(week.startDate);
      const e = new Date(week.endDate);
      return isSameMonth(s, currentMonthDate) || isSameMonth(e, currentMonthDate);
    });
  }, [currentMonthDate]);

  const getWeekStatus = (startDateStr: string, endDateStr: string) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    if (todayStr < startDateStr) return 'FUTURE';
    if (todayStr > endDateStr) return 'PAST';
    return 'CURRENT';
  };

  const handleClick = (startDate: string, endDate: string) => {
    const report = MOCK_WEEKLY_REPORTS.find(r => r.startDate === startDate);
    if (report) {
      navigate(`/mentor/mentee/${menteeId}/report/${report.id}`);
    } else {
      navigate(`/mentor/mentee/${menteeId}/report/new?startDate=${startDate}&endDate=${endDate}`);
    }
  };

  const displayMonth = Number(format(currentMonthDate, 'M'));

  return (
    <Box bg="white" p={{ base: 4, md: 8 }} borderRadius="3xl" boxShadow="sm">
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="xl" fontWeight="bold">주간 학습 리포트</Text>
        <HStack spacing={4}>
          <IconButton 
            icon={<ChevronLeftIcon />} 
            aria-label="Previous Month" 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentMonthDate(prev => subMonths(prev, 1))}
          />
          <Text fontSize="lg" fontWeight="bold" minW="100px" textAlign="center">
            {format(currentMonthDate, 'yyyy. MM')}
          </Text>
          <IconButton 
            icon={<ChevronRightIcon />} 
            aria-label="Next Month" 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentMonthDate(prev => addMonths(prev, 1))}
          />
        </HStack>
      </Flex>

      <VStack spacing={3} align="stretch">
        {weeksInMonth.map((week) => {
          const status = getWeekStatus(week.startDate, week.endDate);
          const hasReport = MOCK_WEEKLY_REPORTS.some(r => r.startDate === week.startDate);

          return (
            <WeeklyReportItem
              key={week.startDate}
              weekNumber={week.weekNumber}
              displayMonth={displayMonth}
              displayRange={week.displayRange}
              status={status}
              hasReport={hasReport}
              onClick={() => handleClick(week.startDate, week.endDate)}
            />
          );
        })}
      </VStack>
    </Box>
  );
};