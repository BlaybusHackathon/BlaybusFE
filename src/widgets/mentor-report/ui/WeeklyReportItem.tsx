import { Flex, Box, Text, Icon } from '@chakra-ui/react';
import { ChevronRightIcon, AddIcon } from '@chakra-ui/icons';

interface Props {
  weekNumber: number;
  displayMonth: number;
  displayRange: string;
  status: 'PAST' | 'CURRENT' | 'FUTURE';
  hasReport: boolean;
  onClick: () => void;
}

export const WeeklyReportItem = ({
  weekNumber,
  displayMonth,
  displayRange,
  status,
  hasReport,
  onClick,
}: Props) => {
  const isCurrent = status === 'CURRENT';
  const isFuture = status === 'FUTURE';
  const isPast = status === 'PAST';

  return (
    <Flex
      align="center"
      justify="space-between"
      p={5}
      borderRadius="2xl"
      transition="all 0.2s"
      role="group"
      cursor={isFuture ? 'not-allowed' : 'pointer'}
      onClick={isFuture ? undefined : onClick}
      bg={isCurrent ? 'gray.700' : isFuture ? 'gray.50' : 'white'}
      border="1px solid"
      borderColor={isPast ? 'gray.100' : 'transparent'}
      opacity={isFuture ? 0.6 : 1}
      _hover={!isFuture ? {
        bg: isCurrent ? 'gray.600' : 'gray.50',
        transform: 'translateY(-2px)',
        boxShadow: 'sm'
      } : undefined}
    >
      <Box>
        <Flex align="center" gap={2} mb={1}>
          <Text 
            fontSize="md" 
            fontWeight="bold" 
            color={isCurrent ? 'white' : isFuture ? 'gray.400' : 'gray.800'}
          >
            {displayMonth}월 {weekNumber}주차
          </Text>
          
          {!hasReport && !isFuture && (
            <Flex 
              px={2} py={0.5} 
              bg={isCurrent ? 'whiteAlpha.300' : 'red.50'} 
              borderRadius="md"
            >
              <Text 
                fontSize="xs" 
                color={isCurrent ? 'white' : 'red.400'} 
                fontWeight="bold"
              >
                미작성
              </Text>
            </Flex>
          )}
        </Flex>
        
        <Text fontSize="sm" color={isCurrent ? 'gray.300' : 'gray.500'}>
          {displayRange}
        </Text>
      </Box>

      {!isFuture && (
        <Icon 
          as={hasReport ? ChevronRightIcon : AddIcon}
          w={hasReport ? 6 : 4} 
          h={hasReport ? 6 : 4}
          color={isCurrent ? 'white' : 'gray.400'}
          opacity={isCurrent ? 1 : 0}
          transform={isCurrent ? 'translateX(0)' : 'translateX(-10px)'}
          _groupHover={{ opacity: 1, transform: 'translateX(0)' }}
        />
      )}
    </Flex>
  );
};