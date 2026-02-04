import { Flex, Text, HStack, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { format, addDays, addWeeks, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  currentDate: Date;
  onChangeDate: (date: Date) => void;
}

const getWeekInfo = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  
  const currentWeekStart = startOfWeek(date, { weekStartsOn: 0 });
  const firstWeekStart = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
  
  const weekNumber = Math.floor(
    (currentWeekStart.getTime() - firstWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
  ) + 1;
  
  return { year, month: month + 1, weekNumber };
};

export const DateController = ({ currentDate, onChangeDate }: Props) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const { year, month, weekNumber } = getWeekInfo(currentDate);

  const handlePrevWeek = () => onChangeDate(addWeeks(currentDate, -1));
  const handleNextWeek = () => onChangeDate(addWeeks(currentDate, 1));

  return (
    <Flex direction="column" align="center" mb={8}>
      <HStack spacing={4} mb={6}>
        <IconButton
          aria-label="이전 주"
          icon={<ChevronLeftIcon boxSize={6} />}
          variant="ghost"
          size="sm"
          onClick={handlePrevWeek}
          _hover={{ bg: 'gray.100' }}
        />
        
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          {year}년 {month}월 {weekNumber}주차
        </Text>
        
        <IconButton
          aria-label="다음 주"
          icon={<ChevronRightIcon boxSize={6} />}
          variant="ghost"
          size="sm"
          onClick={handleNextWeek}
          _hover={{ bg: 'gray.100' }}
        />
      </HStack>

      <HStack spacing={{ base: 2, md: 6 }} justify="space-between" padding="0 6vw" w="full" overflowX="auto">
        {weekDays.map((day) => {
          const isSelected = format(day, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
          const dayName = format(day, 'EEE', { locale: ko });
          const dayNum = format(day, 'd');
          const isSunday = day.getDay() === 0;

          return (
            <Flex
              key={day.toISOString()}
              direction="column"
              align="center"
              cursor="pointer"
              onClick={() => onChangeDate(day)}
              role="group"
              minW="48px"
            >
              <Text
                fontSize="lg"
                fontWeight="medium"
                color={isSelected ? 'blue.500' : isSunday ? 'red.400' : 'gray.400'}
                mb={2}
                _groupHover={{ color: !isSelected ? 'gray.600' : undefined }}
              >
                {dayName}
              </Text>
              
              <Flex
                w="48px"
                h="48px"
                align="center"
                justify="center"
                borderRadius="12px"
                bg={isSelected ? 'blue.500' : 'transparent'}
                transition="all 0.2s"
                _groupHover={{ bg: !isSelected ? 'gray.100' : undefined }}
              >
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={isSelected ? 'white' : 'gray.800'}
                >
                  {dayNum}
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </HStack>
    </Flex>
  );
};