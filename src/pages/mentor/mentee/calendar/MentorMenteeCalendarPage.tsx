import { Box, Button, Flex, Heading, useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { MonthlyCalendar } from '@/widgets/calendar/MonthlyCalendar';
import { AddIcon } from '@chakra-ui/icons';

export const MentorMenteeCalendarPage = () => {
    const { menteeId } = useParams();
    const toast = useToast();

    const handleCreateSchedule = () => {
        // Nav logic will be added later or just toast for now
        toast({
            title: "일정 만들기",
            description: "일정 등록 페이지로 이동합니다 (준비중)",
            status: "info",
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <Box p={6}>
            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Heading size="lg" mb={2}>{menteeId}님 월간 계획표</Heading>
                </Box>
                <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    onClick={handleCreateSchedule}
                >
                    일정 만들기
                </Button>
            </Flex>

            <MonthlyCalendar />
        </Box>
    );
};
