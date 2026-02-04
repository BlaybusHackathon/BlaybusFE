import { Box, Flex, Text } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenteeNavItem } from './types';

interface Props {
  mentee: MenteeNavItem;
  isOpen: boolean;
  onToggle: () => void;
}

export const MenteeMenuItem = ({ mentee, isOpen, onToggle }: Props) => {
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

  return (
    <Box>
      <Flex
        align="center"
        px={4}
        py={2}
        cursor="pointer"
        bg={isManageActive ? 'blue.50' : 'transparent'}
        borderRadius="md"
        _hover={{ bg: 'gray.100' }}
        transition="all 0.2s"
      >
        <Box onClick={handleToggleClick} mr={2} color="gray.500">
          {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </Box>
        <Text
          fontSize="sm"
          fontWeight={isManageActive ? 'bold' : 'medium'}
          color={isManageActive ? 'blue.600' : 'gray.700'}
          onClick={handleNameClick}
          flex={1}
        >
          {mentee.name}
        </Text>
      </Flex>

      {isOpen && (
        <Box pl={9} mt={1}>
          <Text
            fontSize="sm"
            py={2}
            px={3}
            mb={1}
            cursor="pointer"
            borderRadius="md"
            bg={isCalendarActive ? 'blue.50' : 'transparent'}
            color={isCalendarActive ? 'blue.600' : 'gray.500'}
            fontWeight={isCalendarActive ? 'bold' : 'normal'}
            _hover={{ bg: 'gray.100' }}
            onClick={() => navigate(`${basePath}/calendar`)}
          >
            캘린더
          </Text>
          <Text
            fontSize="sm"
            py={2}
            px={3}
            cursor="pointer"
            borderRadius="md"
            bg={isFeedbackActive ? 'blue.50' : 'transparent'}
            color={isFeedbackActive ? 'blue.600' : 'gray.500'}
            fontWeight={isFeedbackActive ? 'bold' : 'normal'}
            _hover={{ bg: 'gray.100' }}
            onClick={() => navigate(`${basePath}/feedback`)}
          >
            피드백
          </Text>
        </Box>
      )}
    </Box>
  );
};