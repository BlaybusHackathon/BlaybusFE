import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Heading, Button, useToast, Container, Flex, VStack 
} from '@chakra-ui/react';
import { FeedbackMemo } from './ui/FeedbackMemo';
import { SubjectFeedback } from './ui/SubjectFeedback';
import { OperationalFeedback } from './ui/OperationalFeedback';
import { ZoomFeedbackData, MOCK_ZOOM_FEEDBACK_DATA } from './mockZoomFeedbackData';
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

  const handleSubjectChange = (subject: 'korean' | 'english' | 'math', value: string) => {
    setData((prev) => ({
      ...prev,
      subjects: { ...prev.subjects, [subject]: value },
    }));
  };

  return (
    <Container maxW="container.lg" py={10}>
      <Flex justifyContent="space-between" alignItems="center" mb={12}>
        <VStack align="start" spacing={1}>
          <Heading as="h1" size="lg" color="gray.800">
            줌 미팅 피드백
          </Heading>
        </VStack>
      </Flex>

      <Box mb={10}>
        <FeedbackMemo 
          value={data.memo} 
          onChange={(val) => setData({ ...data, memo: val })} 
        />
      </Box>

      <Box mb={10}>
        <SubjectFeedback 
          subjects={data.subjects} 
          onChange={handleSubjectChange} 
        />
      </Box>

      <Box mb={24}>
        <OperationalFeedback 
          value={data.operation} 
          onChange={(val) => setData({ ...data, operation: val })} 
        />
      </Box>

      <Box 
        position="fixed" 
        bottom={0} 
        left={0} 
        right={0} 
        p={4} 
        bg="white" 
        borderTop="1px solid" 
        borderColor="gray.200" 
        zIndex={10}
      >
        <Container maxW="container.lg">
          <Flex justify="flex-end" gap={4}>
            <Button 
              variant="outline" 
              size="lg" 
              minW="100px"
              onClick={handleCancel}
            >
              취소
            </Button>
            <Button 
              colorScheme="blue" 
              size="lg" 
              minW="100px" 
              onClick={handleSave} 
              isLoading={loading}
            >
              저장
            </Button>
          </Flex>
        </Container>
      </Box>
    </Container>
  );
};

export default ZoomFeedbackPage;