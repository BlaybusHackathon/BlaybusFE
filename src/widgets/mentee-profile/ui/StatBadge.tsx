import { Flex, Text } from '@chakra-ui/react';

interface Props {
  label: string;
  value: number; 
}

export const StatBadge = ({ label, value }: Props) => {
  return (
    <Flex align="center" gap={2} w="fit-content">
      <Text 
        fontSize={{ base: "12px", md: "md" }} 
        fontWeight="bold" 
        color="gray.600" 
        whiteSpace="nowrap" 
      >
        {label}
      </Text>
      
      <Flex
        padding={{ base: "1px 8px", md: "1px 12px" }}
        bg="#373E56"
        borderRadius="full"
        align="center"
        justify="center"
      >
        <Text color="white" fontWeight="semibold" fontSize={{ base: "12px", md: "16px" }}>
          {value}
        </Text>
      </Flex>
    </Flex>
  );
};