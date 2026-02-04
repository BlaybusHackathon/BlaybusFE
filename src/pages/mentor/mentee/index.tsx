import { Box, Heading, Text, Tag } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const MentorMenteeManagePage = () => {
  const { menteeId } = useParams();

  return (
    <Box>
      <Heading size="lg" mb={4}>멘티 상세 관리</Heading>
      <Text mb={4}>
        현재 선택된 멘티 ID: <Tag colorScheme="blue">{menteeId}</Tag>
      </Text>
      <Text color="gray.600">이곳에서 멘티의 학습 현황을 종합적으로 관리합니다.</Text>
    </Box>
  );
};

export default MentorMenteeManagePage;