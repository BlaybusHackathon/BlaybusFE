import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useLocation } from 'react-router-dom';
import { MenteeIcon } from '@/shared/ui/MenteeIcon';

import { MenteeMenuItem, MenteeNavItem } from './MenteeMenuItem';

interface Props {
  mentees: MenteeNavItem[];
  isCollapsed: boolean;
}

export const MenteeListToggle = ({ mentees, isCollapsed }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenteeIds, setOpenMenteeIds] = useState<string[]>([]);
  const location = useLocation();

  const isAnyMenteeActive = location.pathname.startsWith('/mentor/mentee');

  const toggleMentee = (id: string) => {
    setOpenMenteeIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <Box>
      <Flex
        align="center"
        py={3}
        pl={isCollapsed ? 3 : '44px'}
        pr={3}
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        color={isAnyMenteeActive ? "#52A8FE" : "gray.500"}
        bg="transparent"
        _hover={{ bg: 'gray.100', color: isAnyMenteeActive ? "#52A8FE" : "gray.900" }}
        borderRadius="md"
        justify={isCollapsed ? 'center' : 'space-between'}
      >
        {isCollapsed ? (
          <Box>{!isOpen && <MenteeIcon w={4} h={4} />}</Box>
        ) : (
          <>
            <Flex align="center">
              <MenteeIcon w={5} h={5} />
              <Text ml="14px" fontSize="18px" fontWeight="700">
                담당멘티
              </Text>
            </Flex>
            {isOpen ? <ChevronDownIcon w={5} h={5} /> : <ChevronRightIcon w={5} h={5} />}
          </>
        )}
      </Flex>

      {isOpen && !isCollapsed && (
        <Box>
          {mentees.map((mentee) => (
            <MenteeMenuItem
              key={mentee.id}
              mentee={mentee}
              isOpen={openMenteeIds.includes(mentee.id)}
              onToggle={() => toggleMentee(mentee.id)}
              isCollapsed={isCollapsed}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
