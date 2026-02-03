import { HStack, Text, IconButton, Box } from '@chakra-ui/react';
import { useDateNavigation } from '@/features/planner/model/useDateNavigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

export const PlannerHeader = () => {
  const { formattedDate, prevDate, nextDate } = useDateNavigation();

  return (
    <Box py={4} px={2} bg="white" position="sticky" top={0} zIndex={10}>
      <HStack justify="space-between" align="center">
        <IconButton
            aria-label="Previous day"
            icon={<ChevronLeftIcon w={6} h={6} />}
            onClick={prevDate}
            variant="ghost"
        />
        <Text fontSize="lg" fontWeight="bold">
            {formattedDate}
        </Text>
        <IconButton
            aria-label="Next day"
            icon={<ChevronRightIcon w={6} h={6} />}
            onClick={nextDate}
            variant="ghost"
        />
      </HStack>
    </Box>
  );
};