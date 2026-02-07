import { Box, VStack, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { FeedbackDateController } from './ui/FeedbackDateController';
import { SubjectFilter, SubjectType } from './ui/SubjectFilter';
import { FeedbackListItem } from './ui/FeedbackListItem';
import { useNavigate, useParams } from 'react-router-dom';

// TODO: Replace with actual API data
const MOCK_FEEDBACK_LIST = [
    { id: '1', menteeName: '최연준', title: '독서 1지문', date: '2026-02-03', subject: 'KOREAN' },
    { id: '2', menteeName: '최연준', title: '문학 인강', date: '2026-02-03', subject: 'KOREAN' },
    { id: '3', menteeName: '최연준', title: '문법 인강', date: '2026-02-03', subject: 'KOREAN' },
    { id: '4', menteeName: '최연준', title: '영어 단어 암기', date: '2026-02-04', subject: 'ENGLISH' },
    { id: '5', menteeName: '최연준', title: '수학 문제 풀이', date: '2026-02-04', subject: 'MATH' },
];

export const FeedbackListWidget = () => {
    const { menteeId } = useParams();
    const navigate = useNavigate();

    const [date, setDate] = useState({ year: 2026, month: 2, week: 1 });
    const [selectedSubject, setSelectedSubject] = useState<SubjectType>('KOREAN');

    const filteredList = MOCK_FEEDBACK_LIST.filter(
        (item) => selectedSubject === 'ALL' || item.subject === selectedSubject
    );

    const handleItemClick = (id: string) => {
        // Navigate to assignment detail page
        // Using current structure: /mentor/mentee/:menteeId/task/:taskId
        navigate(`/mentor/mentee/${menteeId}/task/${id}`);
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

            <Box bg="white" borderRadius="20px">
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
