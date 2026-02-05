import { HStack } from '@chakra-ui/react';
import { Select } from '@/shared/ui/Select';

interface FilterBarProps {
  filters: { year: number; month: number; week: number | 'ALL'; subject: string };
  setters: { 
    setYear: (v: number) => void; 
    setMonth: (v: number) => void; 
    setWeek: (v: number | 'ALL') => void; 
    setSubject: (v: string) => void; 
  };
}

const YEARS = [2024, 2023];
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const WEEKS = [1, 2, 3, 4, 5, 6];
const SUBJECTS = [
  { value: 'ALL', label: '전체 과목' },
  { value: 'KOREAN', label: '국어' },
  { value: 'ENGLISH', label: '영어' },
  { value: 'MATH', label: '수학' },
  { value: 'OTHER', label: '기타' },
];

export const FilterBar = ({ filters, setters }: FilterBarProps) => {
  return (
    <HStack w="full" spacing={2} mb={6}>
      <Select 
        value={filters.subject} 
        onChange={(e) => setters.setSubject(e.target.value)} 
        flex={2} 
        bg="white"
      >
        {SUBJECTS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </Select>

      <Select 
        value={filters.year} 
        onChange={(e) => setters.setYear(Number(e.target.value))} 
        flex={1}
        bg="white"
      >
        {YEARS.map(y => <option key={y} value={y}>{y}년</option>)}
      </Select>

      <Select 
        value={filters.month} 
        onChange={(e) => setters.setMonth(Number(e.target.value))} 
        flex={1}
        bg="white"
      >
        {MONTHS.map(m => <option key={m} value={m}>{m}월</option>)}
      </Select>

      <Select 
        value={filters.week} 
        onChange={(e) => setters.setWeek(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))} 
        flex={1}
        bg="white"
      >
        <option value="ALL">전체</option>
        {WEEKS.map(w => <option key={w} value={w}>{w}주</option>)}
      </Select>
    </HStack>
  );
};