// src/widgets/main-layout/desktop/components/SidebarMenuItem.tsx

import { Flex, Text } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Props {
  label: string;
  path: string;
  icon?: React.ReactNode;
  isCollapsed: boolean;
}

export const SidebarMenuItem = ({ label, path, icon, isCollapsed }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname.startsWith(path);

  return (
    <Flex
      align="center"
      p={3}
      cursor="pointer"
      color={isActive ? 'blue.500' : 'gray.700'}
      fontWeight={isActive ? 'semibold' : 'normal'}
      borderRadius="md"
      onClick={() => navigate(path)}
      transition="all 0.2s"
      _hover={{
        bg: isActive ? 'blue.100' : 'gray.100',
      }}
      justify={isCollapsed ? 'center' : 'flex-start'}
    >
      {icon && (
        <Flex minW="20px" justify="center">
          {icon}
        </Flex>
      )}
      {!isCollapsed && (
        <Text ml={3} fontSize="sm">
          {label}
        </Text>
      )}
    </Flex>
  );
};
