import { Box, Text, VStack } from '@chakra-ui/react';
import { CalendarTask, TaskItem } from './TaskItem';

interface CalendarDayProps {
    day: number;
    date: Date;
    tasks: CalendarTask[];
    isCurrentMonth: boolean;
    onTaskClick: (taskId: string) => void;
    isLastColumn?: boolean;
}

export const CalendarDay = ({ day, tasks, isCurrentMonth, onTaskClick, isLastColumn }: CalendarDayProps) => {
    return (
        <Box
            minH={{ base: '120px', md: '160px' }}
            h="auto"
            borderRight={isLastColumn ? 'none' : "1px solid"}
            borderBottom="1px solid"
            borderColor="gray.100"
            bg="transparent"
            px={{ base: 3, md: 4 }}
            py={{ base: 4, md: 6 }}
            position="relative"
        >
            <Text
                fontSize="20px"
                fontWeight={isCurrentMonth ? 'medium' : 'normal'}
                color={isCurrentMonth ? '#394250' : '#A0A5B1'}
                mb={4}
                textAlign="right"
                mr={1}
            >
                {day}
            </Text>

            <VStack align="stretch" spacing={1} overflow="hidden">
                {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} onClick={onTaskClick} />
                ))}
            </VStack>
        </Box>
    );
};