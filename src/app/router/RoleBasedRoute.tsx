import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';
import { UserRole } from '@/shared/constants/enums';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleBasedRoute = ({ children, allowedRole }: RoleBasedRouteProps) => {
  const { user } = useAuthStore();

  if (!user || user.role !== allowedRole) {
    const redirectPath = user?.role === 'MENTOR' ? '/mentor' : '/mentee/planner';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};