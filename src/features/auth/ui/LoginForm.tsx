import { useState } from 'react';
import { VStack, Button, Text, useToast, Box } from '@chakra-ui/react';
import { useLogin } from '../model/useLogin';
import { Input } from '@/shared/ui/Input';

export const LoginForm = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useLogin();
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginId.trim()) {
      toast({ description: '아이디를 입력해주세요', status: 'warning', duration: 2000 });
      return;
    }
    if (!password.trim()) {
      toast({ description: '비밀번호를 입력해주세요', status: 'warning', duration: 2000 });
      return;
    }

    login(loginId, password);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="md" fontWeight="bold" color="#373E56" mb={2} ml={1}>아이디</Text>
          <Input
            placeholder=""
            value={loginId}
            bg={'white'}
            onChange={(e) => setLoginId(e.target.value)}
            isDisabled={isLoading}
            height="48px" 
            borderColor="#E0E5EB"
            borderRadius="9"
            _focus={{ borderColor: '#53A8FE', boxShadow: 'none' }}
            _hover={{ borderColor: '#53A8FE' }}
            color="#373E56"
            fontSize="lg"
            pl={6}
          />
        </Box>

        <Box>
          <Text fontSize="md" fontWeight="bold" color="#373E56" mb={2} ml={1}>비밀번호</Text>
          <Input
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isDisabled={isLoading}
            height="48px"
            borderColor="#E0E5EB"
            borderRadius="12px"
            _focus={{ borderColor: '#53A8FE', boxShadow: 'none' }}
            _hover={{ borderColor: '#53A8FE' }}
            color="#373E56"
            fontSize="lg"
            pl={6}
          />
        </Box>

        <Button
          type="submit"
          bg="#53A8FE"
          color="white"
          size="lg"
          height="55px"
          borderRadius="12px"
          fontSize="xl"
          fontWeight="bold"
          isLoading={isLoading}
          loadingText="로그인 중"
          mt={6}
          _hover={{ bg: '#4293E3' }}
          _active={{ bg: '#3178C6' }}
        >
          로그인
        </Button>
      </VStack>
    </form>
  );
};
