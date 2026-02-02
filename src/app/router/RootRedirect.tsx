import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';

export const RootRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();

  // 1. 비로그인 상태면 로그인 페이지로
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. 로그인 상태면 역할에 따라 분기
  if (user?.role === 'MENTOR') {
    return <Navigate to="/mentor/dashboard" replace />;
  }

  if (user?.role === 'MENTEE') {
    return <Navigate to="/mentee/planner" replace />;
  }

  // 3. 예외 상황 (역할 없음 등) -> 안전하게 로그인으로
  return <Navigate to="/login" replace />;
};