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
            minH={{ base: '120px', md: '274px' }}
            h="auto"
            borderRight={{base:'none', md:(isLastColumn ? 'none' : "1px solid gray.100")}}
            borderBottom={{base: 'none', md: "1px solid gray.100"}}
            bg="transparent"
            px={{ base: 1, md: 2 }}
            py={{ base: 1, md: 2 }}
            position="relative"
        >
            <Text
                fontSize={{base:"12px", md:"20px"}}
                fontWeight={{base:"semibold" ,md:(isCurrentMonth ? 'medium' : 'normal')}}
                color={isCurrentMonth ? '#394250' : '#A0A5B1'}
                mb={{base:1, md:4}}
                textAlign={{base:"center", md:"right"}}
            >
                {day}
            </Text>

            <VStack align="stretch" spacing={{base:0.4, md:1}} overflow="hidden">
                {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} onClick={onTaskClick} />
                ))}
            </VStack>
        </Box>
    );
};