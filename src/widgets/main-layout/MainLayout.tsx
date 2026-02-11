import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore, isTokenValid, logoutAndClear } from '@/shared/stores/authStore';
import { getNavItems } from './navConfig';
import { useFcmRegistration } from '@/features/notification/model/useFcmRegistration';
import { userApi } from '@/features/user/api/userApi';
import { Loading } from '@/shared/ui/Loading';
import { onForegroundMessage } from '@/firebase';
import { notificationApi } from '@/features/notification/api/notificationApi';
import { useNotificationStore } from '@/shared/stores/notificationStore';

// PC Widgets
import { DesktopHeader } from './desktop/DesktopHeader';
import { DesktopSidebar } from './desktop/DesktopSidebar';

// Mobile Widgets
import { MobileHeader } from './mobile/MobileHeader';
import { MobileBottomNav } from './mobile/MobileBottomNav';

export const MainLayout = () => {
  const { user, token, isAuthenticated, setUser } = useAuthStore();
  const { setUnreadCount } = useNotificationStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const tokenValid = isTokenValid(token);
  useFcmRegistration();

  useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      if (!tokenValid) {
        logoutAndClear();
        if (!cancelled) setIsBootstrapping(false);
        return;
      }

      if (!user) {
        try {
          const me = await userApi.getMe();
          if (!cancelled) setUser(me);
        } catch {
          logoutAndClear();
        }
      }

      if (!cancelled) setIsBootstrapping(false);
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [tokenValid, user, setUser]);

  useEffect(() => {
    if (!tokenValid || !user) return;
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;

    const setup = async () => {
      const unsub = await onForegroundMessage(() => {
        if (!isTokenValid(token)) return;
        notificationApi
          .getUnreadCount()
          .then((count) => {
            if (!cancelled) setUnreadCount(count);
          })
          .catch(() => {});
      });
      if (!cancelled) unsubscribe = unsub;
    };

    setup();
    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, [setUnreadCount, token, tokenValid, user]);

  if (!isAuthenticated || !tokenValid) {
    return <Navigate to="/login" replace />;
  }

  if (isBootstrapping) {
    return <Loading />;
  }

  if (!user) return null;

  const navItems = getNavItems(user.role);
  const sidebarWidth = isCollapsed ? '80px' : '280px';

  return (
    <Box minH="100vh">
      <Box display={{ base: 'none', md: 'block' }}>
        <DesktopHeader isCollapsed={isCollapsed} />
        <DesktopSidebar
          isCollapsed={isCollapsed}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />
      </Box>

      <Box display={{ base: 'block', md: 'none' }}>
        <MobileHeader />
      </Box>

      <Box
        ml={{ base: 0, md: sidebarWidth }}
        mt="0"
        pt={{ base: '4.5rem', md: '90px' }}
        pb={{ base: '64px', md: 0 }}
        px={0}
        minH="100vh"
        transition="margin-left 0.3s ease"
        bg={{ base: '#F9F9FB', md: 'white' }}
      >
        <Outlet />
      </Box>

      <Box display={{ base: 'block', md: 'none' }}>
        <MobileBottomNav navItems={navItems} />
      </Box>
    </Box>
  );
};
