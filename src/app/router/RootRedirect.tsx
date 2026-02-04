import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';

export const RootRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'MENTOR') {
    return <Navigate to="/mentor" replace />;
  }

  if (user?.role === 'MENTEE') {
    return <Navigate to="/mentee/planner" replace />;
  }

  return <Navigate to="/login" replace />;
};