import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';

export interface MenteeNavItem {
  id: string;
  name: string;
}

interface Props {
  mentee: MenteeNavItem;
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
}

export const MenteeMenuItem = ({ mentee, isOpen, onToggle, isCollapsed }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = `/mentor/mentee/${mentee.id}`;
  const isManageActive = location.pathname === basePath;
  const isCalendarActive = location.pathname === `${basePath}/calendar`;
  const isFeedbackActive = location.pathname === `${basePath}/feedback`;

  // [수정] 현재 멘티와 관련된 어떤 메뉴라도 활성화되어 있는지 확인
  const isAnyChildActive = isManageActive || isCalendarActive || isFeedbackActive;

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(basePath);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  if (isCollapsed) {
    return null;
  }

  return (
    <Box>
      <Flex
        align="center"
        py={3}
        pl="54px"
        pr={3}
        cursor="pointer"
        color={isAnyChildActive ? '#53A8FE' : 'gray.700'}
        borderRadius="md"
        _hover={{ 
          bg: isAnyChildActive ? '#eff6ff' : 'gray.50', 
          color: isAnyChildActive ? '#53A8FE' : 'gray.900' 
        }}
      >
        <Text pl="8" fontSize="18px" fontWeight="medium" onClick={handleNameClick} flex="1">
          {mentee.name}
        </Text>
        <Box onClick={handleToggleClick} w={4} h={4} display="flex" alignItems="center" justifyContent="center">
          {isOpen ? <ChevronDownIcon w={5} h={5} /> : <ChevronRightIcon w={5} h={5} />}
        </Box>
      </Flex>

      {isOpen && (
        <Box pl="74px" mt={3}>
          <VStack spacing={4} align="stretch">
            <Flex
              align="center"
              justify={"center"}
              p={2}
              cursor="pointer"
              color={isCalendarActive ? '#53A8FE' : 'gray.500'}
              borderRadius="md"
              onClick={() => navigate(`${basePath}/calendar`)}
              _hover={ {color: '#53A8FE'} }
            >
              <Text fontSize="16px" fontWeight="500">캘린더</Text>
            </Flex>

            <Flex
              align="center"
              justify={"center"}
              p={2}
              cursor="pointer"
              color={isFeedbackActive ? '#53A8FE' : 'gray.500'}
              borderRadius="md"
              onClick={() => navigate(`${basePath}/feedback`)}
              _hover={ {color: '#53A8FE'} }
            >
              <Text fontSize="16px" fontWeight="500">피드백</Text>
            </Flex>
          </VStack>
        </Box>
      )}
    </Box>
  );
};