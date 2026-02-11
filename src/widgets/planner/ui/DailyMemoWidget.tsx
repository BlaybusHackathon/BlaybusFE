import { useMemo } from 'react';
import { Box, Text, Textarea, Flex } from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';
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
      px={{base:4, md:0}} 
    >
      <Flex align="center" mb={2} gap={2}>
        <Text 
          fontSize="lg" 
          fontWeight="bold" 
        >
          코멘트
        </Text>
      </Flex>

      {isToday ? (
        <Textarea 
          as={TextareaAutosize}
          key={currentDailyPlanner?.id ?? selectedDate}
          defaultValue={memoValue}
          onBlur={handleBlur}
          placeholder="오늘의 목표나 다짐을 적어보세요!"
          borderRadius={10}
          boxShadow="sm"
          p={6}
          bg={{base:"white", md:"#F9F9FB"}}
          size="sm"
          resize="none"
          minRows={2}
          fontSize="sm"
          border={'none'}
          focusBorderColor="transparent"
          _hover={{ border: 'none' }}
          _focus={{ boxShadow: 'none', border: 'none' }}
          _active={{ boxShadow: 'none', border: 'none' }}
        />
      ) : (
        <Box 
          p={6} 
          bg={{base:"white", md:"#F9F9FB"}}
          borderRadius={10}
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
