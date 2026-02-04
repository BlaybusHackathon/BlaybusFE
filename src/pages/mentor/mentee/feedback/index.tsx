import { Box, Heading, Text, Tag } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const MentorMenteeFeedbackPage = () => {
  const { menteeId } = useParams();

  return (
    <Box>
      <Heading size="lg" mb={4}>멘티 피드백</Heading>
      <Text mb={4}>
        <Tag colorScheme="blue">{menteeId}</Tag> 멘티에게 보낸 피드백 내역입니다.
      </Text>
      <Box h="400px" bg="white" border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
        피드백 리스트 영역 (준비중)
      </Box>
    </Box>
  );
};

export default MentorMenteeFeedbackPage;