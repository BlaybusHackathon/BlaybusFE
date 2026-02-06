import { Box, useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { MonthlyCalendar } from '@/widgets/calendar/MonthlyCalendar';

export const MentorMenteeCalendarPage = () => {
    const { menteeId } = useParams();
    const toast = useToast();

    const handleCreateSchedule = () => {
        toast({
            title: "일정 만들기",
            description: "일정 등록 페이지로 이동합니다 (준비중)",
            status: "info",
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <Box p={{ base: 4, md: 6 }} maxW="1200px" mx="auto">
            <MonthlyCalendar
                menteeName={menteeId}
                onCreateSchedule={handleCreateSchedule}
            />
        </Box>
    );
};