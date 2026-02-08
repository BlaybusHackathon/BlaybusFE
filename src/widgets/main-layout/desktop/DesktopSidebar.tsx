import { Box, VStack, HStack, Text, Icon } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { SeolStudyLogo } from '@/shared/ui/SeolStudyLogo';
import { useAuthStore } from '@/shared/stores/authStore';
import { SidebarMenuItem } from './components/SidebarMenuItem';
import { MenteeListToggle } from './components/MenteeListToggle';
import { MenteeNavItem } from './components/MenteeMenuItem';
import { getNavItems } from '../navConfig';
import { FiLogOut } from 'react-icons/fi';
import { mentoringApi } from '@/features/mentoring/api/mentoringApi';

// [추가 1] 페이지 이동을 위한 훅 import
import { useNavigate } from 'react-router-dom';

interface Props {
  isCollapsed: boolean;
}

export const DesktopSidebar = ({ isCollapsed }: Props) => {
  const { user, logout } = useAuthStore();
  const role = user?.role;
  const [mentees, setMentees] = useState<MenteeNavItem[]>([]);

  // [추가 2] navigate 함수 생성
  const navigate = useNavigate();

  const menteeNavItems = getNavItems('MENTEE');

  useEffect(() => {
    if (role !== 'MENTOR') return;
    let active = true;
    mentoringApi
      .listMentees({ page: 0, size: 200 })
      .then((list) => {
        if (!active) return;
        setMentees(list);
      })
      .catch(() => {
        if (!active) return;
        setMentees([]);
      });
    return () => {
      active = false;
    };
  }, [role]);

  const handleLogout = () => {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
      logout(); 
      navigate('/login'); 
    }
  };

  return (
    <Box
      as="nav"
      w={isCollapsed ? '80px' : '280px'}
      h="100vh"
      bg="white"
      borderRight="6px solid #F7F7F7"
      position="fixed"
      top={0}
      left={0}
      zIndex="1100"
      transition="width 0.3s ease"
      display="flex"
      flexDirection="column"
    >
      <Box
        flex={1}
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': {
            background: '#CBD5E0',
            borderRadius: '4px',
          },
        }}
      >
        <VStack spacing={8} align="stretch" p={2} mt={8}>
          <Box h="64px" display="flex" alignItems="center" justifyContent="center" mb={4}>
            {isCollapsed ? (
              <SeolStudyLogo w="40px" h="auto" />
            ) : (
              <SeolStudyLogo w="140px" h="auto" />
            )}
          </Box>

          {role === 'MENTOR' && (
            <>
              {getNavItems('MENTOR').map((item) => (
                <SidebarMenuItem
                  key={item.path}
                  label={item.label}
                  path={item.path}
                  icon={<item.icon width={24} height={24} />}
                  isCollapsed={isCollapsed}
                />
              ))}
              <MenteeListToggle mentees={mentees} isCollapsed={isCollapsed} />
            </>
          )}

          {role === 'MENTEE' && (
            <>
              {menteeNavItems.map((item) => (
                <SidebarMenuItem
                  key={item.path}
                  label={item.label}
                  path={item.path}
                  icon={<item.icon width={24} height={24}  />}
                  isCollapsed={isCollapsed}
                />
              ))}
            </>
          )}
        </VStack>
      </Box>

      <Box p={2} borderTop="1px solid" borderColor="gray.100" bg="white">
        <HStack
          onClick={handleLogout}
          w="full"
          h="48px"
          px={isCollapsed ? 0 : 4}
          justify={isCollapsed ? 'center' : 'flex-start'}
          borderRadius="lg"
          cursor="pointer"
          color="gray.500"
          transition="all 0.2s"
          _hover={{
            bg: 'red.50',
            color: 'red.500',
            transform: 'translateY(-1px)'
          }}
          spacing={3}
        >
          <Icon as={FiLogOut} w={5} h={5} />

          {!isCollapsed && (
            <Text fontSize="md" fontWeight="medium">
              로그아웃
            </Text>
          )}
        </HStack>
      </Box>
    </Box>
  );
};
