import { Flex, Text, HStack, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { format, addDays, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  currentDate: Date;
  onChangeDate: (date: Date) => void;
}

const getWeekInfo = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayWeek = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
  const currentWeekStart = startOfWeek(date, { weekStartsOn: 0 });

  const weekNumber = Math.round((currentWeekStart.getTime() - firstDayWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  return { year, month: month + 1, weekNumber };
};

export const DateController = ({ currentDate, onChangeDate }: Props) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const { year, month, weekNumber } = getWeekInfo(currentDate);

  // Generate options
  const years = [2024, 2025, 2026];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const weeks = [1, 2, 3, 4, 5, 6]; // Max possible weeks

  const handleYearChange = (newYear: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newYear);
    onChangeDate(newDate);
  };

  const handleMonthChange = (newMonth: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newMonth - 1);
    onChangeDate(newDate);
  };

  const handleWeekChange = (newWeek: number) => {
    // Logic to find the start of the Nth week of the current month
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const firstWeekStart = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
    const targetDate = addDays(firstWeekStart, (newWeek - 1) * 7);
    onChangeDate(targetDate);
  };

  const DropdownButton = ({ label }: { label: string }) => (
    <MenuButton
      as={Button}
      rightIcon={<ChevronDownIcon color="#373E56" boxSize="20px" />}
      bg="white"
      border="1px solid"
      borderColor="#53A8FE"
      borderRadius="9px"
      fontFamily="Pretendard"
      fontWeight="500"
      fontSize="16px"
      color="#373E56"
      p="15px 15px"
      lineHeight="normal"
      textAlign="left"
      _hover={{ bg: 'gray.50' }}
      _active={{ bg: 'gray.100' }}
    >
      {label}
    </MenuButton>
  );

  return (
    <Flex direction="column" align="flex-start" mb={8} w="full">
      <HStack spacing="10px" mb={6}>
        <Menu>
          <DropdownButton label={`${year}년`} />
          <MenuList>
            {years.map(y => (
              <MenuItem key={y} onClick={() => handleYearChange(y)}>{y}년</MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
          <DropdownButton label={`${month}월`} />
          <MenuList maxH="200px" overflowY="auto">
            {months.map(m => (
              <MenuItem key={m} onClick={() => handleMonthChange(m)}>{m}월</MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
          <DropdownButton label={`${weekNumber}주차`} />
          <MenuList>
            {weeks.map(w => (
              <MenuItem key={w} onClick={() => handleWeekChange(w)}>{w}주차</MenuItem>
            ))}
          </MenuList>
        </Menu>
      </HStack>

      <HStack spacing={{ base: 2, md: 6 }} justify="space-between" padding="0 6vw" w="full" overflowX="auto">
        {weekDays.map((day) => {
          const isSelected = format(day, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
          const dayName = format(day, 'EEE', { locale: ko });
          const dayNum = format(day, 'd');
          const isSunday = day.getDay() === 0;

          return (
            <Flex
              key={day.toISOString()}
              direction="column"
              align="center"
              cursor="pointer"
              onClick={() => onChangeDate(day)}
              role="group"
              minW="48px"
            >
              <Text
                fontSize="lg"
                fontWeight="medium"
                color={isSelected ? '#53A8FE' : isSunday ? 'red.400' : '#7E7E7E'}
                mb={2}
                _groupHover={{ color: !isSelected ? 'gray.600' : undefined }}
              >
                {dayName}
              </Text>

              <Flex
                w="48px"
                h="48px"
                align="center"
                justify="center"
                borderRadius="12px"
                bg={isSelected ? '#53A8FE' : 'transparent'}
                transition="all 0.2s"
                _groupHover={{ bg: !isSelected ? '#F9F9FB' : undefined }}
              >
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={isSelected ? 'white' : '#7E7E7E'}
                >
                  {dayNum}
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </HStack>
    </Flex>
  );
};