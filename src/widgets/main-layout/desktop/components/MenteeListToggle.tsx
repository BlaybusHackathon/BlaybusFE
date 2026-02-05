import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';

import { MenteeMenuItem, MenteeNavItem } from './MenteeMenuItem';

interface Props {
  mentees: MenteeNavItem[];
  isCollapsed: boolean;
}

export const MenteeListToggle = ({ mentees, isCollapsed }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenteeIds, setOpenMenteeIds] = useState<string[]>([]);

  const toggleMentee = (id: string) => {
    setOpenMenteeIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <Box>
      <Flex
        align="center"
        p={3}
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        color="blue.500"
        _hover={{ bg: 'gray.100' }}
        borderRadius="md"
        justify={isCollapsed ? 'center' : 'flex-start'}
      >
        {isCollapsed ? (
          <Box>{isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}</Box>
        ) : (
          <>
            {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
            <Text ml={2} fontSize="sm" fontWeight="semibold">
              담당 멘티
            </Text>
          </>
        )}
      </Flex>

      {isOpen && !isCollapsed && (
        <Box pl={2}>
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
