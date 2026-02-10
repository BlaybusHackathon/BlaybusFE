import { Box, Button, HStack, Text, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useScheduleCreateStore } from '../model/store';
import { DAY_OPTIONS, getWeekOptions } from '../model/dateOptions';

export const DaySelector = () => {
    const { selectedWeek, setSelectedWeek, selectedDays, toggleDay } = useScheduleCreateStore();
    const weekOptions = getWeekOptions();
    const selectedWeekLabel =
        weekOptions.find((week) => week.value === selectedWeek)?.label ?? `${selectedWeek}주차`;

    return (
        <Box>
            <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={3}>요일 선택</Text>
            <HStack spacing={2} align="center">
                {/* Week Selector - Custom Menu */}
                <Box>
                    <Menu matchWidth>
                        <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon color="blue.400" />}
                            bg="white"
                            border="1px solid"
                            borderColor="blue.200"
                            borderRadius="md"
                            width="100px"
                            height="45px"
                            textAlign="left"
                            fontWeight="normal"
                            fontSize="md"
                            _hover={{ borderColor: 'blue.400' }}
                            _active={{ bg: 'white', borderColor: 'blue.400' }}
                        >
                            {selectedWeekLabel}
                        </MenuButton>
                        <MenuList
                            bg="white"
                            borderColor="blue.100"
                            borderRadius="md"
                            boxShadow="md"
                            zIndex={10}
                            minW="100px"
                        >
                            {weekOptions.map((week) => (
                                <MenuItem
                                    key={week.value}
                                    onClick={() => setSelectedWeek(week.value)}
                                    _hover={{ bg: 'blue.50' }}
                                    _focus={{ bg: 'blue.50' }}
                                >
                                    {week.label}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                </Box>

                {/* Day Toggles */}
                {DAY_OPTIONS.map((day) => (
                    <Button
                        key={day.value}
                        onClick={() => toggleDay(day.value)}
                        w="45px"
                        h="45px"
                        borderRadius="md"
                        p={0}
                        variant="unstyled"
                        bg={selectedDays.includes(day.value) ? '#53A8FE' : 'white'}
                        color={selectedDays.includes(day.value) ? 'white' : 'gray.400'}
                        border="1px solid"
                        borderColor={selectedDays.includes(day.value) ? '#53A8FE' : 'gray.200'}
                        _hover={{
                            bg: selectedDays.includes(day.value) ? '#4293E3' : 'gray.50',
                            borderColor: selectedDays.includes(day.value) ? '#4293E3' : 'gray.300'
                        }}
                        fontWeight="medium"
                    >
                        {day.label}
                    </Button>
                ))}
            </HStack>
        </Box>
    );
};
