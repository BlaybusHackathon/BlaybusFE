import { Box, Button, HStack, Select, Text } from '@chakra-ui/react';
import { useScheduleCreateStore } from '../model/store';
import { DAYS, WEEKS } from '../model/mockData';

export const DaySelector = () => {
    const { selectedWeek, setSelectedWeek, selectedDays, toggleDay } = useScheduleCreateStore();

    return (
        <Box>
            <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={3}>요일 선택</Text>
            <HStack spacing={2} align="center">
                {/* Week Selector */}
                <Box>
                    <Select
                        value={selectedWeek}
                        onChange={(e) => setSelectedWeek(e.target.value)}
                        bg="white"
                        borderColor="blue.200"
                        focusBorderColor="blue.400"
                        width="100px"
                        height="45px"
                        borderRadius="md"
                        iconColor="blue.400"
                    >
                        {WEEKS.map((week) => (
                            <option key={week} value={week}>{week}</option>
                        ))}
                    </Select>
                </Box>

                {/* Day Toggles */}
                {DAYS.map((day) => (
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
