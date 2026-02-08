import { Box, Heading, VStack, Text, Flex } from '@chakra-ui/react';
import { FilterBar } from './FilterBar';
import { SimpleFeedbackCard } from '@/features/task-feedback/ui/SimpleFeedbackCard';
import { useFeedbackFilter } from '../model/useFeedbackFilter';
import { useFeedbackHistory } from '@/features/task-feedback/model/useFeedbackHistory';
import { useAuthStore } from '@/shared/stores/authStore';

export const HistorySection = () => {
  const { filters, setters } = useFeedbackFilter();
  const { user } = useAuthStore();
  const menteeId = user?.id ?? '';
  const { data, isLoading } = useFeedbackHistory({
    menteeId,
    year: filters.year,
    month: filters.month,
    weekNumber: filters.week,
    subject: filters.subject,
  });

  const list = data ?? [];

  return (
    <Box>
      <Heading size={{base:"sm", md:"md"}} mb={4} color="gray.700">이전 피으백 모아보기</Heading>
      
      <FilterBar filters={filters} setters={setters} />

      <Box >
        {isLoading ? (
          <Flex justify="center" py={10} color="gray.400">
            <Text>로딩�?..</Text>
          </Flex>
        ) : list.length > 0 ? (
          <VStack spacing={2} align="stretch">
            {list.map(fb => (
              <SimpleFeedbackCard key={fb.id} feedback={fb} />
            ))}
          </VStack>
        ) : (
          <Flex justify="center" py={10} color="gray.400">
            <Text>해당 조건 피드백이 없습니다.</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};
