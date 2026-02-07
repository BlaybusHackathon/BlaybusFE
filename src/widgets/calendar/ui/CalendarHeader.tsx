import { Text, IconButton, HStack } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return (
    <HStack spacing={4} pr={{base:0, md:6}}>
      <IconButton
        aria-label="Previous month"
        icon={<ChevronLeftIcon w={{base:5, md:6}} h={6} color="#373E56" />}
        onClick={onPrevMonth}
        variant="unstyled"
        display="flex"
        alignItems="center"
        justifyContent="center"
        minW="auto"
        _hover={{ color: 'gray.800' }}
      />
      <Text fontSize={{base:14, md:"xl"}} fontWeight="bold" color="#373E56">
        {year}년 {month}월
      </Text>
      <IconButton
        aria-label="Next month"
        icon={<ChevronRightIcon w={{base:5, md:6}} h={6} color="#373E56" />}
        onClick={onNextMonth}
        variant="unstyled"
        display="flex"
        alignItems="center"
        justifyContent="center"
        minW="auto"
        _hover={{ color: 'gray.800' }}
      />
    </HStack>
  );
};