import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { 
  Box, Heading, Button, useToast, Container, Flex, VStack 
} from '@chakra-ui/react';
import { ZoomFeedbackDetailWidget } from '@/widgets/mentor-zoom/detail/ZoomFeedbackDetailWidget';
import { ZoomFeedbackData, MOCK_ZOOM_FEEDBACK_DATA } from '@/widgets/mentor-zoom/model/mockZoomFeedbackData';
import { getZoomFeedbackById } from '@/features/report/model/mockReportData';

const ZoomFeedbackPage = () => {
  const { menteeId, zoomId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const isNewMode = !zoomId || zoomId === 'new';

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ZoomFeedbackData>({
    memo: '',
    subjects: { korean: '', english: '', math: '' },
    operation: '',
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (!isNewMode && zoomId) {
          const feedback = getZoomFeedbackById(zoomId);
          if (feedback) {
            setData(MOCK_ZOOM_FEEDBACK_DATA);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [zoomId, isNewMode]);

  const handleSave = async () => {
    if (!data.memo) {
      toast({
        title: '피드백 메모를 입력해주세요.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: '저장되었습니다.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      navigate(`/mentor/mentee/${menteeId}`);
    } catch {
      toast({
        title: '저장에 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/mentor/mentee/${menteeId}`);
  };

  const handleChange = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Container maxW="1200px" py={10}>
      <Flex justifyContent="space-between" alignItems="center" mb={12}>
        <VStack align="start" spacing={1}>
          <Heading as="h1" size="lg" color="#373E56">
            줌 미팅 피드백
          </Heading>
        </VStack>
      </Flex>

      <Box mb="80px">
        <ZoomFeedbackDetailWidget data={data} onChange={handleChange} />
      </Box>

      <Flex justify="flex-end" gap={4} mb={20}>
        <Button
          variant="outline"
          size="lg"
          minW="100px"
          onClick={handleCancel}
          borderColor="#E2E4E8"
          color="#7E7E7E"
          fontSize="16px"
          fontWeight="600"
          _hover={{ bg: '#F9F9FB' }}
        >
          취소
        </Button>
        <Button
          bg="#53A8FE"
          color="white"
          size="lg"
          minW="100px"
          onClick={handleSave}
          isLoading={loading}
          fontSize="16px"
          fontWeight="600"
          _hover={{ bg: '#4297ED' }}
        >
          저장
        </Button>
      </Flex>
    </Container>
  );
};

export default ZoomFeedbackPage;