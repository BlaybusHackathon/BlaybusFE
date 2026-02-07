import { useState, useEffect } from 'react';
import { Box, Text, Textarea, Flex } from '@chakra-ui/react';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { getAdjustedDate } from '@/shared/lib/date';

export const DailyMemoWidget = () => {
  const { selectedDate, currentDailyPlanner, updateDailyMemo } = usePlannerStore();
  const [memoInput, setMemoInput] = useState('');

  const isToday = selectedDate === getAdjustedDate();
  
  useEffect(() => {
    setMemoInput(currentDailyPlanner?.dailyMemo || '');
  }, [currentDailyPlanner]);

  const handleBlur = () => {
    if (memoInput !== currentDailyPlanner?.dailyMemo) {
      updateDailyMemo(memoInput);
    }
  };

  return (
    <Box 
      px={4} 
      py={3} 
    >
      <Flex align="center" mb={2} gap={2}>
        <Text 
          fontSize="lg" 
          fontWeight="bold" 
        >
          코멘트를 작성해 주세요!
        </Text>
      </Flex>

      {isToday ? (
        <Textarea 
          value={memoInput}
          onChange={(e) => setMemoInput(e.target.value)}
          onBlur={handleBlur}
          placeholder="오늘의 목표나 다짐을 적어보세요!"
          borderRadius={10}
          boxShadow="sm"
          p={6}
          bg="white"
          size="sm"
          resize="none"
          rows={2}
          fontSize="sm"
          border={'none'}
          _active={{ dropShadow: 'dark-lg' }}
        />
      ) : (
        <Box 
          p={2} 
          bg="white" 
          minH="40px"
        >
          <Text fontSize="sm" color={memoInput ? "gray.700" : "gray.400"}>
            {memoInput || "작성된 메모가 없습니다."}
          </Text>
        </Box>
      )}
    </Box>
  );
};