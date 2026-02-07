// src/widgets/main-layout/desktop/components/SidebarMenuItem.tsx

import { Flex, Text, Box } from '@chakra-ui/react';
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
      py={3}
      pl={isCollapsed ? 3 : '44px'}
      pr={3}
      cursor="pointer"
      color={isActive ? '#52A8FE' : '#989898'}
      bg="transparent"
      fontWeight={isActive ? 'semibold' : 'normal'}
      borderRadius="md"
      onClick={() => navigate(path)}
      transition="all 0.2s"
      _hover={{
        bg: 'gray.100',
        color: isActive ? '#52A8FE' : 'gray.900'
      }}
      justify={isCollapsed ? 'center' : 'flex-start'}
    >
      <Flex align="center" width="100%">
        <Box w="24px" display="flex" justifyContent="center" alignItems="center">
          {icon}
        </Box>
        {!isCollapsed && (
          <Text ml="14px" fontSize="18px" fontWeight="700">
            {label}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
