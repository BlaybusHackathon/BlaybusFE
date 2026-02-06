import { Box } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { MonthlyCalendar } from '@/widgets/calendar/MonthlyCalendar';

export const MentorMenteeCalendarPage = () => {
    const { menteeId } = useParams();
    const navigate = useNavigate();

    const handleCreateSchedule = () => {
        navigate(`/mentor/mentee/${menteeId}/calendar/create`);
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