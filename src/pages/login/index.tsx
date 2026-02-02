import { Center, Box, Heading, Text, VStack } from '@chakra-ui/react';
import { LoginForm } from '@/features/auth';

const LoginPage = () => {
  return (
    <Center minH="100vh" bg="gray.50" p={4}>
      <Box
        w="full"
        maxW="400px"
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="lg"
      >
        <VStack spacing={6} mb={8}>
          <Heading size="xl" color="blue.600">설스터디</Heading>
          <Text color="gray.600" fontSize="sm">
            서울대생 멘토와 함께하는 수능 코칭
          </Text>
        </VStack>

        <LoginForm />
      </Box>
    </Center>
  );
};

export default LoginPage;