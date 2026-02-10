import { Box, Flex, VStack, Icon, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavItem } from '../navConfig';

interface MobileBottomNavProps {
  navItems: NavItem[];
}

export const MobileBottomNav = ({ navItems }: MobileBottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      as="nav"
      position="fixed"
      bottom={0}
      left={0}
      w="100%"
      maxW="100%"
      bg="white"
      borderTop="1px solid"
      borderTopRadius={22}
      borderColor="gray.100"
      height="64px"
      zIndex={1100}
      pb="safe-area-inset-bottom"
    >
      <Flex justify="space-between" align="center" h="full" w="full">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const color = isActive ? "gray.800" : "gray.400";

          return (
            <VStack 
              key={item.path} 
              spacing={1} 
              cursor="pointer" 
              onClick={() => navigate(item.path)}
              justify="center"
              flex="1"
              minW={0}
            >
              <Icon as={item.icon} boxSize={5} color={color} />
              <Text fontSize="10px" color={color} fontWeight={isActive ? "bold" : "medium"}>
                {item.label}
              </Text>
            </VStack>
          );
        })}
      </Flex>
    </Box>
  );
};
