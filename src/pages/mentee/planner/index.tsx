import { Box, Flex, Container, Text, HStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { TaskList } from '@/widgets/planner/TaskList';
import { StudyTimeChart } from '@/widgets/planner/StudyTimeChart';
import { DailyMemoWidget } from '@/widgets/planner/ui/DailyMemoWidget';
import { MentorFeedbackWidget } from '@/widgets/planner/ui/MentorFeedbackWidget';
import { CalendarWidget } from '@/widgets/planner/ui/CalendarWidget';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const MenteePlannerPage = () => {
  const { selectedDate, loadDailyPlan } = usePlannerStore();
  
  const dateText = format(new Date(selectedDate), 'M월 d일 EEEE', { locale: ko });

  useEffect(() => {
    loadDailyPlan(selectedDate);
  }, [selectedDate, loadDailyPlan]);

  return (
    <Box w="100%" minH="100vh">
      <Container maxW="1200px" p={0} pb={90}>
        
        <Flex direction={"column"} mt={-2} mb={6} overflow="hidden">
          
          <Box p={{ base: 0, md: 6 }}>
            <CalendarWidget />
          </Box>

          <Flex bg={{base:"none", md:"#F9F9FB"}} borderRadius={22} direction={{ base: 'column', md: 'row' }} justify="center" pt={{base:6, md:'none'}} p={{ base: 'none', md: 6 }} gap={{ base: 8, md: 0 }}>
            <Box flex={1} w="full" minW={0} p={4}>
              <HStack align="baseline" spacing={2} mb={4}>
                <Text fontSize="xl" fontWeight="semibold" p={1}>오늘 할 일</Text>
                <Text fontSize="sm" color="#989898" fontWeight="medium">
                  {dateText}
                </Text>
              </HStack>
               <TaskList />
            </Box>
            <Box w={{ base: 'auto', md: '24vw' }} maxW={{base:"none", md:"450px"}} flexShrink={0}>
              <StudyTimeChart />
            </Box>
          </Flex>
          
          <Box p={{ base: 1, md: 0 }} pt={{base:10, md:12}}>
            <DailyMemoWidget />
          </Box>
        </Flex>

        <Box p={{ base: 1, md: 0 }} pt={{base:0, md:4}} pb={20}>
          <MentorFeedbackWidget />
        </Box>

      </Container>
    </Box>
  );
};

export default MenteePlannerPage;
