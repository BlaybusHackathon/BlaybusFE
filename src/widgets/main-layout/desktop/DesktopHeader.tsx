import { Flex, Text, HStack, Button, IconButton } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useAuthStore } from '@/shared/stores/authStore';
import { useNavigate } from 'react-router-dom';

interface Props {
  onToggleSidebar: () => void;
}

export const DesktopHeader = ({ onToggleSidebar }: Props) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (user?.role === 'MENTOR') navigate('/mentor');
    else navigate('/mentee/planner');
  };

  return (
    <Flex
      as="header"
      h="64px"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      px={4}
      alignItems="center"
      justifyContent="space-between"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={999}
    >
      <HStack spacing={4}>
        <IconButton
          icon={<HamburgerIcon />}
          aria-label="Toggle Sidebar"
          onClick={onToggleSidebar}
          variant="ghost"
          size="md"
        />
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="blue.500"
          cursor="pointer"
          onClick={handleLogoClick}
        >
          SeolStudy
        </Text>
      </HStack>

      <HStack spacing={4}>
        <Text fontSize="sm" color="gray.600">
          어서오세요, {user?.name}
          {user?.role === 'MENTOR' ? '멘토님!' : '님!'}
        </Text>
        <Button size="sm" colorScheme="blue" variant="outline" onClick={handleLogout}>
          로그아웃
        </Button>
      </HStack>
    </Flex>
  );
};
