import { useState } from 'react';
import { VStack, Button, Text, useToast } from '@chakra-ui/react';
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
      <VStack spacing={4} align="stretch">
        <Input
          placeholder="아이디를 입력하세요"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          isDisabled={isLoading}
        />
        <Input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isDisabled={isLoading}
        />
        
        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          isLoading={isLoading}
          loadingText="로그인 중"
          mt={4}
        >
          로그인
        </Button>
        
        <Text fontSize="xs" color="gray.500" textAlign="center" mt={2}>
          테스트 계정: mentor1 / mentee1 (PW: 1234)
        </Text>
      </VStack>
    </form>
  );
};