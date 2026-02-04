import { Flex } from '@chakra-ui/react';
import { Select } from '@/shared/ui/Select';
import { useEffect, useState } from 'react';

interface DateSelectorProps {
    year: number;
    month: number;
    week: number;
    onChange: (year: number, month: number, week: number) => void;
}

export const DateSelector = ({ year, month, week, onChange }: DateSelectorProps) => {
    const [years, setYears] = useState<number[]>([]);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const weeks = [1, 2, 3, 4, 5]; // Keeping it simple for now, 5 weeks max per month

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        setYears([currentYear - 1, currentYear, currentYear + 1]);
    }, []);

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(Number(e.target.value), month, week);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(year, Number(e.target.value), week);
    };

    const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(year, month, Number(e.target.value));
    };

    return (
        <Flex gap={4} mb={8}>
            <Select value={year} onChange={handleYearChange} width="120px">
                {years.map((y) => (
                    <option key={y} value={y}>
                        {y}년
                    </option>
                ))}
            </Select>
            <Select value={month} onChange={handleMonthChange} width="100px">
                {months.map((m) => (
                    <option key={m} value={m}>
                        {m}월
                    </option>
                ))}
            </Select>
            <Select value={week} onChange={handleWeekChange} width="100px">
                {weeks.map((w) => (
                    <option key={w} value={w}>
                        {w}주차
                    </option>
                ))}
            </Select>
        </Flex>
    );
};
