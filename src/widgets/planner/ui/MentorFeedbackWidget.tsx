import { Box, Text, Flex } from '@chakra-ui/react';
import { usePlannerStore } from '@/shared/stores/plannerStore';

export const MentorFeedbackWidget = () => {
  const { currentDailyPlanner } = usePlannerStore();
  const feedback = currentDailyPlanner?.mentorFeedback;

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
          멘토 쌤의 피드백
        </Text>
      </Flex>

      <Flex gap={3} align="flex-start">
        <Box 
          flex={1}
          p={3} 
          bg="white" 
          borderRadius="lg" 
          borderTopLeftRadius="0" 
          boxShadow="sm"
        >
          {feedback ? (
            <Text fontSize="sm" color="gray.800" whiteSpace="pre-wrap">
              {feedback}
            </Text>
          ) : (
            <Text fontSize="sm" color="gray.400" fontStyle="italic">
              아직 작성된 피드백이 없어요.
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};