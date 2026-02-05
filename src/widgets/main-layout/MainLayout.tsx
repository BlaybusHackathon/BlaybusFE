// src/widgets/main-layout/MainLayout.tsx
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
  
  if (!user) return null;

  const navItems = getNavItems(user.role);

  return (
    <Box minH="100vh">
      <Box display={{ base: 'none', md: 'block' }}>
        <DesktopHeader />
        <DesktopSidebar />
        <Box ml="240px" mt="60px" p={8} minH="calc(100vh - 60px)">
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