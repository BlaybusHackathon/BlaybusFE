import { useMemo } from 'react';
import { Box, Text, Textarea, Flex } from '@chakra-ui/react';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { getAdjustedDate } from '@/shared/lib/date';

export const DailyMemoWidget = () => {
  const { selectedDate, currentDailyPlanner, updateDailyMemo } = usePlannerStore();
  const memoValue = useMemo(() => currentDailyPlanner?.dailyMemo || '', [currentDailyPlanner]);

  const isToday = selectedDate === getAdjustedDate();
  
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const nextValue = e.currentTarget.value;
    if (nextValue !== currentDailyPlanner?.dailyMemo) {
      void updateDailyMemo(nextValue);
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
          코멘트를 작성해주세요!
        </Text>
      </Flex>

      {isToday ? (
        <Textarea 
          key={currentDailyPlanner?.id ?? selectedDate}
          defaultValue={memoValue}
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
          <Text fontSize="sm" color={memoValue ? "gray.700" : "gray.400"}>
            {memoValue || "작성된 메모가 없습니다."}
          </Text>
        </Box>
      )}
    </Box>
  );
};
