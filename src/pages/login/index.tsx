// import { Box, Heading, Text, Button } from '@chakra-ui/react';

// const LoginPage = () => {
//   return (
//     <Box p={10} textAlign="center">
//       <Heading mb={4}>로그인 페이지</Heading>
//     </Box>
//   );
// };

// export default LoginPage;

import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { useAuthStore } from '@/shared/stores/authStore';

const LoginPage = () => {
  const { login } = useAuthStore();

  const handleMenteeLogin = () => {
    login({ id: 'test-mentee', name: '학생1', role: 'MENTEE' });
  };

  const handleMentorLogin = () => {
    login({ id: 'test-mentor', name: '멘토1', role: 'MENTOR' });
  };

  return (
    <Box p={10} textAlign="center">
      <Heading mb={4}>🔑 로그인 테스트 페이지</Heading>
      <Text mb={8}>아래 버튼을 눌러 역할별 라우팅을 테스트하세요.</Text>
      
      <VStack spacing={4}>
        <Button colorScheme="blue" onClick={handleMenteeLogin}>
          멘티로 로그인 (Go to Mentee)
        </Button>
        <Button colorScheme="green" onClick={handleMentorLogin}>
          멘토로 로그인 (Go to Mentor)
        </Button>
      </VStack>
    </Box>
  );
};

export default LoginPage;