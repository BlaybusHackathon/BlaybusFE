import { Box, VStack } from '@chakra-ui/react';
import { SeolStudyLogo } from '@/shared/ui/SeolStudyLogo';

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
      w={isCollapsed ? '80px' : '280px'}
      h="100vh"
      bg="white"
      borderRight="6px solid #F7F7F7"
      position="fixed"
      top={0}
      left={0}
      overflowY="auto"
      transition="width 0.3s ease"
      zIndex="1100"
      css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': {
          background: 'gray.300',
          borderRadius: '4px',
        },
      }}
    >
      <VStack spacing={1} align="stretch" p={2}>
        <Box h="64px" display="flex" alignItems="center" justifyContent="center" mb={4}>
          {isCollapsed ? (
            <SeolStudyLogo w="40px" h="auto" />
          ) : (
            <SeolStudyLogo w="140px" h="auto" />
          )}
        </Box>

        {role === 'MENTOR' && (
          <>
            {getNavItems('MENTOR').map((item) => (
              <SidebarMenuItem
                key={item.path}
                label={item.label}
                path={item.path}
                icon={<item.icon w={4} h={4} />}
                isCollapsed={isCollapsed}
              />
            ))}
            <MenteeListToggle mentees={MOCK_MENTEES} isCollapsed={isCollapsed} />
          </>
        )}

        {role === 'MENTEE' && (
          <>
            {menteeNavItems.map((item) => (
              <SidebarMenuItem
                key={item.path}
                label={item.label}
                path={item.path}
                icon={<item.icon w={4} h={4} />}
                isCollapsed={isCollapsed}
              />
            ))}
          </>
        )}
      </VStack>
    </Box>
  );
};
