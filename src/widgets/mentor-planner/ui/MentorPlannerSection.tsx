import { useState, useMemo } from 'react';
import { Box, Flex , Text} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Subject } from '@/shared/constants/subjects';
import { logsToGridState, StudyTimeGridView } from '@/features/study-time';
import { MOCK_TASKS, MOCK_TASK_LOGS } from '@/features/planner/model/mockPlannerData';

import { DateController } from './DateController';
import { MentorTaskList } from './MentorTaskList';

export const MentorPlannerSection = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [highlightSubject, setHighlightSubject] = useState<Subject | null>(null);

    const dateKey = format(currentDate, 'yyyy-MM-dd');

    const dailyTasks = useMemo(() => {
        return MOCK_TASKS.filter((task) => task.taskDate === dateKey);
    }, [dateKey]);

    const dailyLogs = useMemo(() => {
        return MOCK_TASK_LOGS.filter((log) => log.startAt.startsWith(dateKey));
    }, [dateKey]);

    const gridState = useMemo(() => {
        return logsToGridState(dailyLogs, dailyTasks);
    }, [dailyLogs, dailyTasks]);

    return (
        <Box 
        bg="white" 
        p={{ base: 4, md: 8 }} 
        borderRadius="3xl" 
        boxShadow="sm"
        >
        <Text fontSize="xl" fontWeight="bold" mb={6}>플래너</Text>
        
        <DateController 
            currentDate={currentDate} 
            onChangeDate={setCurrentDate} 
        />
        

        <Flex 
            gap={12} 
            align="flex-start" 
            direction={{ base: 'column', md: 'row' }} 
        >
            <Box 
            flex={1} 
            w="full" 
            minW={0} 
            h={{ base: 'auto', md: '680px' }} 
            maxH={{ base: '500px', md: '680px' }}
            >
            <MentorTaskList
                tasks={dailyTasks}
                logs={dailyLogs}
                onHoverSubject={setHighlightSubject}
            />
            </Box>

            <Box 
            flexShrink={0} 
            mx={{ base: 'auto', md: 0 }}
            w={{ base: '100%', md: 'auto' }}
            overflowX={{ base: 'auto', md: 'visible' }}
            display="flex"
            justifyContent="center"
            >
            <StudyTimeGridView
                gridState={gridState}
                highlightSubject={highlightSubject}
            />
            </Box>
        </Flex>
        </Box>
    );
};