import { Flex, Text } from '@chakra-ui/react';

interface Props {
  label: string;
  count: number;
}

export const StatCard = ({ label, count }: Props) => {
  return (
    <Flex
      display="flex"
      alignItems="center"
      gap="6px"
    >
      <Text
        fontSize="18px"
        fontWeight="600"
        fontStyle="normal"
        lineHeight="normal"
        color="#373E56"
      >
        {label}
      </Text>

      <Flex
        display="flex"
        height="22px"
        padding="1px 13px"
        justify-content="center"
        align-items="center"
        gap="8px"
        borderRadius="11px"
        bg="#373E56"
      >
        <Text color="white"
          fontWeight="600"
          fontSize="16px"
          fontStyle="normal"
          lineHeight="1.2"
        >
          {count}
        </Text>
      </Flex>
    </Flex >
  );
};