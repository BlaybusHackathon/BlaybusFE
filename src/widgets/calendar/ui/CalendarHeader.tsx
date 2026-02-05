import { Flex, Text, IconButton, HStack, Box } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon } from '@chakra-ui/icons';

interface CalendarHeaderProps {
    currentDate: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    showIncompleteOnly: boolean;
    onToggleIncomplete: (checked: boolean) => void;
}

export const CalendarHeader = ({
    currentDate,
    onPrevMonth,
    onNextMonth,
    showIncompleteOnly,
    onToggleIncomplete,
}: CalendarHeaderProps) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    return (
        <Flex 
            direction={{ base: 'column', lg: 'row' }} 
            justify="space-between" 
            align={{ base: 'start', lg: 'center' }} 
            mb={6}
            gap={4}
        >
            {/* Top Row: Navigation & Filter (Mobile) */}
            <Flex w="full" justify="space-between" align="center">
                <HStack spacing={2}>
                    <IconButton
                        aria-label="Previous month"
                        icon={<ChevronLeftIcon w={6} h={6} color="gray.500" />}
                        onClick={onPrevMonth}
                        variant="ghost"
                        size="sm"
                    />
                    <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" whiteSpace="nowrap">
                        {year}년 {month}월
                    </Text>
                    <IconButton
                        aria-label="Next month"
                        icon={<ChevronRightIcon w={6} h={6} color="gray.500" />}
                        onClick={onNextMonth}
                        variant="ghost"
                        size="sm"
                    />
                </HStack>

                {/* Filter Toggle */}
                <Flex
                    align="center"
                    cursor="pointer"
                    onClick={() => onToggleIncomplete(!showIncompleteOnly)}
                    px={3}
                    py={1.5}
                    borderRadius="md"
                >
                    <CheckCircleIcon
                        color={showIncompleteOnly ? "blue.500" : "gray.300"}
                        mr={1.5}
                        w={4}
                        h={4}
                    />
                    <Text fontSize="sm" color={showIncompleteOnly ? "blue.600" : "gray.500"} fontWeight="medium">
                        과제 미완료
                    </Text>
                </Flex>
            </Flex>

            {/* Bottom Row: Legends (Scrollable on Mobile) */}
            <HStack 
                spacing={2} 
                overflowX="auto" 
                w="full" 
                pb={1}
                css={{ 
                    '&::-webkit-scrollbar': { display: 'none' },
                    msOverflowStyle: 'none',  
                    scrollbarWidth: 'none',  
                }}
            >
                <Flex bg="blue.400" color="white" px={3} py={1} borderRadius="full" fontSize="xs" align="center" flexShrink={0}>
                    국어
                </Flex>
                <Flex bg="green.400" color="white" px={3} py={1} borderRadius="full" fontSize="xs" align="center" flexShrink={0}>
                    영어
                </Flex>
                <Flex bg="purple.400" color="white" px={3} py={1} borderRadius="full" fontSize="xs" align="center" flexShrink={0}>
                    수학
                </Flex>
                <HStack spacing={1} ml={2} flexShrink={0}>
                    <Box w="8px" h="8px" bg="pink.300" borderRadius="full" />
                    <Text fontSize="xs" fontWeight="medium" color="gray.600">보완점</Text>
                </HStack>
            </HStack>
        </Flex>
    );
};