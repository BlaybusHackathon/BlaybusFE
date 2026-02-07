import { Box, SimpleGrid, Flex, Text } from '@chakra-ui/react';
import { format, isSameMonth } from 'date-fns';
import { ko } from 'date-fns/locale';

interface CalendarGridProps {
  days: Date[];
  selectedDate: Date;
  viewDate: Date;
  viewMode: 'WEEK' | 'MONTH';
  onDateClick: (date: Date) => void;
}

export const CalendarGrid = ({ 
  days, selectedDate, viewDate, viewMode, onDateClick 
}: CalendarGridProps) => {
  
  const renderDayItem = (date: Date, index: number) => {
    const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    const isCurrentMonth = isSameMonth(date, viewDate);
    const dayName = format(date, 'EEE', { locale: ko });
    const dayNum = format(date, 'd');
    const isSunday = date.getDay() === 0;

    const opacity = viewMode === 'MONTH' && !isCurrentMonth ? 0.3 : 1;

    return (
      <Flex
        key={date.toISOString()}
        direction="column"
        align="center"
        justify="flex-start"
        cursor="pointer"
        onClick={() => onDateClick(date)}
        role="group"
        opacity={opacity}
        w="full"
        py={1}
      >
        {(viewMode === 'WEEK' || index < 7) && (
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={isSelected ? '#53A8FE' : isSunday ? '#53A8FE' : '53A8FE'}
            mb={2}
            _groupHover={{ color: !isSelected ? '#53A8FE' : undefined }}
          >
            {dayName}
          </Text>
        )}
        
        <Flex
          w="40px"
          h="40px"
          align="center"
          justify="center"
          borderRadius="12px"
          bg={isSelected ? '#53A8FE' : 'transparent'}
          transition="all 0.2s"
          _groupHover={{ bg: !isSelected ? 'gray.100' : undefined }}
        >
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={isSelected ? 'white' : 'gray.800'}
          >
            {dayNum}
          </Text>
        </Flex>
      </Flex>
    );
  };

  return (
    <Box 
      px={{ base: 2, md: 6 }} 
      minH={viewMode === 'MONTH' ? "300px" : "auto"}
      transition="all 0.3s ease"
    >
      <SimpleGrid 
        columns={7} 
        spacingY={4} 
        spacingX={0} 
        w="full"
      >
        {days.map((date, i) => renderDayItem(date, i))}
      </SimpleGrid>
    </Box>
  );
};