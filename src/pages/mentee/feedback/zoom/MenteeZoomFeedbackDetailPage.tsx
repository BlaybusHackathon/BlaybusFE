import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Button, Container, Flex, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ZoomFeedbackDetailWidget } from '@/widgets/mentor-zoom/detail/ZoomFeedbackDetailWidget';
import { ZoomFeedbackData, getZoomFeedbackById } from '@/widgets/mentor-zoom/model/mockZoomFeedbackData';

const MenteeZoomFeedbackDetailPage = () => {
  const { zoomId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<ZoomFeedbackData | null>(null);

  useEffect(() => {
    if (zoomId) {
      const feedback = getZoomFeedbackById(zoomId);
      if (feedback) {
        setData({
             memo: feedback.memo || '',
             subjects: feedback.subjects || { korean: '', english: '', math: '' },
             operation: feedback.operation || ''
        });
      }
    }
  }, [zoomId]);

  if (!data) return <Box p={10}>로딩중...</Box>;

  return (
    <Container maxW="container.md" py={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" mb={1} color="#373E56">줌 미팅 피드백</Heading>
          <Text color="gray.500">
             {format(new Date(), 'yyyy년 MM월 dd일 (eee)', { locale: ko })} 
          </Text>
        </Box>
      </Flex>

      <Box bg="white" mb={10}>
        <ZoomFeedbackDetailWidget 
            data={data} 
            onChange={() => {}} 
            readOnly={true}     
        />
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