import { Box, Flex } from '@chakra-ui/react';
import { Subject } from '@/shared/constants/subjects';
import { 
  SUBJECT_COLORS, 
  TOTAL_HOURS, 
  SLOTS_PER_HOUR,
  DAY_START_HOUR 
} from '@/shared/constants/studyTime';

interface Props {
  gridState: (Subject | null)[];
  highlightSubject?: Subject | null;
}

export const StudyTimeGridView = ({ gridState, highlightSubject }: Props) => {
  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => {
    return (DAY_START_HOUR + i) % 24;
  });

  return (
    <Box 
      userSelect="none" 
      w="full"
      h={"auto"}
      display="flex"
      flexDirection="column"
      px={2}
    >
      <Box 
        flex={1}
        borderRadius="2xl" 
        overflowY="auto"
        h={"100%"}
        bg="white"
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: '#CBD5E0', borderRadius: '4px' },
        }}
      >
        {hours.map((hour, hourIndex) => (
          <Flex 
            key={hourIndex} 
            borderBottom="1px solid" 
            borderColor="gray.200" 
          >
            <Flex 
              w="40px" 
              justify="center" 
              align="center" 
              fontSize="sm"
              color="gray.400"
              fontWeight="medium"
              flexShrink={0}
            >
              {hour}
            </Flex>

            <Flex flex={1} >
              {Array.from({ length: SLOTS_PER_HOUR }, (_, slotIdx) => {
                const globalIndex = hourIndex * SLOTS_PER_HOUR + slotIdx;
                const subject = gridState[globalIndex];
                const colors = subject ? SUBJECT_COLORS[subject] : null;

                const isDimmed = highlightSubject && subject && subject !== highlightSubject;
                const opacity = isDimmed ? 0.2 : 1;

                return (
                  <Box
                    key={slotIdx}
                    flex={1}
                    borderRight="1px solid"
                    borderColor="gray.100"
                    bg={colors ? colors.bg : 'transparent'}
                    opacity={opacity}
                    transition="opacity 0.15s"
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