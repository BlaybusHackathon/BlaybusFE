import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';
import { MOCK_USERS } from './mockUsers'; 
import { useToast } from '@chakra-ui/react';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login); 
  const toast = useToast();

  const login = async (loginIdInput: string, passwordInput: string) => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = MOCK_USERS.find(
      (u) => u.username === loginIdInput && u.password === passwordInput
    );

    if (foundUser) {
      const { password, ...userInfo } = foundUser;
      
      setAuth(userInfo); 

      toast({ 
        title: '로그인 성공', 
        description: `${userInfo.name}님 환영합니다.`,
        status: 'success', 
        duration: 2000 
      });

      if (userInfo.role === 'MENTOR') {
        navigate('/mentor'); 
      } else {
        navigate('/mentee/planner');
      }
    } else {
      toast({ 
        title: '로그인 실패', 
        description: '아이디 또는 비밀번호를 확인해주세요.', 
        status: 'error',
        duration: 3000
      });
    }

    setIsLoading(false);
  };

  return { login, isLoading };
};