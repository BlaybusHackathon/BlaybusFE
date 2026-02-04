import { Box, Heading, Text, Tag } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const MentorMenteeCalendarPage = () => {
  const { menteeId } = useParams();

  return (
    <Box>
      <Heading size="lg" mb={4}>멘티 캘린더</Heading>
      <Text mb={4}>
        <Tag colorScheme="blue">{menteeId}</Tag> 멘티의 월간/주간 계획표입니다.
      </Text>
      <Box h="400px" bg="white" border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
        캘린더 영역 (준비중)
      </Box>
    </Box>
  );
};

export default MentorMenteeCalendarPage;