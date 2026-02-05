import { Box, Flex, Heading } from '@chakra-ui/react';
import { MonthlyCalendar } from '@/widgets/calendar/MonthlyCalendar';
import { useNavigate } from 'react-router-dom';

const MenteeCalendarPage = () => {
    const navigate = useNavigate();

    const handleTaskClick = (taskId: string) => {
        navigate(`/mentee/task/${taskId}`);
    };

    return (
        <Box p={{ base: 4, md: 6 }}>
            <Flex 
                justify="space-between" 
                align="center" 
                mb={6}
            >
                <Box>
                    <Heading size={{ base: 'md', md: 'lg' }} mb={1}>
                        나의 월간 계획표
                    </Heading>
                </Box>
            </Flex>

            <MonthlyCalendar onTaskClickOverride={handleTaskClick} />
        </Box>
    );
};

export default MenteeCalendarPage;