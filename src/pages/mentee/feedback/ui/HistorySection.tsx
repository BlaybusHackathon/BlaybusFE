import { Box, Heading, VStack, Text, Flex } from '@chakra-ui/react';
import { FilterBar } from './FilterBar';
import { useFeedbackFilter } from '../model/useFeedbackFilter';
import { SimpleFeedbackCard } from '@/features/task-feedback/ui/SimpleFeedbackCard';

export const HistorySection = () => {
  const { filters, setters, data } = useFeedbackFilter();

  return (
    <Box>
      <Heading size="sm" mb={4} color="gray.700">지난 피드백 모아보기</Heading>
      
      <FilterBar filters={filters} setters={setters} />

      <Box >
        {data.length > 0 ? (
          <VStack spacing={4} align="stretch">
            {data.map(fb => (
              <SimpleFeedbackCard key={fb.id} feedback={fb} />
            ))}
          </VStack>
        ) : (
          <Flex justify="center" py={10} color="gray.400">
            <Text>해당 조건의 피드백이 없습니다.</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};