import { Box, Flex, Heading, Divider } from '@chakra-ui/react';
import { useState } from 'react';
import { MonthlyCalendar } from '@/widgets/calendar/MonthlyCalendar';
import { WeeklyReportList } from '@/widgets/mentor-report/ui/WeeklyReportList';
import { useNavigate } from 'react-router-dom';

const MenteeCalendarPage = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());

    const handleTaskClick = (taskId: string) => {
        navigate(`/mentee/task/${taskId}`);
    };

    const handleReportClick = ({ reportId }: { startDate: string; endDate: string; reportId?: string }) => {
        if (reportId) {
            navigate(`/mentee/report/${reportId}`);
        } else {
            console.log("No report found for this date");
        }
    };

    return (
        <Box w={'full'} maxW={'1200px'} justifySelf={'center'} p={{ base: 0, md: 6 }}>
            <Flex 
                display={{base:"none", md:"flex"}}
                justify="space-between" 
                align="center" 
                mb={6}
            >
                <Box>
                    <Heading ml={8} size={{ base: 'md', md: 'xl' }} mb={1}>
                        월간 계획
                    </Heading>
                </Box>
            </Flex>

            <MonthlyCalendar 
                onTaskClickOverride={handleTaskClick} 
                selectedDate={currentDate}
                onDateChange={setCurrentDate}
            />

            <Box 
                my={{base:6, md:10}}>
                <Divider 
                    borderWidth="2px"/>
            </Box>

            <WeeklyReportList 
                externalDate={currentDate}
                onItemClick={handleReportClick}
            />
        </Box>
    );
};

export default MenteeCalendarPage;
