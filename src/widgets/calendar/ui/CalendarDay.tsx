import { Box, Text, VStack } from '@chakra-ui/react';
import { CalendarTask, TaskItem } from './TaskItem';

interface CalendarDayProps {
    day: number;
    date: Date;
    tasks: CalendarTask[];
    isCurrentMonth: boolean;
    onTaskClick: (taskId: string) => void;
}

export const CalendarDay = ({ day, tasks, isCurrentMonth, onTaskClick }: CalendarDayProps) => {
    return (
        <Box
            h="120px"
            borderRight="1px solid"
            borderBottom="1px solid"
            borderColor="gray.100"
            bg={isCurrentMonth ? 'white' : 'gray.50'}
            p={2}
            overflow="hidden"
        >
            <Text
                fontSize="sm"
                fontWeight={isCurrentMonth ? 'medium' : 'normal'}
                color={isCurrentMonth ? 'gray.700' : 'gray.400'}
                mb={2}
                textAlign="right"
            >
                {day}
            </Text>
            <VStack align="stretch" spacing={1}>
                {tasks.slice(0, 3).map((task) => (
                    <TaskItem key={task.id} task={task} onClick={onTaskClick} />
                ))}
                {tasks.length > 3 && (
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                        +{tasks.length - 3} more
                    </Text>
                )}
            </VStack>
        </Box>
    );
};
