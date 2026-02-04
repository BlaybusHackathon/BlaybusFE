import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
} from 'date-fns';
import { CalendarHeader } from './ui/CalendarHeader';
import { CalendarDay } from './ui/CalendarDay';
import { generateMockTasks } from './model/mockData';

import { useNavigate, useParams } from 'react-router-dom';

export const MonthlyCalendar = () => {
    const { menteeId } = useParams();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);
    const navigate = useNavigate();

    // Month Navigation
    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const handleTaskClick = (taskId: string) => {
        if (menteeId) {
            navigate(`/mentor/mentee/${menteeId}/task/${taskId}`);
        }
    };

    // Calendar Grid Logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    // Data Binding (Step 4)
    const allTasks = useMemo(() => generateMockTasks(currentDate), [currentDate]);

    const getTasksForDay = (date: Date) => {
        return allTasks.filter(task => {
            const isSameDate = isSameDay(new Date(task.date), date);
            if (!isSameDate) return false;
            // Filter Logic (Step 5)
            if (showIncompleteOnly && task.isCompleted) return false;
            return true;
        });
    };

    return (
        <Box bg="white" borderRadius="lg" p={6} boxShadow="sm">
            <CalendarHeader
                currentDate={currentDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                showIncompleteOnly={showIncompleteOnly}
                onToggleIncomplete={setShowIncompleteOnly}
            />

            <Box border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
                {/* Weekday Headers */}
                <SimpleGrid columns={7} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                        <Box key={day} py={2} textAlign="center" borderRight={index !== 6 ? "1px solid" : "none"} borderColor="gray.200">
                            <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color={index === 0 ? 'red.500' : index === 6 ? 'blue.500' : 'gray.600'}
                            >
                                {day}
                            </Text>
                        </Box>
                    ))}
                </SimpleGrid>

                {/* Days Grid */}
                <SimpleGrid columns={7} spacing={0}>
                    {calendarDays.map((date) => (
                        <CalendarDay
                            key={date.toISOString()}
                            day={date.getDate()}
                            date={date}
                            isCurrentMonth={isSameMonth(date, monthStart)}
                            tasks={getTasksForDay(date)}
                            onTaskClick={handleTaskClick}
                        />
                    ))}
                </SimpleGrid>
            </Box>
        </Box>
    );
};
