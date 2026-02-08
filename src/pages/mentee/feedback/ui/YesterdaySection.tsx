import { Box, Heading, Text, VStack, Flex } from '@chakra-ui/react';
import { SimpleFeedbackCard } from '@/features/task-feedback/ui/SimpleFeedbackCard';
import { useYesterdayFeedbacks } from '@/features/task-feedback/model/useYesterdayFeedbacks';

export const YesterdaySection = () => {
  const { data, isLoading } = useYesterdayFeedbacks();
  const yesterdayFeedbacks = data ?? [];

  return (
    <Box mb={10}>
      <Heading size={{base:"sm", md:"md"}} mb={2} color="#373E56">어제자 피드백</Heading>

      {isLoading ? (
        <Flex p={8} borderRadius="xl" justify="center" align="center" borderColor="gray.200">
          <Text color="gray.400">로딩중..</Text>
        </Flex>
      ) : yesterdayFeedbacks.length > 0 ? (
        <VStack spacing={4} align="stretch" py={2}>
          {yesterdayFeedbacks.map(fb => (
            <SimpleFeedbackCard key={fb.id} feedback={fb} />
          ))}
        </VStack>
      ) : (
        <Flex 
          p={8} 
          borderRadius="xl" 
          justify="center" 
          align="center" 
          borderColor="gray.200"
        >
          <Text color="gray.400">어제 도착한 피드백이 없습니다.</Text>
        </Flex>
      )}
    </Box>
  );
};
