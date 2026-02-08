import { useState, useMemo } from 'react';
import { Box, Flex, Text, VStack, IconButton, HStack, Spinner } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, AddIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { ZoomFeedbackItem } from './ZoomFeedbackItem';
import { useZoomFeedbackList } from '@/features/zoom-feedback/model/useZoomFeedbackList';

const ITEMS_PER_PAGE = 4;

interface ZoomFeedbackListProps {
  menteeId?: string;
  onItemClick?: (feedbackId: string) => void;
}

export const ZoomFeedbackList = ({ menteeId: propMenteeId, onItemClick }: ZoomFeedbackListProps) => {
  const navigate = useNavigate();
  const { menteeId: paramMenteeId } = useParams();

  const menteeId = propMenteeId || paramMenteeId;

  const [pageByKey, setPageByKey] = useState<Record<string, number>>({});
  const { data, isLoading, error } = useZoomFeedbackList(menteeId);

  const sortedFeedbacks = useMemo(() => {
    const list = data ?? [];
    const toKey = (value: string) => {
      const datePart = value?.split('T')[0] ?? '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        return Number(datePart.replace(/-/g, ''));
      }
      const time = new Date(value).getTime();
      return Number.isNaN(time) ? 0 : time;
    };

    return [...list].sort((a, b) => toKey(b.meetingDate) - toKey(a.meetingDate));
  }, [data]);

  const pageKey = String(menteeId ?? 'none') + '-' + String(sortedFeedbacks.length);
  const page = pageByKey[pageKey] ?? 0;

  const totalItems = sortedFeedbacks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const currentItems = sortedFeedbacks.slice(
    safePage * ITEMS_PER_PAGE,
    (safePage + 1) * ITEMS_PER_PAGE
  );

  const setPage = (updater: number | ((prev: number) => number)) => {
    setPageByKey((prev) => {
      const current = prev[pageKey] ?? 0;
      const next = typeof updater === 'function' ? updater(current) : updater;
      return { ...prev, [pageKey]: next };
    });
  };

  const handleItemClick = (id: string) => {
    if (onItemClick) {
      onItemClick(id);
      return;
    }

    if (menteeId) {
      navigate(`/mentor/mentee/${menteeId}/zoom/${id}`);
    }
  };

  const isMentorMode = !onItemClick;
  const canAdd = isMentorMode && Boolean(menteeId);

  return (
    <Box bg={{ base: 'none', md: 'white' }}>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize={{ base: 'md', md: 'xl' }} fontWeight="bold">
          줌 피드백 목록
        </Text>
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
            isDisabled={safePage === 0 || totalItems === 0}
            onClick={() => setPage((p) => Math.max(0, Math.min(totalPages - 1, p - 1)))}
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
            isDisabled={safePage >= totalPages - 1 || totalItems === 0}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            _hover={{ bg: 'blue.50' }}
          />
        </HStack>
      </Flex>

      <VStack spacing={3} align="stretch" borderRadius={{ base: 10, md: 22 }} bg={{ base: 'white', md: '#F9F9FB' }} p={{ base: 2, md: 4 }}>
        {isLoading ? (
          <Flex justify="center" align="center" h="200px" color="gray.400" gap={2}>
            <Spinner size="sm" />
            불러오는 중입니다.
          </Flex>
        ) : error ? (
          <Flex justify="center" align="center" h="200px" color="red.400">
            줌 피드백을 불러오지 못했습니다.
          </Flex>
        ) : currentItems.length === 0 ? (
          <Flex justify="center" align="center" h="200px" color="gray.400">
            등록된 줌 피드백이 없습니다.
          </Flex>
        ) : (
          currentItems.map((item, index) => (
            <ZoomFeedbackItem
              key={item.id}
              countNumber={totalItems - (safePage * ITEMS_PER_PAGE + index)}
              meetingDate={item.meetingDate || new Date().toISOString()}
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
            onClick={() => canAdd && navigate(`/mentor/mentee/${menteeId}/zoom/new`)}
            disabled={!canAdd}
            cursor={canAdd ? 'pointer' : 'not-allowed'}
            opacity={canAdd ? 1 : 0.6}
          >
            <AddIcon color="gray.400" boxSize={4} />
          </Box>
        )}
      </VStack>
    </Box>
  );
};
