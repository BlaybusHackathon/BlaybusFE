import { Flex, Text, Button } from '@chakra-ui/react';
import { useAuthStore } from '@/shared/stores/authStore';
import { useNavigate } from 'react-router-dom';

export const PlannerHeader = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex 
      bg="white" 
      p={4} 
      borderBottom="1px solid" 
      borderColor="gray.200"
      align="center"
      justify="space-between" 
    >
      <Text fontSize="lg" fontWeight="bold">일일 플래너</Text>
      
      <Button 
        size="xs" 
        variant="outline" 
        colorScheme="gray" 
        onClick={handleLogout}
      >
        로그아웃
      </Button>
    </Flex>
  );
};