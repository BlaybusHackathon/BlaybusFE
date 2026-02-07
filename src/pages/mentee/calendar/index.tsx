import { Box, Flex, Heading, Divider } from '@chakra-ui/react';
import { useState } from 'react';
import { MonthlyCalendar } from '@/widgets/calendar/MonthlyCalendar';
import { WeeklyReportList } from '@/widgets/mentor-report/ui/WeeklyReportList';
import { useNavigate } from 'react-router-dom';
import { MOCK_WEEKLY_REPORTS } from '@/widgets/mentor-report/model/mockWeeklyReports'; // 데이터 import

const MenteeCalendarPage = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());

    const handleTaskClick = (taskId: string) => {
        navigate(`/mentee/task/${taskId}`);
    };

    const handleReportClick = (startDate: string) => {
        const report = MOCK_WEEKLY_REPORTS.find(r => r.startDate === startDate);
        
        if (report) {
            navigate(`/mentee/report/${report.id}`);
        } else {
            console.log("No report found for this date");
        }
    };

    return (
        <Box p={{ base: 0, md: 6 }}>
            <Flex 
                display={{base:"none", md:"display"}}
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