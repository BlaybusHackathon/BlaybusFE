import { Button, HStack, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const DropdownButton = ({ label }: { label: string }) => (
    <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon color="#373E56" boxSize="5" />}
        bg="white"
        border="1px solid"
        borderColor="#53A8FE"
        borderRadius="9px"
        fontSize="14px"
        fontWeight="500"
        color="#373E56"
        h="40px"
        minW="100px"
        textAlign="left"
        gap="8px"
        _hover={{ bg: '#F9F9FB' }}
        _active={{ bg: '#F0F2F5' }}
    >
        <Text as="span">{label}</Text>
    </MenuButton>
);

interface Props {
    year: number;
    month: number;
    week: number;
    onChangeYear: (year: number) => void;
    onChangeMonth: (month: number) => void;
    onChangeWeek: (week: number) => void;
}

export const ReportDateController = ({
    year,
    month,
    week,
    onChangeYear,
    onChangeMonth,
    onChangeWeek,
}: Props) => {
    const years = [2024, 2025, 2026];
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const weeks = [1, 2, 3, 4, 5, 6];

    return (
        <HStack spacing={2} mb={6}>
            <Menu>
                <DropdownButton label={`${year} Year`} />
                <MenuList>
                    {years.map((y) => (
                        <MenuItem key={y} onClick={() => onChangeYear(y)}>
                            {y} Year
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>

            <Menu>
                <DropdownButton label={`${month} Month`} />
                <MenuList maxH="200px" overflowY="auto">
                    {months.map((m) => (
                        <MenuItem key={m} onClick={() => onChangeMonth(m)}>
                            {m} Month
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>

            <Menu>
                <DropdownButton label={`${week} Week`} />
                <MenuList>
                    {weeks.map((w) => (
                        <MenuItem key={w} onClick={() => onChangeWeek(w)}>
                            {w} Week
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </HStack>
    );
};
