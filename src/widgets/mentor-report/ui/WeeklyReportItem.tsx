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
      p={{base:("6px 24px"), md:("12px 16px")}}
      borderRadius="7"
      transition="all 0.2s"
      role="group"
      cursor={isFuture ? 'not-allowed' : 'pointer'}
      onClick={isFuture ? undefined : onClick}
      bg={isFuture ? 'none' : '#EDF3FF'}
      color={isFuture ? '#939497ff' : '#373E56'}
      _hover={!isFuture ? {
        bg: 'gray.100',
      } : undefined}
    >
      <Flex gap={{base:20, md:10}}>
        <Text
          fontSize="16px"
          fontWeight="600"
        >
          {weekNumber}주차
        </Text>

        <Text fontSize="15px" fontWeight="bold">
          {displayRange}
        </Text>
      </Flex>


        {!isFuture && (
          <Icon
            as={ChevronRightIcon}
            w={5} h={5}
            color="gray.400"
          />
        )}
    </Flex>
  );
};