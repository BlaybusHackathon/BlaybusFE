import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Button, useToast, Container, Text, Flex } from '@chakra-ui/react';
import { format, parseISO, getMonth, getWeekOfMonth, getYear } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ReportDetailWidget } from '@/widgets/mentor-report/detail/ReportDetailWidget';
import { ReportData } from '@/features/report/model/types';
import { weeklyReportApi } from '@/features/report/api/weeklyReportApi';

const MentorReportPage = () => {
  const { menteeId, reportId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const isNewMode = !reportId || reportId === 'new';

  const [reportData, setReportData] = useState<ReportData>({
    menteeId: menteeId || '', 
    startDate: startDate || '',
    endDate: endDate || '',
    totalReview: '',
    wellDone: '',
    improvements: '',
  });

  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const currentDateInfo = useMemo(() => {
    if (!startDate && !dateRange.start) {
        const now = new Date();
        return { 
            year: getYear(now), 
            month: getMonth(now) + 1, 
            week: getWeekOfMonth(now, { weekStartsOn: 0 }) 
        };
    }
    
    const targetDateStr = startDate || dateRange.start;
    const targetDate = parseISO(targetDateStr);
    
    return {
        year: getYear(targetDate),
        month: getMonth(targetDate) + 1,
        week: getWeekOfMonth(targetDate, { weekStartsOn: 0 }) 
    };
  }, [startDate, dateRange.start]);

  useEffect(() => {
    const loadData = async () => {
      if (!menteeId) return;

      setLoading(true);
      try {
        if (isNewMode && startDate && endDate) {
          setDateRange({ start: startDate, end: endDate });

          const existingReport = await weeklyReportApi.getByStartDate(startDate, menteeId);
          if (existingReport) {
            setReportData(existingReport);
          } else {
            setReportData({
                menteeId,
                startDate,
                endDate,
                totalReview: '', 
                wellDone: '', 
                improvements: '' 
            });
          }
        } else if (reportId && reportId !== 'new') {
          const report = await weeklyReportApi.getById(reportId);
          setDateRange({ start: report.startDate, end: report.endDate });
          setReportData(report);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [reportId, startDate, endDate, isNewMode, menteeId]);

  const formatDateRange = () => {
    if (!dateRange.start || !dateRange.end) return '';
    try {
      const start = parseISO(dateRange.start);
      const end = parseISO(dateRange.end);
      return `${format(start, 'yyyy.MM.dd', { locale: ko })} ~ ${format(end, 'MM.dd', { locale: ko })}`;
    } catch {
      return '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setReportData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!reportData.totalReview || !reportData.wellDone || !reportData.improvements) {
      toast({
        title: '모든 항목을 입력해 주세요.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      if (reportData.id) {
        await weeklyReportApi.update(reportData.id, reportData);
      } else {
        await weeklyReportApi.create(reportData);
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
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/mentor/mentee/${menteeId}`);
  };

  return (
    <Container maxW="1200px" py={10}>
      <Heading as="h1" size="lg" mb={4} color="#373E56">
        주간 학습 리포트
      </Heading>

      <Text color="#7E7E7E" mb={10} fontSize="16px" fontWeight="500">
        {formatDateRange()}
      </Text>

      <Box mb="80px">
        <ReportDetailWidget 
            data={reportData} 
            dateInfo={currentDateInfo}
            onChange={handleInputChange} 
        />
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

export default MentorReportPage;
