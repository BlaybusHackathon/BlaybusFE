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
            minH={{ base: '80px', md: '120px' }}
            h="auto"
            borderRight="1px solid"
            borderBottom="1px solid"
            borderColor="gray.100"
            bg={isCurrentMonth ? 'white' : 'gray.50'}
            p={{ base: 1, md: 2 }}
            position="relative"
        >
            <Text
                fontSize={{ base: 'xs', md: 'sm' }}
                fontWeight={isCurrentMonth ? 'medium' : 'normal'}
                color={isCurrentMonth ? 'gray.700' : 'gray.400'}
                mb={1}
                textAlign="center"
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