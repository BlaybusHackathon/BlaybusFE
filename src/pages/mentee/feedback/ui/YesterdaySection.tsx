import { Box, Heading, Text, VStack, Flex } from '@chakra-ui/react';
import { subDays, isSameDay, parseISO } from 'date-fns';
import { MOCK_FEEDBACKS_With_Task } from '@/features/task-feedback/model/mockFeedbackData';
import { SimpleFeedbackCard } from '@/features/task-feedback/ui/SimpleFeedbackCard';

export const YesterdaySection = () => {
  const yesterday = subDays(new Date(), 1);
  
  const yesterdayFeedbacks = MOCK_FEEDBACKS_With_Task.filter(item => 
    isSameDay(parseISO(item.createdAt), yesterday)
  );

  return (
    <Box mb={10}>
      <Heading size="lg" mb={2} color="gray.800">어제자 피드백</Heading>

      {yesterdayFeedbacks.length > 0 ? (
        <VStack spacing={4} align="stretch" py={2}>
          {yesterdayFeedbacks.map(fb => (
            <SimpleFeedbackCard key={fb.id} feedback={fb} />
          ))}
        </VStack>
      ) : (
        <Flex 
          bg="white" 
          p={8} 
          borderRadius="xl" 
          justify="center" 
          align="center" 
          border="1px dashed" 
          borderColor="gray.200"
        >
          <Text color="gray.400">어제 도착한 피드백이 없습니다.</Text>
        </Flex>
      )}
    </Box>
  );
};