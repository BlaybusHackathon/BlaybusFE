import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: clearAuth } = useAuthStore();

  const logout = () => {
    clearAuth();
    
    navigate('/login', { replace: true });
  };

  return { logout };
};