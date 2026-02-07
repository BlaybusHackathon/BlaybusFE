import { Flex, Text, IconButton, HStack, Box, Button } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, AddIcon } from '@chakra-ui/icons';

interface CalendarHeaderProps {
    currentDate: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    showCompletedOnly: boolean;
    onToggleCompleted: (checked: boolean) => void;
    menteeName?: string;
    onCreateSchedule?: () => void;
}

export const CalendarHeader = ({
    currentDate,
    onPrevMonth,
    onNextMonth,
    showCompletedOnly,
    onToggleCompleted,
    menteeName = "최연준",
    onCreateSchedule,
}: CalendarHeaderProps) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    return (
        <Flex direction="column" gap={6} mb={6}>
            {/* Top Row: Title & Create Button */}
            <Flex justify="space-between" align="center">
                <Text fontSize="32px" fontWeight="bold">
                    {menteeName}님 월간 계획표
                </Text>
                <Button
                    leftIcon={<AddIcon w={3} h={3} />}
                    colorScheme="blue"
                    bg="#53A8FE"
                    color="white"
                    px={16}
                    py={6}
                    borderRadius="md"
                    fontSize="16px"
                    fontWeight="700"
                    _hover={{ bg: '#4297ED' }}
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
                <Flex align="center" gap={8}>
                    {/* Date Navigation */}
                    <HStack spacing={4}>
                        <IconButton
                            aria-label="Previous month"
                            icon={<ChevronLeftIcon w={6} h={6} color="#9B9BA4" />}
                            onClick={onPrevMonth}
                            variant="unstyled"
                            size="sm"
                            minW="auto"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        />
                        <Text fontSize="20px" fontWeight="500" px={2} color="#595959">
                            {year}년 {month}월
                        </Text>
                        <IconButton
                            aria-label="Next month"
                            icon={<ChevronRightIcon w={6} h={6} color="#9B9BA4" />}
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
                        <Flex bg="#53A8FE" color="white" px="15px" py="6px" borderRadius="full" fontSize="14px" fontWeight="600" align="center">
                            국어
                        </Flex>
                        <Flex bg="#35CE9D" color="white" px="15px" py="6px" borderRadius="full" fontSize="14px" fontWeight="600" align="center">
                            영어
                        </Flex>
                        <Flex bg="#A16AFF" color="white" px="15px" py="6px" borderRadius="full" fontSize="14px" fontWeight="600" align="center">
                            수학
                        </Flex>
                        <HStack spacing={2} ml={2}>
                            <Box w="10px" h="10px" bg="#FF99CC" borderRadius="full" />
                            <Text fontSize="14px" fontWeight="600" color="gray.600">보완점</Text>
                        </HStack>
                    </HStack>
                </Flex>

                {/* Filter Toggle */}
                <Flex
                    align="center"
                    cursor="pointer"
                    onClick={() => onToggleCompleted(!showCompletedOnly)}
                >
                    <CheckCircleIcon
                        color={showCompletedOnly ? "#53A8FE" : "gray.300"}
                        mr={2}
                        w={6}
                        h={6}
                    />
                    <Text fontSize="16px" color={showCompletedOnly ? "#53A8FE" : "gray.500"} fontWeight="600">
                        과제 완료
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
};