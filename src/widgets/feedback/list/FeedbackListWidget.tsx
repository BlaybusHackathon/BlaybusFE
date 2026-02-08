import { Box, VStack, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FeedbackDateController } from './ui/FeedbackDateController';
import { SubjectFilter, SubjectType } from './ui/SubjectFilter';
import { FeedbackListItem } from './ui/FeedbackListItem';
import { useNavigate, useParams } from 'react-router-dom';
import { feedbackApi } from '@/features/task-feedback/api/feedbackApi';
import { menteeDashboardApi } from '@/features/mentee-dashboard/api/menteeDashboardApi';
import type { FeedbackWithTask } from '@/features/task-feedback/model/types';

export const FeedbackListWidget = () => {
    const { menteeId } = useParams();
    const navigate = useNavigate();

    const [date, setDate] = useState({ year: 2026, month: 2, week: 1 });
    const [selectedSubject, setSelectedSubject] = useState<SubjectType>('KOREAN');

    const [items, setItems] = useState<FeedbackWithTask[]>([]);
    const [menteeName, setMenteeName] = useState('');

    useEffect(() => {
        if (!menteeId) return;
        let active = true;
        menteeDashboardApi.getByMenteeId(menteeId)
            .then((profile) => {
                if (!active) return;
                setMenteeName(profile?.name ?? '');
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, [menteeId]);

    useEffect(() => {
        if (!menteeId) return;
        let active = true;
        const run = async () => {
            try {
                const data = await feedbackApi.getFeedbackHistory({
                    menteeId,
                    year: date.year,
                    month: date.month,
                    weekNumber: date.week,
                    subject: selectedSubject,
                });
                if (!active) return;
                setItems(data);
            } catch {
                if (!active) return;
                setItems([]);
            }
        };
        run();
        return () => {
            active = false;
        };
    }, [menteeId, date.year, date.month, date.week, selectedSubject]);

    const filteredList = (menteeId ? items : [])
        .filter((item) => selectedSubject === 'ALL' || item.subject === selectedSubject)
        .map((item) => ({
            id: item.taskId || item.id,
            menteeName: item.menteeName || menteeName || '',
            title: item.taskTitle || item.content || '',
            date: (item.taskDate || item.createdAt || '').split('T')[0],
            subject: item.subject || 'KOREAN',
        }));

const handleItemClick = (taskId: string) => {
        // Navigate to assignment detail page
        // Using current structure: /mentor/mentee/:menteeId/task/:taskId
        navigate(`/mentor/mentee/${menteeId}/task/${taskId}`);
    };

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <SubjectFilter
                    selectedSubject={selectedSubject}
                    onChange={setSelectedSubject}
                />
                <FeedbackDateController
                    year={date.year}
                    month={date.month}
                    week={date.week}
                    onChangeYear={(y) => setDate((prev) => ({ ...prev, year: y }))}
                    onChangeMonth={(m) => setDate((prev) => ({ ...prev, month: m }))}
                    onChangeWeek={(w) => setDate((prev) => ({ ...prev, week: w }))}
                />
            </Flex>

            <Box bg="white" borderRadius="22px">
                <VStack spacing={3} align="stretch">
                    {filteredList.length > 0 ? (
                        filteredList.map((item) => (
                            <FeedbackListItem
                                key={item.id}
                                menteeName={item.menteeName}
                                title={item.title}
                                date={item.date}
                                onClick={() => handleItemClick(item.id)}
                            />
                        ))
                    ) : (
                        <Box py={10} textAlign="center">
                            <Text color="gray.500">등록된 피드백이 없습니다.</Text>
                        </Box>
                    )}
                </VStack>
            </Box>
        </Box>
    );
};
