import { Flex, Text } from '@chakra-ui/react';

interface Props {
  label: string;
  count: number;
}

export const StatCard = ({ label, count }: Props) => {
  return (
    <Flex
      p={5}
      align="center"
      gap={2}
      h="full"
    >
      <Text fontSize="md" fontWeight="bold" color="gray.600">
        {label}
      </Text>
      
      <Flex
        padding="1px 12px"
        bg="#373E56"
        borderRadius="full"
        align="center"
        justify="center"
      >
        <Text color="white" fontWeight="semibold" fontSize="16px">
          {count}
        </Text>
      </Flex>
    </Flex>
  );
};