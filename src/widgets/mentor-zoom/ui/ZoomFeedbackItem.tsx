import { Flex, Text, Icon } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';

interface Props {
  countNumber: number;
  meetingDate: string;
  onClick: () => void;
}

const getOrdinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const ZoomFeedbackItem = ({
  countNumber,
  meetingDate,
  onClick,
}: Props) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      py={{base:"1", md:"4"}}
      px={{base:"4", md:"6"}}
      borderRadius="7"
      cursor="pointer"
      transition="all 0.2s"
      role="group"
      onClick={onClick}
      _hover={{
        bg: '#EDF3FF',
      }}
    >
      <Text
        fontSize={{base:"0.875rem", md:"1.25rem"}}
        fontWeight="600"
        color="gray.800"
      >
        {getOrdinal(countNumber)}
      </Text>

      <Text fontSize={{base:"0.875rem", md:"1.25rem"}} color="gray.500" fontWeight="500">
        {format(new Date(meetingDate), 'yyyy.MM.dd')}
      </Text>
      <Icon
        as={ChevronRightIcon}
        w={5} h={5}
        color="gray.400"
        _groupHover={{ color: '#373E56' }}
      />
    </Flex>
  );
};