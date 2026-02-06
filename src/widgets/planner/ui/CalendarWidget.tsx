import { Box, Flex } from '@chakra-ui/react';
import { useCalendar } from '../model/useCalendar'; 
import { CalendarHeader } from './calendar/CalendarHeader';
import { CalendarGrid } from './calendar/CalendarGrid';

export const CalendarWidget = () => {
  const {
    viewMode,
    viewDate,
    selectedDate,
    daysToRender,
    weekInfo,
    handlePrev,
    handleNext,
    handleDateClick,
    toggleViewMode,
    handleTouchStart,
    handleTouchEnd
  } = useCalendar();

  return (
    <Box 
      w="full" 
      bg="white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <CalendarHeader
        year={weekInfo.year}
        month={weekInfo.month}
        weekNumber={weekInfo.weekNumber}
        isWeekMode={viewMode === 'WEEK'}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <CalendarGrid
        days={daysToRender}
        selectedDate={selectedDate}
        viewDate={viewDate}
        viewMode={viewMode}
        onDateClick={handleDateClick}
      />

      <Flex 
        justify="center" 
        align="center" 
        h="24px" 
        cursor="pointer" 
        onClick={toggleViewMode}
        mt={2}
      >
        <Box w="40px" h="4px" bg="gray.300" borderRadius="full" />
      </Flex>
    </Box>
  );
};