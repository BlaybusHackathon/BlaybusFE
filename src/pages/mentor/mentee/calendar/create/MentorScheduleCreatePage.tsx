import { Box } from '@chakra-ui/react';
import { ScheduleCreateForm } from '@/widgets/calendar/create/ui/ScheduleCreateForm';

const MentorScheduleCreatePage = () => {
    return (
        <Box w="full" h="full" maxW="1200px" mx="auto" p={{ base: 4, md: 6 }}>
            <ScheduleCreateForm />
        </Box>
    );
};

export default MentorScheduleCreatePage;
