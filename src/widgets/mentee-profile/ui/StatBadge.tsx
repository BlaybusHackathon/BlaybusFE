import { Flex, Text } from '@chakra-ui/react';

interface Props {
  label: string;
  value: number;
}

export const StatBadge = ({ label, value }: Props) => {
  return (
    <Flex display="flex" alignItems="center" gap="8px">
      <Text
        fontSize={{ base: "md", md: "18px" }}
        fontWeight="bold"
        color="gray.600"
        whiteSpace="nowrap"
      >
        {label}
      </Text>

      <Flex
        padding={{ base: "1px 13px", md: "1px 13px" }}
        bg="#373E56"
        borderRadius="11px"
        align="center"
        justify="center"
      >
        <Text color="white" fontWeight="semibold" height="22px" fontSize={{ base: "sm", md: "16px" }}>
          {value}
        </Text>
      </Flex>
    </Flex>
  );
};