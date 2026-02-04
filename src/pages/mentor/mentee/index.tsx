import { Box, Text } from '@chakra-ui/react';
import { MenteeProfileSection } from './ui/MenteeProfileSection'; 
import { MentorPlannerSection } from '@/widgets/mentor-planner';
import { MOCK_MENTEE_PROFILE } from './model/mockData';

const MentorMenteeManagePage = () => {

  return (
    <Box maxW="1200px" mx="auto" py={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>담당 멘티</Text>
      
      <MenteeProfileSection profile={MOCK_MENTEE_PROFILE} />

      <Box mt={8}>
        <MentorPlannerSection />
      </Box>
    </Box>
  );
};

export default MentorMenteeManagePage;