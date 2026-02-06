import { Flex, IconButton, Text } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useAuthStore } from '@/shared/stores/authStore';

interface Props {
  onToggleSidebar: () => void;
  isCollapsed: boolean;
}

export const DesktopHeader = ({ onToggleSidebar, isCollapsed }: Props) => {
  const { user } = useAuthStore();
  const sidebarWidth = isCollapsed ? '80px' : '280px';

  return (
    <Flex
      as="header"
      h="80px"
      bg="#fff"
      pl={`calc(${sidebarWidth} + 28px)`}
      transition="padding-left 0.3s ease"
      alignItems="center"
      justifyContent="space-between"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      pointerEvents="none"
    >
      <Text
        fontFamily="Pretendard"
        fontSize="20px"
        fontWeight="600"
        color="#394250"
        lineHeight="normal"
        pointerEvents="auto"
      >
        어서오세요, <Text as="span" color="#52A8FE">{user?.name}</Text>
        {user?.role === 'MENTOR' ? '멘토님!' : '님!'}
      </Text>
      <IconButton
        icon={<HamburgerIcon w={6} h={6} />}
        mr="24px"
        aria-label="Toggle Sidebar"
        onClick={onToggleSidebar}
        bg="white"
        boxShadow="0px 2px 5px rgba(0,0,0,0.1)"
        borderRadius="full"
        size="lg"
        _hover={{ bg: 'gray.50' }}
        pointerEvents="auto"
      />
    </Flex>
  );
};
