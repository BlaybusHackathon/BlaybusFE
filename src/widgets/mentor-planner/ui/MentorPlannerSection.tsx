import { useState, useMemo } from 'react';
import { Box, Flex, Text, Divider } from '@chakra-ui/react';
import { format } from 'date-fns';
import { Subject } from '@/shared/constants/subjects';
import { logsToGridState, StudyTimeGridView } from '@/features/study-time';
import { 
  MOCK_TASKS, 
  MOCK_TASK_LOGS, 
  MOCK_DAILY_PLANNERS 
} from '@/features/planner/model/mockPlannerData';

import { DateController } from './DateController';
import { MentorTaskList } from './MentorTaskList';
import { MenteeCommentCard } from './MenteeCommentCard';
import { MentorFeedbackCard } from './MentorFeedbackCard';

export const MentorPlannerSection = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [highlightSubject, setHighlightSubject] = useState<Subject | null>(null);

    const [dailyPlanners, setDailyPlanners] = useState(MOCK_DAILY_PLANNERS);

    const dateKey = format(currentDate, 'yyyy-MM-dd');

    const currentPlanner = useMemo(() => {
        return dailyPlanners.find(p => p.planDate === dateKey);
    }, [dailyPlanners, dateKey]);

    const dailyTasks = useMemo(() => {
        return MOCK_TASKS.filter((task) => task.taskDate === dateKey);
    }, [dateKey]);

    const dailyLogs = useMemo(() => {
        return MOCK_TASK_LOGS.filter((log) => log.startAt.startsWith(dateKey));
    }, [dateKey]);

    const gridState = useMemo(() => {
        return logsToGridState(dailyLogs, dailyTasks);
    }, [dailyLogs, dailyTasks]);

    const handleSaveFeedback = (newFeedback: string) => {
        setDailyPlanners(prev => {
            const exists = prev.some(p => p.planDate === dateKey);
            if (exists) {
                return prev.map(planner => {
                    if (planner.planDate === dateKey) {
                        return { ...planner, mentorFeedback: newFeedback };
                    }
                    return planner;
                });
            } else {
                return prev; 
            }
        });
    };

    return (
        <Box>
            <Box 
                bg="white" 
                borderRadius="3xl" 
                boxShadow="sm"
                mb={8} 
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
                    mb={8} 
                >
                    <Box 
                        flex={1} 
                        w="full" 
                        minW={0} 
                        h={{ base: 'auto', md: '680px' }} 
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
                        w={{ base: '100%', md: '24vw' }}
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

                <Divider mb={6} borderColor="gray.100" />

                <Box>
                    <MenteeCommentCard 
                        memo={currentPlanner?.dailyMemo ?? null} 
                    />
                </Box>
            </Box>

            <Box>
                <MentorFeedbackCard 
                    feedback={currentPlanner?.mentorFeedback ?? null} 
                    onSave={handleSaveFeedback}
                />
            </Box>
        </Box>
    );
};