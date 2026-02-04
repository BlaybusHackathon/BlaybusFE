import { Box, Heading } from '@chakra-ui/react';
import { StudyTimeGrid } from '@/features/study-time';

export const StudyTimeChart = () => {
  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
      <Heading size="md" mb={4}>공부 시간 기록</Heading>
      <StudyTimeGrid />
    </Box>
  );
};