import { useRef } from 'react';
import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { MenteeSummary } from '../model/types';
import { MenteeCard } from './MenteeCard';

interface Props {
  mentees: MenteeSummary[];
}

export const MenteeList = ({ mentees }: Props) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350; 
      const currentScroll = scrollContainerRef.current.scrollLeft;
      
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4}>담당 멘티</Text>
      
      <Box position="relative">
        <IconButton
          aria-label="Scroll Left"
          icon={<ChevronLeftIcon w={6} h={6} />}
          position="absolute"
          left={4}
          top="50%"
          transform="translateY(-50%)"
          zIndex={10}
          isRound
          size="sm"
          bg="white"
          shadow="md"
          border="1px solid"
          borderColor="gray.100"
          color="gray.500"
          _hover={{ bg: 'gray.50', color: 'gray.700' }}
          onClick={() => handleScroll('left')}
          display={{ base: 'none', md: 'flex' }}
        />

        <HStack
          ref={scrollContainerRef}
          spacing={6} 
          overflowX="auto"
          py={4}
          px={20}
          mx={-6}
          css={{
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          {mentees.map((mentee) => (
            <MenteeCard key={mentee.id} mentee={mentee} />
          ))}
        </HStack>

        <IconButton
          aria-label="Scroll Right"
          icon={<ChevronRightIcon w={6} h={6} />}
          position="absolute"
          right={4} 
          top="50%"
          transform="translateY(-50%)"
          zIndex={10}
          isRound
          size="sm"
          bg="white"
          shadow="md"
          border="1px solid"
          borderColor="gray.100"
          color="gray.500"
          _hover={{ bg: 'gray.50', color: 'gray.700' }}
          onClick={() => handleScroll('right')}
          display={{ base: 'none', md: 'flex' }}
        />
      </Box>
    </Box>
  );
};