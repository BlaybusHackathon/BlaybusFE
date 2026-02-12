import { useState, useMemo, useEffect } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { Subject } from '@/shared/constants/subjects';
import { logsToGridState, StudyTimeGridView } from '@/features/study-time';
import { planApi } from '@/features/planner/api/planApi';
import { taskApi } from '@/features/task/api/taskApi';
import type { Task } from '@/entities/task/types';
import type { TaskLog } from '@/entities/task-log/types';
import type { DailyPlanner } from '@/entities/daily-plan/types';

import { DateController } from './DateController';
import { MentorTaskList } from './MentorTaskList';
import { MenteeCommentCard } from './MenteeCommentCard';
import { MentorFeedbackCard } from './MentorFeedbackCard';

interface Props {
    menteeName: string;
}

export const MentorPlannerSection = ({ menteeName }: Props) => {
    const { menteeId } = useParams();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [highlightSubject, setHighlightSubject] = useState<Subject | null>(null);

    const [planner, setPlanner] = useState<DailyPlanner | null>(null);
    const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
    const [dailyLogs, setDailyLogs] = useState<TaskLog[]>([]);

    const dateKey = format(currentDate, 'yyyy-MM-dd');

    useEffect(() => {
        let active = true;
        const load = async () => {
            if (!menteeId) return;
            const [year, month, day] = dateKey.split('-').map(Number);
            try {
                const result = await planApi.getDailyPlan({ year, month, day, menteeId });
                if (!active) return;
                setPlanner(result.planner);
                setDailyTasks(result.tasks);
                let taskLogs = result.taskLogs;
                if (taskLogs.length === 0 && result.tasks.length > 0) {
                    const results = await Promise.allSettled(
                        result.tasks.map((task) => taskApi.getTaskLogs(task.id))
                    );
                    taskLogs = results.flatMap((res) => (res.status === 'fulfilled' ? res.value : []));
                }
                setDailyLogs(taskLogs);
            } catch (error) {
                console.error('Failed to load mentor daily plan', error);
            }
        };

        load();
        return () => {
            active = false;
        };
    }, [menteeId, dateKey]);

    const gridState = useMemo(() => {
        return logsToGridState(dailyLogs, dailyTasks);
    }, [dailyLogs, dailyTasks]);

    const handleSaveFeedback = async (newFeedback: string) => {
        if (!planner?.id) return;

        try {
            const trimmed = newFeedback.trim();
            const hasFeedback = planner.mentorFeedback !== null;

            if (trimmed.length === 0) {
                if (hasFeedback) {
                    await planApi.deleteFeedback(planner.id);
                }
                setPlanner((prev) => (prev ? { ...prev, mentorFeedback: null } : prev));
                return;
            }

            if (hasFeedback) {
                await planApi.updateFeedback(planner.id, newFeedback);
            } else {
                await planApi.createFeedback(planner.id, newFeedback);
            }
            setPlanner((prev) => (prev ? { ...prev, mentorFeedback: newFeedback } : prev));
        } catch (error) {
            console.error('Failed to save mentor feedback', error);
        }
    };

    return (
        <Box>
            <Box>
                <Text fontSize="20px" fontWeight="bold" mb={6}>{menteeName}님 플래너</Text>

                <DateController
                    currentDate={currentDate}
                    onChangeDate={setCurrentDate}
                />

                <Flex
                    gap="26px"
                    align="flex-start"
                    direction={{ base: 'column', md: 'row' }}
                    mb={10}
                    bg="#F9F9FB"
                    p={{base:"0 0",md:"32px 34px"}}
                    borderRadius="22px"
                >
                    <Box
                        flex={1}
                        w="full"
                        minW={0}
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
                        maxW={{base:"none",md:"450px"}}
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

                <Box mb={8}>
                    <MenteeCommentCard
                        memo={planner?.dailyMemo ?? null}
                    />
                </Box>

                <Box mb={8}>
                    <MentorFeedbackCard
                        feedback={planner?.mentorFeedback ?? null}
                        onSave={handleSaveFeedback}
                    />
                </Box>
            </Box>
        </Box>
    );
};
