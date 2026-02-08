import { Flex, IconButton, Text, Box } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationBell } from '@/widgets/notifications/NotificationBell';
import { useAuthStore } from '@/shared/stores/authStore';

export const MobileHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const mainTabPaths = [
    '/mentee/planner', 
    '/mentee/feedback', 
    '/mentee/calendar',
    '/mentee/mypage',
    '/mentor',
    '/mentor/mentee',
    '/mentor/mypage'
  ];

  const isMainTab = mainTabPaths.some(path => location.pathname === path);

  const menteeHeaderPaths = [
    '/mentee/planner',
    '/mentee/feedback',
    '/mentee/calendar',
    '/mentee/mypage',
  ];
  const showNotificationBell =
    user?.role === 'MENTEE' && menteeHeaderPaths.includes(location.pathname);

  let title = "";
  if (location.pathname.includes('planner')) title = "";
  if (location.pathname.includes('calendar')) title = "달력";
  if (location.pathname.includes('feedback')) title = "피드백";
  if (location.pathname.includes('mypage')) title = "마이페이지";
  if (location.pathname.includes('notifications')) title = "알림";
  if (location.pathname.includes('task')) title = "과제 상세";
  if (location.pathname.includes('mentee') && location.pathname.includes('mentor')) title = "학생 관리";

  return (
    <Flex
      as="header"
      position="fixed"
      top={0} left={0} right={0}
      h="4.5625rem"
      bg={'white'}
      align="center"
      justify="center"
      zIndex={1100} 
      borderBottomRadius={(location.pathname.includes('planner')) ? "none" : "lg"}
      boxShadow={(location.pathname.includes('planner')) ? "none" : "sm"}
      px={4}
    >
      {!isMainTab && (
        <IconButton
          icon={<ChevronLeftIcon w={7} h={7} />}
          variant="ghost"
          aria-label="Back"
          position="absolute"
          left={1}
          onClick={() => navigate(-1)}
          isRound
          color="gray.600"
        />
      )}
      <Text fontSize="1.25rem" fontWeight="bold" color="gray.800">
        {title}
      </Text>
      <Box position="absolute" right={2}>
        <NotificationBell isVisible={showNotificationBell} />
      </Box>
    </Flex>
  );
};
