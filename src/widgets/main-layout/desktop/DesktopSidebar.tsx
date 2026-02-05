// src/widgets/main-layout/desktop/DesktopSidebar.tsx
import { Box, VStack, Divider } from '@chakra-ui/react';
import { useAuthStore } from '@/shared/stores/authStore';
import { SidebarMenuItem } from './components/SidebarMenuItem';
import { MenteeListToggle } from './components/MenteeListToggle';
import { MenteeNavItem } from './components/MenteeMenuItem';
import { getNavItems } from '../navConfig';

const MOCK_MENTEES: MenteeNavItem[] = [
  { id: 'mentee-1', name: '홍길동' },
  { id: 'mentee-2', name: '김철수' },
];

export const DesktopSidebar = () => {
  const { user } = useAuthStore();
  const role = user?.role;

  // 멘티용 메뉴 아이템
  const menteeNavItems = getNavItems("MENTEE");

  return (
    <Box
      as="aside"
      w="240px"
      h="calc(100vh - 60px)"
      position="fixed"
      top="60px"
      left={0}
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      py={4}
      overflowY="auto"
      zIndex={90}
      css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { background: '#EDF2F7', borderRadius: '4px' },
      }}
    >
      <VStack align="stretch" spacing={1} px={2}>
        
        {/* === 1. MENTOR View === */}
        {role === "MENTOR" && (
          <>
            <SidebarMenuItem label="마이페이지" path="/mentor/mypage" />
            <Divider my={2} borderColor="gray.200" />
            <MenteeListToggle mentees={MOCK_MENTEES} />
          </>
        )}

        {/* === 2. MENTEE View === */}
        {role === "MENTEE" && (
          <>
             {menteeNavItems.map((item) => (
                <SidebarMenuItem 
                    key={item.path} 
                    label={item.label} 
                    path={item.path} 
                />
             ))}
          </>
        )}

      </VStack>
    </Box>
  );
};