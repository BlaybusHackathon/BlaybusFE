import { Box, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FeedbackWithTask } from '../model/types';
import { formatRelativeTime } from '../model/feedbackUtils';

interface Props {
  feedback: FeedbackWithTask;
}

export const SimpleFeedbackCard = ({ feedback }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/mentee/task/${feedback.taskId}`); 
  };

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
      onClick={handleClick} 
    >
      <Flex justify="space-between" align="center">
        <Text 
            fontSize="lg" 
            fontWeight="800" 
            color="gray.800" 
            lineHeight="1.3"
        >
        {feedback.taskTitle}
      </Text>
        <Text fontSize="xs" color="gray.400" flexShrink={0} ml={4}>
          {formatRelativeTime(feedback.createdAt)}
        </Text>
      </Flex>
      

    </Box>
  );
};