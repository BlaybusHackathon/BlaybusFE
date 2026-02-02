import { Box, Heading, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const MenteeTaskDetailPage = () => {
  const { taskId } = useParams();

  return (
    <Box p={5}>
      <Heading size="lg" mb={4}>과제 상세 페이지</Heading>
      <Text fontSize="xl">선택된 과제 ID: <Text as="span" fontWeight="bold" color="blue.500">{taskId}</Text></Text>
      <Text mt={2}>여기서 과제 PDF를 확인하고 사진을 업로드</Text>
    </Box>
  );
};

export default MenteeTaskDetailPage;