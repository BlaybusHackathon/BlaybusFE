import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '@/shared/stores/authStore';
import { authApi } from '../api/authApi';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { login: setAuth } = useAuthStore();

  const login = async (id: string, pw: string) => {
    setIsLoading(true);

    try {
      const { user } = await authApi.login({ loginId: id, password: pw });
      
      setAuth(user);

      toast({
        title: '로그인 성공',
        description: `${user.name}님 환영합니다.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      const targetPath = user.role === 'MENTOR' ? '/mentor/dashboard' : '/mentee/planner';
      navigate(targetPath, { replace: true });

    } catch (error) {
      toast({
        title: '로그인 실패',
        description: '아이디 또는 비밀번호가 올바르지 않습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};