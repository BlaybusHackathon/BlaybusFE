import { Flex, Text } from '@chakra-ui/react';
import { useAuthStore } from '@/shared/stores/authStore';

interface Props {
  isCollapsed: boolean;
}

export const DesktopHeader = ({ isCollapsed }: Props) => {
  const { user } = useAuthStore();
  const sidebarWidth = isCollapsed ? '80px' : '280px';

  return (
    <Flex
      as="header"
      h="80px"
      bg="#fff"
      pl={`calc(${sidebarWidth} + 28px)`} // 사이드바 너비에 맞춰 유동적으로 변화
      transition="padding-left 0.3s ease"
      alignItems="center"
      justifyContent="flex-start"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
    >
      <Text
        fontFamily="Pretendard"
        fontSize="20px"
        fontWeight="600"
        color="#394250"
        lineHeight="normal"
      >
        어서오세요, <Text as="span" color="#52A8FE">{user?.name}</Text>
        {user?.role === 'MENTOR' ? '멘토님!' : '님!'}
      </Text>
    </Flex>
  );
};