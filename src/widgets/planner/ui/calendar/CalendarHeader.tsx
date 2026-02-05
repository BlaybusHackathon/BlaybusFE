import { HStack, Text, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface CalendarHeaderProps {
  year: number;
  month: number;
  weekNumber: number;
  isWeekMode: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const CalendarHeader = ({ 
  year, month, weekNumber, isWeekMode, onPrev, onNext 
}: CalendarHeaderProps) => {
  return (
    <HStack spacing={4} mb={6} justify="center">
      <IconButton
        aria-label="이전"
        icon={<ChevronLeftIcon boxSize={6} />}
        variant="ghost"
        size="sm"
        onClick={onPrev}
        _hover={{ bg: 'gray.100' }}
      />
      
      <Text fontSize="lg" fontWeight="bold" color="gray.700">
        {isWeekMode 
          ? `${year}년 ${month}월 ${weekNumber}주차` 
          : `${year}년 ${month}월`}
      </Text>
      
      <IconButton
        aria-label="다음"
        icon={<ChevronRightIcon boxSize={6} />}
        variant="ghost"
        size="sm"
        onClick={onNext}
        _hover={{ bg: 'gray.100' }}
      />
    </HStack>
  );
};