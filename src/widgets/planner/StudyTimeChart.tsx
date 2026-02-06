import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import { StudyTimeGrid } from '@/features/study-time';
import { TimerIcon } from '@/shared/ui/icons';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { formatDuration } from '@/shared/lib/date'; 

export const StudyTimeChart = () => {
  const { currentDailyPlanner } = usePlannerStore();
  
  const totalSeconds = currentDailyPlanner?.totalStudyTime || 0;

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
      <Flex align="center" justify="space-between" mb={4}>
        <Flex align="center" gap={2}>
          <TimerIcon />
          <Heading size="md">공부시간</Heading>
        </Flex>
        
        <Text fontSize="lg" fontWeight="bold" color="blue.600">
          {formatDuration(totalSeconds)}
        </Text>
      </Flex>
      
      <StudyTimeGrid />
    </Box>
  );
};