// src/widgets/main-layout/desktop/components/MenteeMenuItem.tsx

import { Box, Flex, Text } from '@chakra-ui/react';
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
        p={2}
        pl={4}
        cursor="pointer"
        bg={isManageActive ? 'blue.50' : 'transparent'}
        color={isManageActive ? 'blue.500' : 'gray.700'}
        borderRadius="md"
        _hover={{ bg: isManageActive ? 'blue.100' : 'gray.50' }}
      >
        <Box onClick={handleToggleClick} mr={2}>
          {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </Box>
        <Text fontSize="sm" fontWeight="medium" onClick={handleNameClick} flex="1">
          {mentee.name}
        </Text>
      </Flex>

      {isOpen && (
        <Box pl={8}>
          <Flex
            align="center"
            p={2}
            cursor="pointer"
            bg={isCalendarActive ? 'blue.50' : 'transparent'}
            color={isCalendarActive ? 'blue.500' : 'gray.600'}
            borderRadius="md"
            onClick={() => navigate(`${basePath}/calendar`)}
            _hover={{ bg: isCalendarActive ? 'blue.100' : 'gray.50' }}
          >
            <Text fontSize="sm">캘린더</Text>
          </Flex>

          <Flex
            align="center"
            p={2}
            cursor="pointer"
            bg={isFeedbackActive ? 'blue.50' : 'transparent'}
            color={isFeedbackActive ? 'blue.500' : 'gray.600'}
            borderRadius="md"
            onClick={() => navigate(`${basePath}/feedback`)}
            _hover={{ bg: isFeedbackActive ? 'blue.100' : 'gray.50' }}
          >
            <Text fontSize="sm">피드백</Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
};
