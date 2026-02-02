import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleBasedRoute } from './RoleBasedRoute';
import { Loading } from '@/shared/ui/Loading';

export const MenteeLayout = () => {
  return (
    <ProtectedRoute>
      <RoleBasedRoute allowedRole="MENTEE">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </RoleBasedRoute>
    </ProtectedRoute>
  );
};