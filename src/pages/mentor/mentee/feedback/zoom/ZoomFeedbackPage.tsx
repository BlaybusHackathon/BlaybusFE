import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Box, Heading, Button, useToast, Container, Flex, VStack, Input, Text
} from '@chakra-ui/react';
import { ZoomFeedbackDetailWidget } from '@/widgets/mentor-zoom/detail/ZoomFeedbackDetailWidget';
import { useZoomFeedbackDetail } from '@/features/zoom-feedback/model/useZoomFeedbackDetail';
import { zoomFeedbackApi } from '@/features/zoom-feedback/api/zoomFeedbackApi';
import type { ZoomFeedbackData } from '@/features/zoom-feedback/model/types';

type ZoomFeedbackField = 'memo' | 'operation' | 'subjects' | 'meetingDate' | 'title';
type ZoomFeedbackValue = string | ZoomFeedbackData['subjects'] | undefined;

const createEmptyData = (): ZoomFeedbackData => ({
  memo: '',
  subjects: { korean: '', english: '', math: '' },
  operation: '',
  meetingDate: new Date().toISOString().slice(0, 10),
});

const ZoomFeedbackPage = () => {
  const { menteeId, zoomId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const isNewMode = !zoomId || zoomId === 'new';
  const detailId = !isNewMode && zoomId ? zoomId : undefined;
  const { data: detail, isLoading: isDetailLoading, error: detailError } = useZoomFeedbackDetail(detailId);

  const [data, setData] = useState<ZoomFeedbackData>(() => createEmptyData());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (detail && !isNewMode) {
      setData({
        memo: detail.memo ?? '',
        subjects: {
          korean: detail.subjects?.korean ?? '',
          english: detail.subjects?.english ?? '',
          math: detail.subjects?.math ?? '',
        },
        operation: detail.operation ?? '',
        meetingDate: detail.meetingDate ?? new Date().toISOString().slice(0, 10),
        id: detail.id,
      });
    }

    if (isNewMode) {
      setData(createEmptyData());
    }
  }, [detail, isNewMode]);

  const handleSave = async () => {
    const meetingDate = (data.meetingDate ?? '').trim();

    if (!data.memo) {
      toast({
        title: '피드백 메모를 입력해 주세요.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!meetingDate) {
      toast({
        title: '상담 날짜를 선택해 주세요.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(meetingDate)) {
      toast({
        title: '날짜 형식이 올바르지 않습니다.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (isNewMode && !menteeId) {
      toast({
        title: '멘티 정보가 없습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const payload: ZoomFeedbackData = {
      ...data,
      meetingDate,
    };

    setIsSaving(true);
    try {
      if (isNewMode) {
        await zoomFeedbackApi.create({ ...payload, menteeId });
      } else if (zoomId) {
        await zoomFeedbackApi.update(zoomId, payload);
      }

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
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/mentor/mentee/${menteeId}`);
  };

  const handleChange = (field: ZoomFeedbackField, value: ZoomFeedbackValue) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isNewMode && isDetailLoading) {
    return <Box p={10}>로딩 중입니다.</Box>;
  }

  if (!isNewMode && detailError) {
    return <Box p={10}>줌 피드백을 불러오지 못했습니다.</Box>;
  }

  return (
    <Container maxW="1200px" py={10}>
      <Flex justifyContent="space-between" alignItems="center" mb={12} gap={4} wrap="wrap">
        <VStack align="start" spacing={1}>
          <Heading as="h1" size="lg" color="#373E56">
            {isNewMode ? '줌 피드백 작성' : '줌 피드백 수정'}
          </Heading>
        </VStack>
        <Box minW="200px">
          <Text fontSize="sm" color="gray.500" mb={1}>
            상담 날짜
          </Text>
          <Input
            type="date"
            value={data.meetingDate ?? ''}
            onChange={(e) => handleChange('meetingDate', e.target.value)}
            bg="white"
            borderColor="#E2E4E8"
          />
        </Box>
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
          isLoading={isSaving}
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
