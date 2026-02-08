import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Button, Container, Flex, Text } from '@chakra-ui/react';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ZoomFeedbackDetailWidget } from '@/widgets/mentor-zoom/detail/ZoomFeedbackDetailWidget';
import { useZoomFeedbackDetail } from '@/features/zoom-feedback/model/useZoomFeedbackDetail';

const parseDateOnly = (value?: string) => {
  const datePart = value?.split('T')[0];
  if (datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return parse(datePart, 'yyyy-MM-dd', new Date());
  }
  const parsed = value ? new Date(value) : new Date();
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const MenteeZoomFeedbackDetailPage = () => {
  const { zoomId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useZoomFeedbackDetail(zoomId);

  if (isLoading) {
    return (
      <Box p={10} color="gray.500">
        로딩 중입니다.
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={10} color="red.400">
        줌 피드백을 불러오지 못했습니다.
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={10} color="gray.500">
        줌 피드백이 없습니다.
      </Box>
    );
  }

  const meetingDate = parseDateOnly(data.meetingDate);
  const dateLabel = format(meetingDate, 'yyyy년 MM월 dd일 (EEE)', { locale: ko });

  return (
    <Container maxW="container.md" py={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" mb={1} color="#373E56">
            줌 피드백
          </Heading>
          <Text color="gray.500">{dateLabel}</Text>
        </Box>
      </Flex>

      <Box bg="white" mb={10}>
        <ZoomFeedbackDetailWidget data={data} onChange={() => {}} readOnly />
      </Box>

      <Button
        w="full"
        size="lg"
        variant="outline"
        borderColor="#E2E4E8"
        color="#7E7E7E"
        onClick={() => navigate(-1)}
        _hover={{ bg: '#F9F9FB' }}
      >
        목록으로 돌아가기
      </Button>
    </Container>
  );
};

export default MenteeZoomFeedbackDetailPage;
