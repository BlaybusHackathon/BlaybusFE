import { Box, Heading, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const MentorFeedbackWritePage = () => {
  const { menteeId } = useParams();

  return (
    <Box p={5}>
      <Heading size="lg" mb={4}>피드백 작성</Heading>
      <Text fontSize="xl">피드백 대상 멘티 ID: <Text as="span" fontWeight="bold" color="teal.500">{menteeId}</Text></Text>
      <Text mt={2}>피드백을 작성하는 화면</Text>
    </Box>
  );
};

export default MentorFeedbackWritePage;