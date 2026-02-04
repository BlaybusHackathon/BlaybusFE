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
          fontSize="sm" 
          fontWeight="bold" 
        >
          코멘트
        </Text>
      </Flex>

      {isToday ? (
        <Textarea 
          value={memoInput}
          onChange={(e) => setMemoInput(e.target.value)}
          onBlur={handleBlur}
          placeholder="오늘의 목표나 다짐을 적어보세요!"
          bg="white"
          size="sm"
          resize="none"
          rows={2}
          fontSize="sm"
        />
      ) : (
        <Box 
          p={2} 
          bg="white" 
          borderRadius="md" 
          border="1px solid" 
          borderColor="gray.200"
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