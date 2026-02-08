import { Box, Text, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useScheduleCreateStore } from '../model/store';
import { useParams } from 'react-router-dom';
import { useMenteeWeaknesses } from '@/features/weakness/model/useMenteeWeaknesses';

export const WeaknessSelectBox = () => {
    const { subject, selectedWeaknessId, setSelectedWeaknessId } = useScheduleCreateStore();
    const { menteeId } = useParams();
    const { data: weaknesses } = useMenteeWeaknesses(menteeId);

    const list = weaknesses ?? [];
    const filteredWeaknesses = subject ? list.filter((w) => w.subject === subject) : [];

    // Find selected label for display
    const selectedLabel = selectedWeaknessId
        ? filteredWeaknesses.find(w => w.id === selectedWeaknessId)?.title || 'ë³´ì™„  ê°•ì˜/˜¤‹µ…¸Š¸ „ ƒ'
        : 'ë³´ì™„  —†Œ';

    return (
        <Box animation="fadeIn 0.3s">
            <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={3}>ë³´ì™„ </Text>
            <Box w="full">
                <Menu matchWidth>
                    <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon color="#FF88D0" />}
                        bg="white"
                        border="1px solid"
                        borderColor="#FFB5E8"
                        borderRadius="lg"
                        w="full"
                        height="50px"
                        textAlign="left"
                        fontWeight="normal"
                        fontSize="md"
                        color={selectedWeaknessId ? 'gray.900' : 'gray.500'}
                        _hover={{ borderColor: '#FF88D0' }}
                        _active={{ bg: 'white', borderColor: '#FF88D0' }}
                    >
                        {selectedLabel}
                    </MenuButton>
                    <MenuList
                        bg="white"
                        borderColor="#FFB5E8"
                        borderRadius="lg"
                        boxShadow="md"
                        zIndex={10}
                        maxH="300px" // Scroll if too many
                        overflowY="auto"
                    >
                        <MenuItem
                            onClick={() => setSelectedWeaknessId(null)}
                            _hover={{ bg: 'pink.50' }}
                            color="gray.500"
                        >
                            ë³´ì™„  —†Œ
                        </MenuItem>
                        {filteredWeaknesses.map((w) => (
                            <MenuItem
                                key={w.id}
                                onClick={() => setSelectedWeaknessId(w.id)}
                                _hover={{ bg: 'pink.50' }}
                                _focus={{ bg: 'pink.50' }}
                            >
                                {w.title}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>

                {filteredWeaknesses.length === 0 && (
                    <Text fontSize="sm" color="gray.500" mt={2}>•´‹¹ ê³¼ëª©— “±ë¡ëœ ë³´ì™„  ë£Œê —†Šµ‹ˆ‹¤.</Text>
                )}
            </Box>
        </Box>
    );
};
