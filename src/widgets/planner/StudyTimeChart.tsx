import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import { StudyTimeGrid } from '@/features/study-time';
import { TimerIcon } from '@/shared/ui/icons';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { useTimerStore } from '@/shared/stores/timerStore';
import { formatDuration } from '@/shared/lib/date';
import { useEffect, useState } from 'react';

export const StudyTimeChart = () => {
  const { currentDailyPlanner } = usePlannerStore();
  const { activeTaskId, timerStartedAt } = useTimerStore();
  
  const savedSeconds = currentDailyPlanner?.totalStudyTime || 0;
  
  const [displayTotal, setDisplayTotal] = useState(savedSeconds);
  const displayValue = activeTaskId && timerStartedAt ? displayTotal : savedSeconds;

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (activeTaskId && timerStartedAt) {
      const update = () => {
        const currentSession = Math.floor((Date.now() - timerStartedAt) / 1000);
        setDisplayTotal(savedSeconds + currentSession);
      };
      intervalId = setInterval(update, 1000);
    }

    return () => clearInterval(intervalId);
  }, [activeTaskId, timerStartedAt, savedSeconds]);

  return (
    <Box p={4} borderRadius="lg" boxShadow="sm">
      <Flex mx={2} direction={{base:"column", md:"row"}} gap={{base:4, md:'none'}} align={{base:"flex-start",md:"center"}} justify="space-between" mb={4}>
        <Flex align="center" gap={2}>
          <Heading size="md" color={"#373E56"}>공부시간 기록</Heading>
        </Flex>
        <Flex align={'center'} gap={1}>
          <TimerIcon/>
          <Text fontSize="lg" fontWeight="bold" color="#373E56" letterSpacing="wider" >
            {formatDuration(displayValue)}
          </Text>
        </Flex>
      </Flex>
      
      <StudyTimeGrid />
    </Box>
  );
};
