import { Box, Select, Text } from '@chakra-ui/react';
import { useScheduleCreateStore } from '../model/store';
import { MOCK_WEAKNESSES } from '../model/mockData';

export const WeaknessSelectBox = () => {
    const { subject, isWeaknessSelected, selectedWeaknessId, setSelectedWeaknessId } = useScheduleCreateStore();

    // Always show, filter by subject if selected
    // if (!subject) return null; // Or keep it hidden if no subject? User flow usually starts with subject.
    // User said "Basic is No Weakness, then select".

    const filteredWeaknesses = subject ? MOCK_WEAKNESSES.filter((w) => w.subject === subject) : [];

    return (
        <Box animation="fadeIn 0.3s">
            <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={3}>보완점</Text>
            <Box w="full">
                <Select
                    value={selectedWeaknessId || ''}
                    onChange={(e) => setSelectedWeaknessId(e.target.value === '' ? null : e.target.value)}
                    placeholder="보완점 없음"
                    bg="white"
                    borderColor="#FFB5E8"
                    focusBorderColor="#FF88D0"
                    size="lg"
                    height="50px"
                    borderRadius="lg"
                    _hover={{ borderColor: '#FF88D0' }}
                >
                    {filteredWeaknesses.map((w) => (
                        <option key={w.id} value={w.id}>
                            {w.label}
                        </option>
                    ))}
                </Select>
                {filteredWeaknesses.length === 0 && (
                    <Text fontSize="sm" color="gray.500" mt={2}>해당 과목에 등록된 보완점 자료가 없습니다.</Text>
                )}
            </Box>
        </Box>
    );
};
