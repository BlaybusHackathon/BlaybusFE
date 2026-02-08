import { Box, SimpleGrid, Text, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  format,
} from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';

// 컴포넌트 import
import { CalendarHeader } from './ui/CalendarHeader';
import { CalendarDay } from './ui/CalendarDay';
import { CalendarLegend } from './ui/CalendarLegend';
import { planApi } from '@/features/planner/api/planApi';
import type { CalendarTaskData } from '@/features/planner/api/planApi';

interface MonthlyCalendarProps {
  onTaskClickOverride?: (taskId: string) => void;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

export const MonthlyCalendar = ({
  onTaskClickOverride,
  selectedDate, 
  onDateChange, 
}: MonthlyCalendarProps) => {
  const { menteeId } = useParams();
  
  const [internalDate, setInternalDate] = useState(new Date());
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [calendarTasks, setCalendarTasks] = useState<CalendarTaskData[]>([]);
  const navigate = useNavigate();

  const currentDate = selectedDate ?? internalDate;

  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    if (onDateChange) {
      onDateChange(newDate); 
    } else {
      setInternalDate(newDate); 
    }
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    if (onDateChange) {
      onDateChange(newDate);
    } else {
      setInternalDate(newDate);
    }
  };

  const handleTaskClick = (taskId: string) => {
    if (onTaskClickOverride) {
      onTaskClickOverride(taskId);
      return;
    }
    if (menteeId) {
      navigate(`/mentor/mentee/${menteeId}/task/${taskId}`);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  useEffect(() => {
    let active = true;
    const loadCalendar = async () => {
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const list = await planApi.getCalendar({ menteeId, year, month });
        if (!active) return;
        setCalendarTasks(list);
      } catch (error) {
        console.error('Failed to load calendar tasks', error);
        if (!active) return;
        setCalendarTasks([]);
      }
    };
    loadCalendar();
    return () => {
      active = false;
    };
  }, [menteeId, currentDate]);

  const getTasksForDay = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayTasks = calendarTasks.filter((task) => task.date === dateKey);
    if (showCompletedOnly) {
      return dayTasks.filter((task) => task.isCompleted);
    }
    return dayTasks;
  };

  return (
    <Box borderRadius="lg" px={{base:0, md:6}} py={{base:0, md:2}} boxShadow={{base:'none',md:"sm"}}>
      <Box bg={{base:"white", md:'none'}} borderRadius={'lg'} boxShadow={{base:'sm',md:"none"}}>
        <Flex 
          justify={{ base: 'center', md: 'space-between' }}
          align="center" 
          mb={{base:2, md:6}}
        >
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          <Box flex={1} display={{ base: 'none', md: 'block' }}>
            <CalendarLegend 
              showCompletedOnly={showCompletedOnly}
              onToggleCompleted={setShowCompletedOnly}
            />
          </Box>
        </Flex>

        <Box 
          mb={{base:'none', md:4}}
          mx={2}
          >
          <SimpleGrid columns={7} mb={1}>
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <Box
                      key={day}
                      py={{base:1, md:4}}
                      textAlign="center"
                  >
                      <Text
                          fontSize={{base:"12px", md:"20px"}}
                          fontWeight="bold"
                          color="#999999"
                      >
                          {day}
                      </Text>
                  </Box>
              ))}
          </SimpleGrid>

          <Box
              border={{base:'none', md:"1px solid #E2E4E5"}}
              borderRadius="20px"
              overflow="hidden"
              bg="white"
          >
              <SimpleGrid columns={7} spacing={0}>
                  {calendarDays.map((date, index) => {
                      const isLastColumn = (index + 1) % 7 === 0;
                      const isFirstColumn = index % 7 === 0;
                      return (
                          <Box
                              key={date.toISOString()}
                              bg={{
                                  base: 'none',
                                  md: isFirstColumn || isLastColumn ? '#F7F9F9' : 'none'
                                  }}
                          >
                              <CalendarDay
                                  day={date.getDate()}
                                  date={date}
                                  isCurrentMonth={isSameMonth(date, monthStart)}
                                  tasks={getTasksForDay(date)}
                                  onTaskClick={handleTaskClick}
                                  isLastColumn={isLastColumn}
                              />
                          </Box>
                      );
                  })}
              </SimpleGrid>
          </Box>
        </Box>
      </Box>

      <Box display={{ base: 'block', md: 'none' }} px={4}>
        <CalendarLegend 
          showCompletedOnly={showCompletedOnly}
          onToggleCompleted={setShowCompletedOnly}
        />
      </Box>
    </Box>
  );
};
