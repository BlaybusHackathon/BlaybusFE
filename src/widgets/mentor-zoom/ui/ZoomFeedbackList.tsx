import { useState, useMemo } from 'react';
import { Box, Flex, Text, VStack, IconButton, HStack } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, AddIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_ZOOM_FEEDBACKS } from '@/widgets/mentor-zoom/model/mockZoomFeedbackData';
import { ZoomFeedbackItem } from './ZoomFeedbackItem';

const ITEMS_PER_PAGE = 4;

interface ZoomFeedbackListProps {
  menteeId?: string; 
  onItemClick?: (feedbackId: string) => void; 
}

export const ZoomFeedbackList = ({ menteeId: propMenteeId, onItemClick }: ZoomFeedbackListProps) => {
  const navigate = useNavigate();
  const { menteeId: paramMenteeId } = useParams();
  
  const menteeId = propMenteeId || paramMenteeId; 

  const [page, setPage] = useState(0);

  const sortedFeedbacks = useMemo(() => {
    return [...MOCK_ZOOM_FEEDBACKS].sort((a, b) =>
      new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime()
    );
  }, [menteeId]);

  const totalItems = sortedFeedbacks.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentItems = sortedFeedbacks.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const handleItemClick = (id: string) => {
    if (onItemClick) {
        onItemClick(id); 
    } else {
        navigate(`/mentor/mentee/${menteeId}/zoom/${id}`); 
    }
  };

  const isMentorMode = !onItemClick;

  return (
    <Box bg={{base:"none",md:"white"}}>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize={{base:"md", md:"xl"}} fontWeight="bold">줌 미팅 피드백</Text>
        <HStack spacing={2}>
          <IconButton
            aria-label="Previous page"
            icon={<ChevronLeftIcon w={5} h={5} />}
            p="8px"
            h="auto"
            variant="outline"
            borderColor="#53A8FE"
            color="#53A8FE"
            borderRadius="12px"
            isDisabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            _hover={{ bg: 'blue.50' }}
          />
          <IconButton
            aria-label="Next page"
            icon={<ChevronRightIcon w={5} h={5} />}
            p="8px"
            h="auto"
            variant="outline"
            borderColor="#53A8FE"
            color="#53A8FE"
            borderRadius="12px"
            isDisabled={page >= totalPages - 1}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            _hover={{ bg: 'blue.50' }}
          />
        </HStack>
      </Flex>

      <VStack spacing={3} align="stretch" borderRadius={{base:10, md:22}} bg={{base:'white',md:'#F9F9FB'}} p={{base:2,md:4}}>
        {currentItems.length === 0 ? (
          <Flex justify="center" align="center" h="200px" color="gray.400">
            등록된 피드백이 없습니다.
          </Flex>
        ) : (
          currentItems.map((item, index) => (
            <ZoomFeedbackItem
              key={item.id}
              countNumber={totalItems - (page * ITEMS_PER_PAGE + index)}
              meetingDate={item.meetingDate}
              onClick={() => handleItemClick(item.id)}
            />
          ))
        )}

        {isMentorMode && (
          <Box
            as="button"
            w="full"
            p={2}
            bg="#EDEDF1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="7px"
            transition="all 0.2s"
            _hover={{ bg: 'gray.100' }}
            onClick={() => navigate(`/mentor/mentee/${menteeId}/zoom/new`)}
          >
            <AddIcon color="gray.400" boxSize={4} />
          </Box>
        )}
      </VStack>
    </Box>
  );
};