import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Container, Text, Button, Flex } from '@chakra-ui/react';
import { format, parseISO, getMonth, getWeekOfMonth, getYear } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ReportDetailWidget } from '@/widgets/mentor-report/detail/ReportDetailWidget';
import { ReportData } from '@/features/report/model/types';
import { weeklyReportApi } from '@/features/report/api/weeklyReportApi';

const MenteeReportDetailPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!reportId) return;
      const report = await weeklyReportApi.getById(reportId);
      setReportData(report);
    };
    load();
  }, [reportId]);

  const currentDateInfo = useMemo(() => {
    if (!reportData) return { year: 0, month: 0, week: 0 };
    
    const targetDate = parseISO(reportData.startDate);
    return {
        year: getYear(targetDate),
        month: getMonth(targetDate) + 1,
        week: getWeekOfMonth(targetDate, { weekStartsOn: 0 }) 
    };
  }, [reportData]);

  const formatDateRange = () => {
    if (!reportData) return '';
    try {
      const start = parseISO(reportData.startDate);
      const end = parseISO(reportData.endDate);
      return `${format(start, 'yyyy.MM.dd', { locale: ko })} ~ ${format(end, 'MM.dd', { locale: ko })}`;
    } catch {
      return '';
    }
  };

  if (!reportData) {
      return <Box p={10}>로딩 중입니다.</Box>;
  }

  return (
    <Container maxW="1200px" py={10}>
      <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h1" size="lg" color="#373E56">
            주간 학습 리포트
          </Heading>
      </Flex>

      <Text color="#7E7E7E" mb={10} fontSize="16px" fontWeight="500">
        {formatDateRange()}
      </Text>

      <Box mb="80px">
        <ReportDetailWidget 
            data={reportData} 
            dateInfo={currentDateInfo}
            onChange={() => {}} 
            readOnly={true} 
        />
      </Box>

      <Flex justify="center" mt={10} mb={20}>
         <Button
            variant="outline"
            size="lg"
            w="100%"
            maxW="200px"
            onClick={() => navigate(-1)}
            borderColor="#E2E4E8"
            color="#7E7E7E"
            fontSize="16px"
            fontWeight="600"
            _hover={{ bg: '#F9F9FB' }}
          >
            목록으로
          </Button>
      </Flex>
    </Container>
  );
};

export default MenteeReportDetailPage;
