import { Box, Flex, Container, Text, HStack } from '@chakra-ui/react';
import { TaskList } from '@/widgets/planner/TaskList';
import { StudyTimeChart } from '@/widgets/planner/StudyTimeChart';
import { DailyMemoWidget } from '@/widgets/planner/ui/DailyMemoWidget';
import { MentorFeedbackWidget } from '@/widgets/planner/ui/MentorFeedbackWidget';
import { CalendarWidget } from '@/widgets/planner/ui/CalendarWidget';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const MenteePlannerPage = () => {
  const { selectedDate } = usePlannerStore();
  
  // 날짜 포맷 (예: 2월 6일 금요일)
  const dateText = format(new Date(selectedDate), 'M월 d일 EEEE', { locale: ko });

  return (
    <Box w="100%" minH="100vh">
      <Container maxW="1200px" p={0}>
        
        <Box bg="white" borderRadius="3xl" boxShadow="sm" mb={6} overflow="hidden">
          
          <Box p={{ base: 4, md: 6 }} borderBottom="1px solid" borderColor="gray.100">
            <CalendarWidget />
          </Box>

          <Flex direction={{ base: 'column', md: 'row' }} p={{ base: 4, md: 6 }} gap={{ base: 8, lg: 12 }}>
            <Box flex={1} w="full" minW={0} p={2}>
              <HStack align="baseline" spacing={2} mb={4}>
                <Text fontSize="xl" fontWeight="semibold">오늘 할 일</Text>
                <Text fontSize="md" color="gray.500" fontWeight="medium">
                  {dateText}
                </Text>
              </HStack>
               <TaskList />
            </Box>
            <Box w={{ base: 'auto', md: '24vw' }} flexShrink={0}>
              <StudyTimeChart />
            </Box>
          </Flex>
          
          <Box p={{ base: 4, md: 6 }} borderTop="1px solid" borderColor="gray.100">
            <DailyMemoWidget />
          </Box>
        </Box>

        <Box p={{ base: 4, md: 6 }}>
          <MentorFeedbackWidget />
        </Box>

      </Container>
    </Box>
  );
};

export default MenteePlannerPage;