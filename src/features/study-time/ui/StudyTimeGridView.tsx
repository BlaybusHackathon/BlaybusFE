import { Box, Flex } from '@chakra-ui/react';
import { Subject, SUBJECT_COLORS } from '@/shared/constants/subjects'; // [수정] Subject 타입 import 추가
import { 
  TOTAL_HOURS, 
  SLOTS_PER_HOUR,
  DAY_START_HOUR 
} from '@/shared/constants/studyTime';
import { GridSlotItem } from '../model/studyTimeUtils';

interface Props {
  gridState: GridSlotItem[][];
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
            {/* 시간 라벨 */}
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

            {/* 그리드 슬롯 영역 */}
            <Flex flex={1}>
              {Array.from({ length: SLOTS_PER_HOUR }, (_, slotIdx) => {
                const globalIndex = hourIndex * SLOTS_PER_HOUR + slotIdx;
                const slotItems = gridState[globalIndex] || [];

                return (
                  <Box
                    key={slotIdx}
                    flex={1}
                    borderRight="1px solid"
                    borderColor="gray.50"
                    position="relative"
                    overflow="hidden"
                  >
                    {slotItems.map((item, idx) => {
                      // [추가] 하이라이트 로직 적용
                      // highlightSubject가 있는데 내 과목과 다르면 흐리게(0.2), 아니면 기본(0.8)
                      const isDimmed = highlightSubject && item.subject !== highlightSubject;
                      const opacity = isDimmed ? 0.2 : 0.8;

                      return (
                        <Box
                          key={idx}
                          position="absolute"
                          top="0"
                          bottom="0"
                          left={`${item.leftPercent}%`}
                          width={`${item.widthPercent}%`}
                          bg={SUBJECT_COLORS[item.subject]}
                          opacity={opacity} // [수정] 동적 투명도 적용
                        />
                      );
                    })}
                  </Box>
                );
              })}
            </Flex>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};