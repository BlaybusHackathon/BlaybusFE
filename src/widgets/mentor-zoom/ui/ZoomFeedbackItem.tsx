import { Flex, Text, Icon, Box } from '@chakra-ui/react';
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
  summary,
  meetingDate,
  onClick,
  menteeName = "최연준" // Default for now if not passed
}: Props) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      p="16px 24px"
      borderRadius="7px"
      bg="#F7F8FA"
      cursor="pointer"
      transition="all 0.2s"
      role="group"
      onClick={onClick}
      _hover={{
        bg: 'gray.100',
      }}
    >
      <Text
        fontSize="16px"
        fontWeight="600"
        color="gray.700"
      >
        {menteeName}
      </Text>

      <Flex align="center" gap={4}>
        <Text fontSize="16px" fontWeight="600" color="gray.700">
          {getOrdinal(countNumber)}
        </Text>

        <Icon
          as={ChevronRightIcon}
          w={5} h={5}
          color="gray.400"
        />
      </Flex>
    </Flex>
  );
};