import { Flex, Text, IconButton, HStack, Box, Button } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, AddIcon } from '@chakra-ui/icons';

interface CalendarHeaderProps {
    currentDate: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    showIncompleteOnly: boolean;
    onToggleIncomplete: (checked: boolean) => void;
    menteeName?: string;
    onCreateSchedule?: () => void;
}

export const CalendarHeader = ({
    currentDate,
    onPrevMonth,
    onNextMonth,
    showIncompleteOnly,
    onToggleIncomplete,
    menteeName = "최연준", // Default placeholder matching the design
    onCreateSchedule,
}: CalendarHeaderProps) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    return (
        <Flex direction="column" gap={8} mb={6}>
            {/* Top Row: Title & Create Button */}
            <Flex justify="space-between" align="center">
                <Text fontSize="2xl" fontWeight="bold">
                    {menteeName}님 월간 계획표
                </Text>
                <Button
                    leftIcon={<AddIcon w={3} h={3} />}
                    colorScheme="blue"
                    bg="blue.400"
                    color="white"
                    size="md"
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="medium"
                    _hover={{ bg: 'blue.500' }}
                    onClick={onCreateSchedule}
                >
                    일정 만들기
                </Button>
            </Flex>

            {/* Bottom Row: Navigation, Legends, Filter */}
            <Flex
                direction={{ base: 'column', lg: 'row' }}
                justify="space-between"
                align={{ base: 'start', lg: 'center' }}
                gap={4}
            >
                {/* Date Navigation */}
                <HStack spacing={4}>
                    <IconButton
                        aria-label="Previous month"
                        icon={<ChevronLeftIcon w={5} h={5} color="gray.400" />}
                        onClick={onPrevMonth}
                        variant="unstyled"
                        size="sm"
                        minW="auto"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    />
                    <Text fontSize="lg" fontWeight="semibold" px={2}>
                        {year}년 {month}월
                    </Text>
                    <IconButton
                        aria-label="Next month"
                        icon={<ChevronRightIcon w={5} h={5} color="gray.400" />}
                        onClick={onNextMonth}
                        variant="unstyled"
                        size="sm"
                        minW="auto"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    />
                </HStack>

                {/* Legends */}
                <HStack spacing={3}>
                    <Flex bg="#53A8FE" color="white" px={4} py={1} borderRadius="full" fontSize="sm" fontWeight="medium" align="center">
                        국어
                    </Flex>
                    <Flex bg="#35CE9D" color="white" px={4} py={1} borderRadius="full" fontSize="sm" fontWeight="medium" align="center">
                        영어
                    </Flex>
                    <Flex bg="#A16AFF" color="white" px={4} py={1} borderRadius="full" fontSize="sm" fontWeight="medium" align="center">
                        수학
                    </Flex>
                    <HStack spacing={2} ml={4}>
                        <Box w="10px" h="10px" bg="#FF99CC" borderRadius="full" />
                        <Text fontSize="sm" fontWeight="medium" color="gray.600">보완점</Text>
                    </HStack>
                </HStack>

                {/* Filter Toggle */}
                <Flex
                    align="center"
                    cursor="pointer"
                    onClick={() => onToggleIncomplete(!showIncompleteOnly)}
                >
                    <CheckCircleIcon
                        color={showIncompleteOnly ? "gray.400" : "gray.300"} // Design shows gray check when inactive, roughly
                        mr={2}
                        w={5}
                        h={5}
                    />
                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        과제 미완료
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
};