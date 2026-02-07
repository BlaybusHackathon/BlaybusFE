import { Flex, Text, Icon } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

interface Props {
  countNumber: number;
  summary: string;
  meetingDate: string;
  onClick: () => void;
  menteeName?: string; // Add optional prop
}

const getOrdinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const ZoomFeedbackItem = ({
  countNumber,
  onClick,
  menteeName = "최연준" // Default for now if not passed
}: Props) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      p="12px 16px"
      borderRadius="7"
      bg="#F7F8FA"
      cursor="pointer"
      transition="all 0.2s"
      role="group"
      onClick={onClick}
      _hover={{
        bg: '#EDF3FF',
      }}
    >
    <Text
      fontSize="16px"
      fontWeight="600"
      color="gray.700"
    >
      {menteeName}
    </Text>

      <Text fontSize="16px" fontWeight="600" color="gray.700">
        {getOrdinal(countNumber)}
      </Text>

      <Icon
        as={ChevronRightIcon}
        w={5} h={5}
        color="gray.400"
      />
    </Flex>
  );
};