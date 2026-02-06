import { Box, Heading } from '@chakra-ui/react';
import { StudyTimeGrid } from '@/features/study-time';
import { TimerIcon } from '@/shared/ui/icons';

export const StudyTimeChart = () => {
  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
      <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
        <TimerIcon/>
        공부시간
      </Heading>
      <StudyTimeGrid />
    </Box>
  );
};