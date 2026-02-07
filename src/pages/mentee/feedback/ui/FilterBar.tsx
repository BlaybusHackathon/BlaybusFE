import { useMemo, useEffect } from 'react';
import { HStack, Menu, MenuButton, MenuList, MenuItem, Button, Box, Text} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { getWeeksInMonth } from 'date-fns';

interface FilterBarProps {
  filters: { year: number; month: number; week: number | 'ALL'; subject: string };
  setters: { 
    setYear: (v: number) => void; 
    setMonth: (v: number) => void; 
    setWeek: (v: number | 'ALL') => void; 
    setSubject: (v: string) => void; 
  };
}

const currentYear = new Date().getFullYear();
const YEARS = [currentYear, currentYear - 1, currentYear - 2];

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const SUBJECTS = [
  { value: 'ALL', label: '전체 과목' },
  { value: 'KOREAN', label: '국어' },
  { value: 'ENGLISH', label: '영어' },
  { value: 'MATH', label: '수학' },
  { value: 'OTHER', label: '기타' },
];

interface CustomFilterMenuProps<T> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  width?: number | string;
}

const CustomFilterMenu = <T extends string | number>({ 
  value, 
  options, 
  onChange, 
  width = 20 
}: CustomFilterMenuProps<T>) => {
  const currentLabel = options.find(opt => opt.value === value)?.label || String(value);

  return (
    <Menu>
      <MenuButton
        as={Button}
        size="sm"
        w={width}
        py={4}
        variant="outline"
        borderRadius="xl"
        borderColor="blue.400"
        borderWidth="2px"
        bg="white"
        fontWeight="normal"
        fontSize={{base:"xs",md:"sm"}}
        textAlign="left"
        _hover={{
          borderColor: 'blue.500',
          bg: 'white'
        }}
        _active={{
          borderColor: 'blue.600',
          bg: 'white'
        }}
      >
        <HStack w="100%" justifyContent="space-between" spacing={0}>
           <Box flex={1} textAlign="center">
             <Text as="span" isTruncated> 
               {currentLabel}
             </Text>
           </Box>
           <ChevronDownIcon ml={1} />
        </HStack>
      </MenuButton>
      
      <MenuList
        borderRadius="2xl"
        borderColor="blue.400"
        borderWidth="2px"
        boxShadow="lg"
        py={0}
        px={0}
        overflow="hidden"
        minW="fit-content"
        zIndex={10}
      >
        {options.map((option) => (
          <MenuItem
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            justifyContent="center"
            w={typeof width === 'number' ? width : '100%'}
            minW={width}
            py={2}
            fontSize={{base:"xs",md:"sm"}}
            fontWeight="normal"
            minH="auto"
            _hover={{
              bg: 'blue.50'
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
export const FilterBar = ({ filters, setters }: FilterBarProps) => {
  
  const currentMonthWeeks = useMemo(() => {
    const date = new Date(filters.year, filters.month - 1);
    const weeksCount = getWeeksInMonth(date, { weekStartsOn: 0 });
    return Array.from({ length: weeksCount }, (_, i) => i + 1);
  }, [filters.year, filters.month]);

  useEffect(() => {
    if (filters.week !== 'ALL') {
      const maxWeek = currentMonthWeeks.length;
      if (filters.week > maxWeek) {
        setters.setWeek('ALL');
      }
    }
  }, [filters.year, filters.month, filters.week, currentMonthWeeks.length, setters]);

  return (
    <HStack w="full" spacing={2} mb={6}>
      <CustomFilterMenu 
        value={filters.subject}
        onChange={setters.setSubject}
        options={SUBJECTS}
        width={28} 
      />

      <CustomFilterMenu 
        value={filters.year}
        onChange={setters.setYear}
        options={YEARS.map(y => ({ value: y, label: `${y}년` }))}
        width={24}
      />

      <CustomFilterMenu 
        value={filters.month}
        onChange={setters.setMonth}
        options={MONTHS.map(m => ({ value: m, label: `${m}월` }))}
        width={20}
      />

      <CustomFilterMenu<number | 'ALL'>
        value={filters.week}
        onChange={setters.setWeek}
        options={[
            { value: 'ALL', label: '전체' },
            ...currentMonthWeeks.map(w => ({ value: w, label: `${w}주` }))
        ]}
        width={20}
      />
    </HStack>
  );
};