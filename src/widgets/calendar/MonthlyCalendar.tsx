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
    menteeName?: string;
    onCreateSchedule?: () => void;
}

export const MonthlyCalendar = ({
    onTaskClickOverride,
    menteeName = "최연준",
    onCreateSchedule
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

    const getTasksForDay = () => {
        const allTasks = generateMockTasks(currentDate);
        if (showCompletedOnly) {
            return allTasks.filter(task => task.isCompleted);
        }
        return allTasks;
    };

    return (
        <Box>
            <CalendarHeader
                currentDate={currentDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                showCompletedOnly={showCompletedOnly}
                onToggleCompleted={setShowCompletedOnly}
                menteeName={menteeName}
                onCreateSchedule={onCreateSchedule}
            />

            <Box bg="white">
                <SimpleGrid columns={7} bg="white">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                        <Box
                            key={day}
                            py={4}
                            textAlign="center"
                            bg="white"
                        >
                            <Text
                                fontSize="20px"
                                fontWeight="bold"
                                color="#999999"
                            >
                                {day}
                            </Text>
                        </Box>
                    ))}
                </SimpleGrid>

                <Box
                    border="1px solid"
                    borderColor="gray.200"
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
                                    bg={isFirstColumn || isLastColumn ? '#F7F9F9' : 'white'}
                                >
                                    <CalendarDay
                                        day={date.getDate()}
                                        date={date}
                                        isCurrentMonth={isSameMonth(date, monthStart)}
                                        tasks={getTasksForDay()}
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
    );
};