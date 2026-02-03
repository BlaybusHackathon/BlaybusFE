import { Box, Heading } from '@chakra-ui/react';
import { StudyTimeGrid } from '@/features/study-time/ui/StudyTimeGrid';
import { usePlannerStore } from '@/shared/stores/plannerStore';

export const StudyTimeChart = () => {
  const { studyTimeSlots, setStudyTimeSlots, selectedDate } = usePlannerStore();
  
  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
      <Heading size="md" mb={4}>공부 시간 기록</Heading>
      <StudyTimeGrid 
        slots={studyTimeSlots} 
        onUpdate={setStudyTimeSlots}
        menteeId="mentee-1"
        date={selectedDate}
        isEditable={isToday}
      />
    </Box>
  );
};