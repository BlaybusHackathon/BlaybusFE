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
  
  // 1. 저장된 총 시간
  const savedSeconds = currentDailyPlanner?.totalStudyTime || 0;
  
  // 2. 실시간 표시용 상태
  const [displayTotal, setDisplayTotal] = useState(savedSeconds);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // 타이머가 돌고 있으면 실시간 합산
    if (activeTaskId && timerStartedAt) {
      const update = () => {
        const currentSession = Math.floor((Date.now() - timerStartedAt) / 1000);
        setDisplayTotal(savedSeconds + currentSession);
      };
      update();
      intervalId = setInterval(update, 1000);
    } else {
      // 멈춰있으면 저장된 시간만 표시
      setDisplayTotal(savedSeconds);
    }

    return () => clearInterval(intervalId);
  }, [activeTaskId, timerStartedAt, savedSeconds]);

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
      <Flex align="center" justify="space-between" mb={4}>
        <Flex align="center" gap={2}>
          <TimerIcon/>
          <Heading size="md">공부시간</Heading>
        </Flex>
        
        {/* 실시간으로 증가하는 총 시간 표시 */}
        <Text fontSize="lg" fontWeight="bold" color="blue.600">
          {formatDuration(displayTotal)}
        </Text>
      </Flex>
      
      <StudyTimeGrid />
    </Box>
  );
};
