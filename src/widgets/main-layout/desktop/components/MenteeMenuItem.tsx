// src/widgets/main-layout/desktop/components/MenteeMenuItem.tsx

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
        bg={isManageActive ? '#eff6ff' : 'transparent'}
        color={isManageActive ? '#53A8FE' : 'gray.700'}
        borderRadius="md"
        _hover={{ bg: isManageActive ? '#eff6ff' : 'gray.50', color: isManageActive ? '#53A8FE' : 'gray.900' }}
      >
        <Box onClick={handleToggleClick} w={4} h={4} display="flex" alignItems="center" justifyContent="center">
          {isOpen ? <ChevronDownIcon w={5} h={5} /> : <ChevronRightIcon w={5} h={5} />}
        </Box>
        <Text ml="14px" fontSize="18px" fontWeight="medium" onClick={handleNameClick} flex="1">
          {mentee.name}
        </Text>
      </Flex>

      {isOpen && (
        <Box pl="74px" mt={3}>
          <VStack spacing={4} align="stretch">
            <Flex
              align="center"
              p={2}
              cursor="pointer"
              bg={isCalendarActive ? '#eff6ff' : 'transparent'}
              color={isCalendarActive ? '#53A8FE' : 'gray.500'}
              borderRadius="md"
              onClick={() => navigate(`${basePath}/calendar`)}
              _hover={{ bg: isCalendarActive ? '#eff6ff' : 'gray.50', color: isCalendarActive ? '#53A8FE' : 'gray.900' }}
            >
              <Text fontSize="16px" fontWeight="500">캘린더</Text>
            </Flex>

            <Flex
              align="center"
              p={2}
              cursor="pointer"
              bg={isFeedbackActive ? '#eff6ff' : 'transparent'}
              color={isFeedbackActive ? '#53A8FE' : 'gray.500'}
              borderRadius="md"
              onClick={() => navigate(`${basePath}/feedback`)}
              _hover={{ bg: isFeedbackActive ? '#eff6ff' : 'gray.50', color: isFeedbackActive ? '#53A8FE' : 'gray.900' }}
            >
              <Text fontSize="16px" fontWeight="500">피드백</Text>
            </Flex>
          </VStack>
        </Box>
      )}
    </Box>
  );
};
