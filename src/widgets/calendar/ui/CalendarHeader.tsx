import { Flex, Text, IconButton, HStack, Switch, FormLabel, Box } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

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
            <HStack spacing={4}>
                <IconButton
                    aria-label="Previous month"
                    icon={<ChevronLeftIcon />}
                    onClick={onPrevMonth}
                    variant="ghost"
                    size="sm"
                />
                <Text fontSize="xl" fontWeight="bold">
                    {year}년 {month}월
                </Text>
                <IconButton
                    aria-label="Next month"
                    icon={<ChevronRightIcon />}
                    onClick={onNextMonth}
                    variant="ghost"
                    size="sm"
                />
            </HStack>

            <HStack spacing={4}>
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
                        <Text fontSize="sm" fontWeight="medium">보완점</Text>
                    </HStack>
                </HStack>

                <Flex align="center">
                    <Switch
                        id="incomplete-only"
                        isChecked={showIncompleteOnly}
                        onChange={(e) => onToggleIncomplete(e.target.checked)}
                        mr={2}
                    />
                    <FormLabel htmlFor="incomplete-only" mb={0} fontSize="sm" color="gray.500">
                        과제 미완료
                    </FormLabel>
                </Flex>
            </HStack>
        </Flex>
    );
};
