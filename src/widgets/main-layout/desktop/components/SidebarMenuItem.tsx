import { Flex, Text } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Props {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export const SidebarMenuItem = ({ label, path, icon }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname.startsWith(path);

  return (
    <Flex
      align="center"
      px={4}
      py={3}
      cursor="pointer"
      bg={isActive ? 'blue.50' : 'transparent'}
      color={isActive ? 'blue.600' : 'gray.700'}
      fontWeight={isActive ? 'bold' : 'normal'}
      borderRadius="md"
      _hover={{ bg: 'gray.100' }}
      onClick={() => navigate(path)}
      transition="all 0.2s"
    >
      {icon && <Flex mr={3}>{icon}</Flex>}
      <Text fontSize="sm">{label}</Text>
    </Flex>
  );
};