import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { MenteeMenuItem, MenteeNavItem } from './MenteeMenuItem';

interface Props {
  mentees: MenteeNavItem[];
}

export const MenteeListToggle = ({ mentees }: Props) => {
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
        px={4}
        py={3}
        cursor="pointer"
        _hover={{ bg: 'gray.100' }}
        borderRadius="md"
        onClick={() => setIsOpen(!isOpen)}
        color="gray.600"
      >
        {isOpen ? <ChevronDownIcon mr={2} /> : <ChevronRightIcon mr={2} />}
        <Text fontSize="sm" fontWeight="bold">담당 멘티</Text>
      </Flex>

      {isOpen && (
        <Box pl={2} mt={1}>
          {mentees.map((mentee) => (
            <MenteeMenuItem
              key={mentee.id}
              mentee={mentee}
              isOpen={openMenteeIds.includes(mentee.id)}
              onToggle={() => toggleMentee(mentee.id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};