import { Flex, IconButton, Text } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';

export const MobileHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainTabPaths = [
    '/mentee/planner', 
    '/mentee/feedback', 
    '/mentee/mypage',
    '/mentor',
    '/mentor/mentee',
    '/mentor/mypage'
  ];

  const isMainTab = mainTabPaths.some(path => location.pathname === path);

  let title = "Math Mentor";
  if (location.pathname.includes('planner')) title = "학습 플래너";
  if (location.pathname.includes('feedback')) title = "피드백";
  if (location.pathname.includes('mypage')) title = "마이페이지";
  if (location.pathname.includes('task')) title = "과제 상세";
  if (location.pathname.includes('mentee') && location.pathname.includes('mentor')) title = "학생 관리";

  return (
    <Flex
      as="header"
      position="fixed"
      top={0} left={0} right={0}
      height="56px"
      bg="white"
      align="center"
      justify="center"
      borderBottom="1px solid"
      borderColor="gray.100"
      zIndex={1100} 
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
      <Text fontSize="17px" fontWeight="bold" color="gray.800">
        {title}
      </Text>
    </Flex>
  );
};