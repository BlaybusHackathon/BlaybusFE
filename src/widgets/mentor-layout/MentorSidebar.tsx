import { Box, VStack, Divider } from '@chakra-ui/react';
import { SidebarMenuItem } from './SidebarMenuItem';
import { MenteeListToggle } from './MenteeListToggle';
import { MenteeNavItem } from './types';

// 추후 API 연동 시 제거
const MOCK_MENTEES: MenteeNavItem[] = [
  { id: 'mentee-1', name: '홍길동' },
  { id: 'mentee-2', name: '김철수' },
];

export const MentorSidebar = () => {
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
        <SidebarMenuItem label="마이페이지" path="/mentor" />
        
        <Divider my={2} borderColor="gray.200" />
        
        <MenteeListToggle mentees={MOCK_MENTEES} />
      </VStack>
    </Box>
  );
};