import { Box, SimpleGrid, Text, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
} from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';

// 컴포넌트 import
import { CalendarHeader } from './ui/CalendarHeader';
import { CalendarDay } from './ui/CalendarDay';
import { CalendarLegend } from './ui/CalendarLegend';
import { generateMockTasks } from './model/mockData';

interface MonthlyCalendarProps {
  onTaskClickOverride?: (taskId: string) => void;
}

export const MonthlyCalendar = ({
  onTaskClickOverride,
}: MonthlyCalendarProps) => {
  const { menteeId } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const navigate = useNavigate();

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

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

  const getTasksForDay = (date: Date) => {
    const allTasks = generateMockTasks(date);
    if (showCompletedOnly) {
      return allTasks.filter(task => task.isCompleted);
    }
    return allTasks;
  };

  return (
    <Box bg="white" borderRadius="lg" px={{base:0, md:6}} py={{base:0, md:2}} boxShadow="sm">
      <Flex 
        justify={{ base: 'center', md: 'space-between' }}
        align="center" 
        mb={6}
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
        bg="white"
        >
         <SimpleGrid columns={7} bg="white">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <Box
                    key={day}
                    py={{base:1, md:4}}
                    textAlign="center"
                    bg="white"
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
            border={{base:'none', md:"1px solid gray.200"}}
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

      <Box display={{ base: 'block', md: 'none' }} mt={6}>
        <CalendarLegend 
          showCompletedOnly={showCompletedOnly}
          onToggleCompleted={setShowCompletedOnly}
        />
      </Box>
    </Box>
  );
};