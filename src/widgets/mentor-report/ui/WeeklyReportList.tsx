import { useState, useMemo, useEffect } from 'react';
import { Box, Flex, Text, VStack, HStack, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachWeekOfInterval, addDays, isSameMonth
} from 'date-fns';
import { WeeklyReportItem } from './WeeklyReportItem';
import { weeklyReportApi } from '@/features/report/api/weeklyReportApi';
import { ReportData } from '@/features/report/model/types';
import { useAuthStore } from '@/shared/stores/authStore';

interface WeeklyReportListProps {
  externalDate?: Date;
  onItemClick?: (args: { startDate: string; endDate: string; reportId?: string }) => void;
}

export const WeeklyReportList = ({ externalDate, onItemClick }: WeeklyReportListProps) => {
  const navigate = useNavigate();
  const { menteeId } = useParams();
  const { user } = useAuthStore();
  
  const [internalDate, setInternalDate] = useState(new Date());
  const [reports, setReports] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const currentMonthDate = externalDate ?? internalDate;
  const isControlled = !!externalDate; 

  const queryMenteeId = user?.role === 'MENTOR' ? menteeId : user?.id;

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      try {
        const year = currentMonthDate.getFullYear();
        const month = currentMonthDate.getMonth() + 1;
        const list = await weeklyReportApi.list({ year, month, menteeId: queryMenteeId });
        setReports(list);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [currentMonthDate, queryMenteeId]);

  const reportByStartDate = useMemo(() => {
    return new Map(reports.map(r => [r.startDate, r]));
  }, [reports]);

  const weeksInMonth = useMemo(() => {
    const monthStart = startOfMonth(currentMonthDate);
    const monthEnd = endOfMonth(currentMonthDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const weeks = eachWeekOfInterval({
      start: calendarStart,
      end: calendarEnd
    }, { weekStartsOn: 0 });

    return weeks.map((weekStart, index) => {
      const weekEnd = addDays(weekStart, 6);
      return {
        weekNumber: index + 1,
        startDate: format(weekStart, 'yyyy-MM-dd'),
        endDate: format(weekEnd, 'yyyy-MM-dd'),
        displayRange: `${format(weekStart, 'yyyy.MM.dd')} ~ ${format(weekEnd, 'dd')}`
      };
    }).filter(week => {
      const s = new Date(week.startDate);
      const e = new Date(week.endDate);
      return isSameMonth(s, currentMonthDate) || isSameMonth(e, currentMonthDate);
    });
  }, [currentMonthDate]);

  const getWeekStatus = (startDateStr: string, endDateStr: string) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    if (todayStr < startDateStr) return 'FUTURE';
    if (todayStr > endDateStr) return 'PAST';
    return 'CURRENT';
  };

  const handleClick = (startDate: string, endDate: string) => {
    const report = reportByStartDate.get(startDate);

    if (onItemClick) {
        onItemClick({ startDate, endDate, reportId: report?.id });
        return;
    }

    if (report) {
      navigate(`/mentor/mentee/${menteeId}/report/${report.id}`);
    } else {
      navigate(`/mentor/mentee/${menteeId}/report/new?startDate=${startDate}&endDate=${endDate}`);
    }
  };

  const displayMonth = Number(format(currentMonthDate, 'M'));

  return (
    <Box px={4} mb={20}>
      <Flex justify="space-between" align="center" mb={{base:1, md:6}}>
        <Text my={2} fontSize={{base:"1rem", md:"2xl"}} fontWeight="bold">주간 학습 리포트</Text>
        
        {!isControlled && (
          <HStack spacing={2}>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon color="#A0A5B1" w={5} h={5} />}
                w="110px"
                p="15px"
                fontSize="sm"
                borderRadius="12px"
                border="1px solid"
                borderColor="#53A8FE"
                bg="white"
                color="#5F6575"
                fontWeight="600"
                textAlign="left"
                gap={4}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                lineHeight="1"
                _hover={{ borderColor: '#53A8FE', bg: 'white' }}
                _active={{ bg: 'white' }}
                sx={{ span: { flex: 1, textAlign: 'left' } }}
              >
                <Text as="span">{format(currentMonthDate, 'yyyy')}년</Text>
              </MenuButton>
              <MenuList maxH="200px" overflowY="auto" borderRadius="12px" boxShadow="lg" minW="110px">
                {[2024, 2025, 2026, 2027].map(year => (
                  <MenuItem
                    key={year}
                    onClick={() => {
                      setInternalDate(prev => {
                        const newDate = new Date(prev);
                        newDate.setFullYear(year);
                        return newDate;
                      });
                    }}
                    fontSize="sm"
                    color="#373E56"
                    fontWeight="500"
                    _hover={{ bg: '#F7F8FA', color: '#373E56' }}
                  >
                    {year}년
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon color="#A0A5B1" w={5} h={5} />}
                w="90px"
                p="15px"
                fontSize="sm"
                borderRadius="12px"
                border="1px solid"
                borderColor="#53A8FE"
                bg="white"
                color="#5F6575"
                fontWeight="600"
                textAlign="left"
                gap={4}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                lineHeight="1"
                _hover={{ borderColor: '#53A8FE', bg: 'white' }}
                _active={{ bg: 'white' }}
                sx={{ span: { flex: 1, textAlign: 'left' } }}
              >
                <Text as="span">{format(currentMonthDate, 'M')}월</Text>
              </MenuButton>
              <MenuList maxH="200px" overflowY="auto" borderRadius="12px" boxShadow="lg" minW="90px">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <MenuItem
                    key={month}
                    onClick={() => {
                      setInternalDate(prev => {
                        const newDate = new Date(prev);
                        newDate.setMonth(month - 1);
                        return newDate;
                      });
                    }}
                    fontSize="sm"
                    color="#373E56"
                    fontWeight="500"
                    _hover={{ bg: 'gray.100', color: '#373E56' }}
                  >
                    {month}월
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>
        )}
      </Flex>

      <VStack spacing={{base:2,md:3}} align="stretch" borderRadius={22} bg={{base: "#fff", md:'#F9F9FB'}} px={4} py={3}>
        {isLoading ? (
          <Flex justify="center" align="center" h="120px" color="gray.400">
            <Text>로딩 중입니다.</Text>
          </Flex>
        ) : (
          weeksInMonth.map((week) => {
            const status = getWeekStatus(week.startDate, week.endDate);
            const report = reportByStartDate.get(week.startDate);
            const hasReport = !!report;

            return (
              <WeeklyReportItem
                key={week.startDate}
                weekNumber={week.weekNumber}
                displayMonth={displayMonth}
                displayRange={week.displayRange}
                status={status}
                hasReport={hasReport}
                onClick={() => handleClick(week.startDate, week.endDate)}
              />
            );
          })
        )}
      </VStack>
    </Box>
  );
};
