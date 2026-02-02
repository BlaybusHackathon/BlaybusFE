import { HStack, Text, IconButton, Box } from '@chakra-ui/react';
import { useDateNavigation } from '@/features/planner/model/useDateNavigation';

export const PlannerHeader = () => {
  const { formattedDate, prevDate, nextDate } = useDateNavigation();

  return (
    <Box py={4} px={2} bg="white" position="sticky" top={0} zIndex={10}>
      <HStack justify="space-between" align="center">
        <IconButton
          aria-label="Previous day"
          icon={<span>&lt;</span>}
          onClick={prevDate}
          variant="ghost"
        />
        <Text fontSize="lg" fontWeight="bold">
          {formattedDate}
        </Text>
        <IconButton
          aria-label="Next day"
          icon={<span>&gt;</span>}
          onClick={nextDate}
          variant="ghost"
        />
      </HStack>
    </Box>
  );
};