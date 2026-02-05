import { Flex, IconButton, Text } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenteeHeaderProps {
  title: string;
}

export const MenteeHeader = ({ title }: MenteeHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 홈 화면('/mentee/home')에서는 뒤로가기 버튼 숨김
  // 현재 홈 경로가 라우터에 없으므로, 필요시 조건 수정
  const isHome = location.pathname === '/mentee/home';

  return (
    <Flex
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      height="56px"
      bg="white"
      align="center"
      justify="center"
      borderBottom="1px solid"
      borderColor="gray.100"
      zIndex={1000} // 콘텐츠보다 위에 오도록
      px={4}
    >
      {!isHome && (
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