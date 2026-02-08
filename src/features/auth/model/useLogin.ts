import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';
import { authApi } from '../api/authApi';
import { useToast } from '@chakra-ui/react';
import { useApiMutation } from '@/shared/hooks/useApiMutation';
import { isRecord } from '@/shared/api/parse';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login); 
  const toast = useToast();

  const { mutate, isLoading } = useApiMutation(authApi.login);

  const login = async (loginIdInput: string, passwordInput: string) => {
    try {
      const { user, token } = await mutate({ 
        username: loginIdInput, 
        password: passwordInput 
      });

      setAuth(user, token); 

      toast({ 
        title: '로그인 성공', 
        description: `${user.name}님 환영합니다.`,
        status: 'success', 
        duration: 2000 
      });

      if (user.role === 'MENTOR') {
        navigate('/mentor'); 
      } else {
        navigate('/mentee/planner');
      }
    } catch (error: unknown) {
      const errorCode =
        isRecord(error) && typeof error.code === 'string'
          ? error.code
          : 'AUTH_INVALID_CREDENTIALS';
      let message = '아이디 또는 비밀번호를 확인해주세요.';

      if (errorCode === 'AUTH_TOKEN_EXPIRED') {
        message = '세션이 만료되었습니다. 다시 로그인해주세요.';
      }

      toast({ 
        title: '로그인 실패', 
        description: message, 
        status: 'error',
        duration: 3000
      });
    }
  };

  return { login, isLoading };
};
