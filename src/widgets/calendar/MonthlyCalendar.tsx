import { Box, SimpleGrid, Text } from '@chakra-ui/react';
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
import { CalendarHeader } from './ui/CalendarHeader';
import { CalendarDay } from './ui/CalendarDay';
import { generateMockTasks } from './model/mockData';
import { useNavigate, useParams } from 'react-router-dom';

interface MonthlyCalendarProps {
    onTaskClickOverride?: (taskId: string) => void;
}

export const MonthlyCalendar = ({ onTaskClickOverride }: MonthlyCalendarProps) => {
    const { menteeId } = useParams();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);
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

    const getTasksForDay = () => {
        const allTasks = generateMockTasks(currentDate); 
        return allTasks.filter(() => {
            return Math.random() > 0.95; 
        });
    };

    return (
        <Box>
            <CalendarHeader
                currentDate={currentDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                showIncompleteOnly={showIncompleteOnly}
                onToggleIncomplete={setShowIncompleteOnly}
            />

            <Box border="1px solid" borderColor="gray.200" borderRadius="xl" overflow="hidden" bg="white">
                <SimpleGrid columns={7} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                        <Box 
                            key={day} 
                            py={2} 
                            textAlign="center" 
                            borderRight={index !== 6 ? "1px solid" : "none"} 
                            borderColor="gray.100"
                        >
                            <Text
                                fontSize={{ base: 'xs', md: 'sm' }}
                                fontWeight="bold"
                                color={index === 0 ? 'red.500' : index === 6 ? 'blue.500' : 'gray.600'}
                            >
                                {day}
                            </Text>
                        </Box>
                    ))}
                </SimpleGrid>

                <SimpleGrid columns={7} spacing={0}>
                    {calendarDays.map((date) => (
                        <CalendarDay
                            key={date.toISOString()}
                            day={date.getDate()}
                            date={date}
                            isCurrentMonth={isSameMonth(date, monthStart)}
                            tasks={getTasksForDay()}
                            onTaskClick={handleTaskClick}
                        />
                    ))}
                </SimpleGrid>
            </Box>
        </Box>
    );
};