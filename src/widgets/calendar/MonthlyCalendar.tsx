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

export const MonthlyCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);

    // Month Navigation
    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const handleTaskClick = (taskId: string) => {
        console.log('Task clicked:', taskId);
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
            // Note: In real app, consider timezone issues. Here assuming string match/local date match is fine for mock.
            return isSameDay(new Date(task.date), date);
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
                        <Box key={day} py={2} textAlign="center">
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
                <SimpleGrid columns={7}>
                    {calendarDays.map((date) => (
                        <CalendarDay
                            key={date.toISOString()}
                            day={date.getDate()}
                            date={date}
                            isCurrentMonth={isSameMonth(date, monthStart)}
                            tasks={getTasksForDay(date)} // Binding Tasks
                            onTaskClick={handleTaskClick}
                        />
                    ))}
                </SimpleGrid>
            </Box>
        </Box>
    );
};
