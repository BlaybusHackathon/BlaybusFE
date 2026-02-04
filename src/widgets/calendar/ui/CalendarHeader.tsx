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
        <Flex justify="space-between" align="center" mb={6}>
            {/* Left Group: Nav & Tags */}
            <HStack spacing={8}>
                {/* Month Navigation */}
                <HStack spacing={4}>
                    <IconButton
                        aria-label="Previous month"
                        icon={<ChevronLeftIcon w={6} h={6} color="gray.500" />}
                        onClick={onPrevMonth}
                        variant="unstyled"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        minW="auto"
                    />
                    <Text fontSize="xl" fontWeight="bold">
                        {year}년 {month}월
                    </Text>
                    <IconButton
                        aria-label="Next month"
                        icon={<ChevronRightIcon w={6} h={6} color="gray.500" />}
                        onClick={onNextMonth}
                        variant="unstyled"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        minW="auto"
                    />
                </HStack>

                {/* Subject Tags */}
                <HStack spacing={2}>
                    <Flex bg="blue.400" color="white" px={3} py={1} borderRadius="full" fontSize="sm" alignItems="center" justifyContent="center">
                        국어
                    </Flex>
                    <Flex bg="green.400" color="white" px={3} py={1} borderRadius="full" fontSize="sm" alignItems="center" justifyContent="center">
                        영어
                    </Flex>
                    <Flex bg="purple.400" color="white" px={3} py={1} borderRadius="full" fontSize="sm" alignItems="center" justifyContent="center">
                        수학
                    </Flex>
                    <HStack spacing={1} ml={2}>
                        <Box w="8px" h="8px" bg="pink.300" borderRadius="full" />
                        <Text fontSize="sm" fontWeight="medium" color="gray.600">보완점</Text>
                    </HStack>
                </HStack>
            </HStack>

            {/* Right: Filter Toggle */}
            <Flex
                align="center"
                cursor="pointer"
                onClick={() => onToggleIncomplete(!showIncompleteOnly)}
            >
                <CheckCircleIcon
                    color={showIncompleteOnly ? "gray.800" : "gray.300"}
                    mr={1.5}
                    w={5}
                    h={5}
                />
                <Text fontSize="sm" color="gray.500">
                    과제 미완료
                </Text>
            </Flex>
        </Flex>
    );
};
