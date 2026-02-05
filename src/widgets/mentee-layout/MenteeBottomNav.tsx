import { Box, Flex, Text, VStack, Icon } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
// chakra-ui icons 혹은 react-icons 사용
import { CalendarIcon, ChatIcon, SettingsIcon, TimeIcon } from '@chakra-ui/icons'; 

export const MenteeBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const NAV_ITEMS = [
    // 플래너는 레이아웃 밖이지만 진입점은 필요함
    { label: '플래너', icon: CalendarIcon, path: '/mentee/planner' },
    // 피드백 모아보기 (가칭)
    { label: '피드백', icon: ChatIcon, path: '/mentee/feedback' },
    // 마이페이지
    { label: 'MY', icon: SettingsIcon, path: '/mentee/mypage' },
  ];

  return (
    <Box
      as="nav"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      borderTop="1px solid"
      borderColor="gray.100"
      height="64px"
      zIndex={1000}
      pb="safe-area-inset-bottom" // 아이폰 하단 바 대응
    >
      <Flex justify="space-around" align="center" h="full">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const color = isActive ? "blue.500" : "gray.400";

          return (
            <VStack 
              key={item.label} 
              spacing={1} 
              cursor="pointer" 
              onClick={() => navigate(item.path)}
              w="full"
              justify="center"
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