import { Box, Flex, Container } from '@chakra-ui/react';
import { TaskList } from '@/widgets/planner/TaskList';
import { StudyTimeChart } from '@/widgets/planner/StudyTimeChart';
import { DailyMemoWidget } from '@/widgets/planner/ui/DailyMemoWidget';
import { MentorFeedbackWidget } from '@/widgets/planner/ui/MentorFeedbackWidget';
import { CalendarWidget } from '@/widgets/planner/ui/CalendarWidget';

const MenteePlannerPage = () => {
  return (
    <Box w="100%" minH="100vh" p={{ base: 4, md: 8 }}>
      <Container maxW="1200px" p={0}>
        
        <Box bg="white" borderRadius="3xl" boxShadow="sm" mb={6} overflow="hidden">
          
          <Box p={{ base: 4, md: 6 }} borderBottom="1px solid" borderColor="gray.100">
            <CalendarWidget />
          </Box>

          <Flex direction={{ base: 'column', lg: 'row' }} p={{ base: 4, md: 6 }} gap={{ base: 8, lg: 12 }}>
            <Box flex={1} w="full" minW={0}>
               <TaskList />
            </Box>
            <Box w={{ base: '100%', lg: '320px' }} flexShrink={0}>
              <StudyTimeChart />
            </Box>
          </Flex>
          
          <Box p={{ base: 4, md: 6 }} borderTop="1px solid" borderColor="gray.100">
            <DailyMemoWidget />
          </Box>
        </Box>

        <Box mb={10}>
          <MentorFeedbackWidget />
        </Box>

      </Container>
    </Box>
  );
};

export default MenteePlannerPage;