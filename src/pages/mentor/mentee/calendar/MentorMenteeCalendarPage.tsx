import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { MonthlyCalendar } from '@/widgets/calendar/MonthlyCalendar';
import { AddIcon } from '@chakra-ui/icons';

interface CreateButtonProps {
    isMobile?: boolean;
    onClick: () => void;
}

const CreateButton = ({ isMobile = false, onClick }: CreateButtonProps) => (
    <Button
        leftIcon={<AddIcon />}
        bg="#53A8FE"
        color={'white'}
        w={isMobile ? 'full' : 'auto'}
        px={isMobile ? 0 : 20}
        py={8}
        mt={isMobile ? 6 : 0} 
        onClick={onClick}
        _hover={{ bg: "#3b8fd9" }}
    >
        ?쇱젙 留뚮뱾湲?
    </Button>
);

export const MentorMenteeCalendarPage = () => {
    const { menteeId } = useParams();
    const navigate = useNavigate();

    const handleCreateSchedule = () => {
        navigate(`/mentor/mentee/${menteeId}/calendar/create`);
    };

    return (
        <Box p={6} w="100%" maxW={"1200px"} justifySelf={'center'}>
            <Flex 
                justify="space-between" 
                align="center"
                px={{base:0, md:6}}
            >
                <Box>
                    <Heading size="lg" mb={2}>{menteeId}님의 월간 계획표</Heading>
                </Box>
                
                <Box display={{ base: 'none', md: 'block' }}>
                    <CreateButton onClick={handleCreateSchedule} />
                </Box>
            </Flex>

            <MonthlyCalendar />
            
            <Box display={{ base: 'block', md: 'none' }}>
                <CreateButton isMobile={true} onClick={handleCreateSchedule} />
            </Box>
        </Box>
    );
};
