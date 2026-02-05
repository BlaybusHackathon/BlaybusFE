import { Box, VStack } from '@chakra-ui/react';

import { useAuthStore } from '@/shared/stores/authStore';

import { SidebarMenuItem } from './components/SidebarMenuItem';
import { MenteeListToggle } from './components/MenteeListToggle';
import { MenteeNavItem } from './components/MenteeMenuItem';
import { getNavItems } from '../navConfig';

const MOCK_MENTEES: MenteeNavItem[] = [
  { id: 'mentee-1', name: '홍길동' },
  { id: 'mentee-2', name: '김철수' },
];

interface Props {
  isCollapsed: boolean;
}

export const DesktopSidebar = ({ isCollapsed }: Props) => {
  const { user } = useAuthStore();
  const role = user?.role;

  const menteeNavItems = getNavItems('MENTEE');

  return (
    <Box
      as="nav"
      w={isCollapsed ? '80px' : '240px'}
      h="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      position="fixed"
      top="64px"
      left={0}
      overflowY="auto"
      transition="width 0.3s ease"
      css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': {
          background: 'gray.300',
          borderRadius: '4px',
        },
      }}
    >
      <VStack spacing={1} align="stretch" p={2}>
        {/* === 1. MENTOR View === */}
        {role === 'MENTOR' && (
          <>
            {getNavItems('MENTOR').map((item) => (
              <SidebarMenuItem
                key={item.path}
                label={item.label}
                path={item.path}
                icon={<item.icon />}
                isCollapsed={isCollapsed}
              />
            ))}
            <MenteeListToggle mentees={MOCK_MENTEES} isCollapsed={isCollapsed} />
          </>
        )}

        {/* === 2. MENTEE View === */}
        {role === 'MENTEE' && (
          <>
            {menteeNavItems.map((item) => (
              <SidebarMenuItem
                key={item.path}
                label={item.label}
                path={item.path}
                icon={<item.icon />}
                isCollapsed={isCollapsed}
              />
            ))}
          </>
        )}
      </VStack>
    </Box>
  );
};
