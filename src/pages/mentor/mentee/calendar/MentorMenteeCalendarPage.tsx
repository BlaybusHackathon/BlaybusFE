import { Box, Button, Flex, Heading, useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { MonthlyCalendar } from '@/widgets/calendar/MonthlyCalendar';
import { AddIcon } from '@chakra-ui/icons';

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
        <Box p={{ base: 4, md: 6 }}>
            <Flex 
                justify="space-between" 
                align="center" 
                mb={6}
            >
                <Box>
                    <Heading size={{ base: 'md', md: 'lg' }} mb={1}>
                        {menteeId}님 월간 계획표
                    </Heading>
                </Box>

                <Button
                    display={{ base: 'none', md: 'inline-flex' }}
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    onClick={handleCreateSchedule}
                    size="md"
                >
                    일정 만들기
                </Button>
            </Flex>

            <MonthlyCalendar />

            <Button
                display={{ base: 'flex', md: 'none' }}
                leftIcon={<AddIcon />}
                colorScheme="blue"
                onClick={handleCreateSchedule}
                size="md"
                w="full"
                mt={4}
            >
                일정 만들기
            </Button>
        </Box>
    );
};