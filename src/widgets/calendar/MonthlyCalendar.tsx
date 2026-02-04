import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { CalendarHeader } from './ui/CalendarHeader';
import { CalendarDay } from './ui/CalendarDay';

export const MonthlyCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);

    // Placeholder handlers (Logic will be added in Step 2)
    const handlePrevMonth = () => console.log('Prev Month');
    const handleNextMonth = () => console.log('Next Month');
    const handleTaskClick = (taskId: string) => console.log('Task clicked:', taskId);

    // Dummy grid for Step 1 UI verification
    const days = Array.from({ length: 35 }, (_, i) => i + 1);

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

                {/* Days Grid - Placeholder for UI Check */}
                <SimpleGrid columns={7}>
                    {days.map((day) => (
                        <CalendarDay
                            key={day}
                            day={day}
                            date={new Date()}
                            isCurrentMonth={true}
                            tasks={[]}
                            onTaskClick={handleTaskClick}
                        />
                    ))}
                </SimpleGrid>
            </Box>
        </Box>
    );
};
