// src/widgets/main-layout/MainLayout.tsx
import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';
import { getNavItems } from './navConfig';

// PC Widgets
import { DesktopHeader } from './desktop/DesktopHeader';
import { DesktopSidebar } from './desktop/DesktopSidebar';

// Mobile Widgets
import { MobileHeader } from './mobile/MobileHeader';
import { MobileBottomNav } from './mobile/MobileBottomNav';

export const MainLayout = () => {
  const { user } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  const navItems = getNavItems(user.role);
  const sidebarWidth = isCollapsed ? '80px' : '280px';

  return (
    <Box minH="100vh">
      <Box display={{ base: 'none', md: 'block' }}>
        <DesktopHeader
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          isCollapsed={isCollapsed}
        />
        <DesktopSidebar isCollapsed={isCollapsed} />
        <Box
          ml={sidebarWidth}
          mt="0"
          pt="90px"
          minH="100vh"
          transition="margin-left 0.3s ease"
        >
          <Outlet />
        </Box>
      </Box>

      <Box display={{ base: 'block', md: 'none' }}>
        <MobileHeader />

        <Box pt="56px" pb="64px" px={0} minH="100vh" bg="white">
          <Outlet />
        </Box>

        <MobileBottomNav navItems={navItems} />
      </Box>
    </Box>
  );
};
