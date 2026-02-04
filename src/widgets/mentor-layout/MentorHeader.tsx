import { Flex, Text, HStack, Image } from '@chakra-ui/react';
import { useAuthStore } from '@/shared/stores/authStore';

export const MentorHeader = () => {
  const { user } = useAuthStore();

  return (
    <Flex
      as="header"
      h="60px"
      px={6}
      align="center"
      justify="space-between"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={100}
    >
      <HStack spacing={4}>
        <Text 
          fontSize="xl" 
          fontWeight="black" 
          color="blue.600"
          cursor="pointer"
          onClick={() => window.location.href = '/mentor'}
        >
          SeolStudy
        </Text>
        
        <Text fontSize="md" color="gray.700">
          어서오세요, <Text as="span" fontWeight="bold">{user?.name}</Text>멘토님!
        </Text>
      </HStack>
    </Flex>
  );
};