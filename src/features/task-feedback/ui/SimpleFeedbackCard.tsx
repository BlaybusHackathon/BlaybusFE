import { Box, Flex, Text } from '@chakra-ui/react';
import { FeedbackWithTask } from '../model/types';
import { parseEmphasis, formatRelativeTime } from '../model/feedbackUtils';

interface Props {
  feedback: FeedbackWithTask;
}

export const SimpleFeedbackCard = ({ feedback }: Props) => {
  return (
    <Box 
      bg="white" 
      p={5} 
      borderRadius="xl" 
      boxShadow="sm" 
      border="1px solid" 
      borderColor="gray.100"
      _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      cursor="pointer"
    >
      <Flex justify="space-between" align="center" mb={3}>
        <Text 
            fontSize="lg" 
            fontWeight="800" 
            color="gray.800" 
            mb={2}
            lineHeight="1.3"
        >
        {feedback.taskTitle}
      </Text>
        <Text fontSize="xs" color="gray.400">
          {formatRelativeTime(feedback.createdAt)}
        </Text>
      </Flex>



      <Box 
        fontSize="sm" 
        color="gray.600" 
        lineHeight="1.5"
        noOfLines={2}
        dangerouslySetInnerHTML={{ __html: parseEmphasis(feedback.content) }}
        sx={{
            'strong': { color: 'blue.600', fontWeight: '600' } 
        }}
        mb={3}
      />

    </Box>
  );
};