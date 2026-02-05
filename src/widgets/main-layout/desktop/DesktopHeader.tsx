// src/widgets/main-layout/desktop/DesktopHeader.tsx
import { Flex, Text, HStack, Button } from '@chakra-ui/react';
import { useAuthStore } from '@/shared/stores/authStore';
import { useNavigate } from 'react-router-dom';

export const DesktopHeader = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (user?.role === "MENTOR") navigate('/mentor');
    else navigate('/mentee/planner');
  };

  return (
    <Flex
      as="header"
      h="60px"
      px={6}
      align="center"
      justify="space-between"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={100}
    >
      <HStack spacing={4}>
        <Text 
          fontSize="xl" 
          fontWeight="black" 
          color="blue.600"
          cursor="pointer"
          onClick={handleLogoClick}
        >
          SeolStudy
        </Text>
        <Text fontSize="md" color="gray.700">
          어서오세요, <Text as="span" fontWeight="bold">{user?.name}</Text>
          {user?.role === "MENTOR" ? '멘토님!' : '님!'}
        </Text>
      </HStack>

      <Button 
        size="sm" 
        variant="ghost" 
        colorScheme="red" 
        onClick={handleLogout}
      >
        로그아웃
      </Button>
    </Flex>
  );
};