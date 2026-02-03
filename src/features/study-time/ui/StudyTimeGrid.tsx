import { Box, Text, Flex } from '@chakra-ui/react';
import { StudyTimeSlot } from '@/entities/study-time/types';
import { SUBJECT_COLORS, HOURS_PER_DAY, SLOTS_PER_HOUR } from '@/shared/constants/studyTime';
import { useStudyTime } from '../model/useStudyTime';
import { SubjectSelector } from './SubjectSelector';
import { formatMinutes } from '../model/studyTimeUtils';

interface Props {
  slots: StudyTimeSlot[];
  onUpdate: (slots: StudyTimeSlot[]) => void;
  menteeId: string;
  date: string;
  isEditable?: boolean;
}

export const StudyTimeGrid = ({ slots, onUpdate, menteeId, date, isEditable = true }: Props) => {
  const {
    gridState,
    selectedSubject,
    setSelectedSubject,
    startDrag,
    onDrag,
    endDrag,
    totalMinutes
  } = useStudyTime(slots, onUpdate, menteeId, date);

  const hours = Array.from({ length: HOURS_PER_DAY }, (_, i) => i);

  return (
    <Box userSelect="none">
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontSize="sm" fontWeight="bold" color="gray.600">
          총 {formatMinutes(totalMinutes)}
        </Text>
      </Flex>
      
      {isEditable && (
        <SubjectSelector 
          selectedSubject={selectedSubject} 
          onChange={setSelectedSubject} 
        />
      )}

      <Box 
        border="1px solid" 
        borderColor="gray.200" 
        borderRadius="md" 
        overflow="hidden"
        onMouseLeave={endDrag} 
      >
        {hours.map((hour) => (
          <Flex key={hour} borderBottom="1px solid" borderColor="gray.100" height="40px">
            <Flex 
              w="50px" 
              justify="center" 
              align="center" 
              bg="gray.50" 
              borderRight="1px solid" 
              borderColor="gray.100"
              fontSize="xs"
              color="gray.500"
            >
              {String(hour).padStart(2, '0')}:00
            </Flex>

            <Flex flex={1}>
              {Array.from({ length: SLOTS_PER_HOUR }, (_, slotIdx) => {
                const globalIndex = hour * SLOTS_PER_HOUR + slotIdx;
                const subject = gridState[globalIndex];
                const colors = subject ? SUBJECT_COLORS[subject] : null;

                return (
                  <Box
                    key={slotIdx}
                    flex={1}
                    borderRight={slotIdx !== 5 ? "1px dashed" : "none"}
                    borderColor="gray.100"
                    bg={colors ? colors.bg : 'white'}
                    cursor={isEditable ? 'pointer' : 'default'}
                    
                    onMouseDown={() => isEditable && startDrag(globalIndex)}
                    onMouseEnter={() => isEditable && onDrag(globalIndex)}
                    onMouseUp={endDrag}
                    
                    onClick={() => isEditable && startDrag(globalIndex)} 
                  />
                );
              })}
            </Flex>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};