import { Box, Flex } from '@chakra-ui/react';
import { Subject, SUBJECT_COLORS } from '@/shared/constants/subjects';
import { 
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
            borderColor="gray.100" 
            h="24px"
          >
            <Flex 
              w="40px" 
              justify="center" 
              align="center" 
              fontSize="xs"
              color="gray.400"
              fontWeight="medium"
              flexShrink={0}
              borderRight="1px solid"
              borderColor="gray.100"
            >
              {hour}
            </Flex>

            <Flex flex={1}>
              {Array.from({ length: SLOTS_PER_HOUR }, (_, slotIdx) => {
                const globalIndex = hourIndex * SLOTS_PER_HOUR + slotIdx;
                const subject = gridState[globalIndex];
                
                const hexColor = subject ? SUBJECT_COLORS[subject] : null;
                
                const isDimmed = highlightSubject && subject && subject !== highlightSubject;
                const opacity = isDimmed ? 0.2 : 1;

                return (
                  <Box
                    key={slotIdx}
                    flex={1}
                    borderRight="1px solid"
                    borderColor="gray.50"
                    bg={hexColor || 'transparent'}
                    opacity={opacity}
                    transition="all 0.2s"
                    _hover={{
                      opacity: hexColor ? 0.8 : 1,
                      bg: hexColor || 'gray.50', 
                    }}
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