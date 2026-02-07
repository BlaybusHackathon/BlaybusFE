import { Flex, Text, Icon } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

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
  displayRange,
  status,
  onClick,
}: Props) => {
  const isFuture = status === 'FUTURE';

  return (
    <Flex
      align="center"
      justify="space-between"
      p="16px 24px"
      borderRadius="7px"
      transition="all 0.2s"
      role="group"
      cursor={isFuture ? 'not-allowed' : 'pointer'}
      onClick={isFuture ? undefined : onClick}
      bg={isFuture ? 'white' : '#F7F8FA'}
      color={isFuture ? '#939497ff' : '#373E56'}
      _hover={!isFuture ? {
        bg: 'gray.100',
      } : undefined}
    >
      <Text
        fontSize="16px"
        fontWeight="600"
      >
        {weekNumber}주차
      </Text>

      <Flex align="center" gap={4}>
        <Text fontSize="15px" fontWeight="500">
          {displayRange}
        </Text>

        {!isFuture && (
          <Icon
            as={ChevronRightIcon}
            w={5} h={5}
            color="gray.400"
          />
        )}
      </Flex>
    </Flex>
  );
};