import { useRef } from 'react';
import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { MenteeSummary } from '../../../pages/mentor/mypage/model/types';
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
            <Text color="#394250"
                fontFamily="Pretendard"
                fontSize="24px"
                fontStyle="normal"
                fontWeight="700"
                lineHeight="normal"
                mb="28px"
            >
                담당 멘티
            </Text>

            <Box position="relative">
                <IconButton
                    aria-label="Scroll Left"
                    icon={<ChevronLeftIcon w={10} h={10} />}
                    position="absolute"
                    left="-60px"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={10}
                    isRound
                    w="40px"
                    h="40px"
                    bg="white"
                    boxShadow="0 4px 4px 0 rgba(57, 83, 177, 0.25)"
                    border="1px solid"
                    borderColor="#FFFFFF"
                    color="gray.500"
                    _hover={{ bg: 'gray.50', color: 'gray.500' }}
                    onClick={() => handleScroll('left')}
                    display={{ base: 'none', md: 'flex' }}
                />

                <HStack
                    ref={scrollContainerRef}
                    overflowX="auto"
                    scrollBehavior="smooth"
                    gap="20px"
                    p="5px 0px 5px 0px"
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
                    icon={<ChevronRightIcon w={10} h={10} />}
                    position="absolute"
                    right="-60px"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={10}
                    isRound
                    w="40px"
                    h="40px"
                    bg="white"
                    boxShadow="0 4px 4px 0 rgba(57, 83, 177, 0.25)"
                    border="1px solid"
                    borderColor="#FFFFFF"
                    color="gray.500"
                    _hover={{ bg: 'gray.50', color: 'gray.500' }}
                    onClick={() => handleScroll('right')}
                    display={{ base: 'none', md: 'flex' }}
                />
            </Box>
        </Box>
    );
};