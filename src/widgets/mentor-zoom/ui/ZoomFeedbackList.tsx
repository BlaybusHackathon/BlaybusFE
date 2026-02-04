import { useState, useMemo } from 'react';
import { Box, Flex, Text, VStack, IconButton, HStack } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, AddIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_ZOOM_FEEDBACKS } from '@/features/report/model/mockReportData';
import { ZoomFeedbackItem } from './ZoomFeedbackItem';

const ITEMS_PER_PAGE = 4;

export const ZoomFeedbackList = () => {
  const navigate = useNavigate();
  const { menteeId } = useParams();
  const [page, setPage] = useState(0);

  const sortedFeedbacks = useMemo(() => {
    return [...MOCK_ZOOM_FEEDBACKS].sort((a, b) => 
      new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime()
    );
  }, []);

  const totalItems = sortedFeedbacks.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentItems = sortedFeedbacks.slice(
    page * ITEMS_PER_PAGE, 
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <Box bg="white" p={{ base: 4, md: 8 }} borderRadius="3xl" boxShadow="sm">
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="xl" fontWeight="bold">줌 미팅 피드백</Text>
        
        <HStack spacing={2}>
          <HStack spacing={1} bg="gray.50" p={1} borderRadius="lg">
            <IconButton
              aria-label="Previous page"
              icon={<ChevronLeftIcon />}
              size="xs"
              variant="ghost"
              isDisabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
            />
            <IconButton
              aria-label="Next page"
              icon={<ChevronRightIcon />}
              size="xs"
              variant="ghost"
              isDisabled={page >= totalPages - 1}
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            />
          </HStack>

          <IconButton
            aria-label="Add feedback"
            icon={<AddIcon />}
            size="sm"
            colorScheme="blue"
            borderRadius="lg"
            onClick={() => navigate(`/mentor/mentee/${menteeId}/zoom/new`)}
          />
        </HStack>
      </Flex>

      <VStack spacing={3} align="stretch" minH="300px">
        {currentItems.length === 0 ? (
          <Flex justify="center" align="center" h="200px" color="gray.400">
            등록된 피드백이 없습니다.
          </Flex>
        ) : (
          currentItems.map((item, index) => (
            <ZoomFeedbackItem
              key={item.id}
              countNumber={totalItems - (page * ITEMS_PER_PAGE + index)}
              summary={item.summary}
              meetingDate={item.meetingDate}
              onClick={() => navigate(`/mentor/mentee/${menteeId}/zoom/${item.id}`)}
            />
          ))
        )}
      </VStack>
    </Box>
  );
};