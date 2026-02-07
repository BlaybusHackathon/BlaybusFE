import { Box, Button, Flex, Icon, Input, Text, VStack, HStack, IconButton } from '@chakra-ui/react';
import React from 'react';
import { useScheduleCreateStore } from '../model/store';
import { DAYS } from '../model/mockData';
import { SmallCloseIcon, AddIcon } from '@chakra-ui/icons';

export const LearningMaterialSection = () => {
    const {
        selectedDays: globalSelectedDays,
        worksheets,
        addWorksheet,
        removeWorksheet,
        updateWorksheetFile,
        toggleWorksheetDay
    } = useScheduleCreateStore();

    // Sort global selected days to match the order in DAYS (e.g., Mon -> Sun)
    const sortedGlobalDays = DAYS.filter((day) => globalSelectedDays.includes(day.value));

    // Handler for file input change
    const handleFileChange = (worksheetId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            updateWorksheetFile(worksheetId, {
                fullPath: '', // In a real scenario, this would be a URL or Blob URL
                name: file.name,
                size: file.size,
            });
        }
    };

    if (sortedGlobalDays.length === 0) {
        return null;
    }

    return (
        <Box animation="fadeIn 0.3s">
            <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={3}>학습지</Text>

            <VStack spacing={3} align="stretch">
                {worksheets.map((worksheet, index) => (
                    <Box
                        key={worksheet.id}
                        p={4}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        bg="white"
                    >
                        <Flex justify="space-between" align="center" mb={3}>
                            {worksheet.file ? (
                                <Flex align="center" gap={2}>
                                    <Text fontSize="md" fontWeight="medium" color="gray.900">
                                        {worksheet.file.name}
                                    </Text>
                                    <IconButton
                                        aria-label="Remove file"
                                        icon={<SmallCloseIcon />}
                                        size="xs"
                                        variant="ghost"
                                        color="gray.400"
                                        onClick={() => updateWorksheetFile(worksheet.id, null as any)} // Cast to any to allow null if strict null checks are on, or logic needs adjustment based on store type
                                    />
                                </Flex>
                            ) : (
                                <Box>
                                    <Input
                                        type="file"
                                        id={`file-${worksheet.id}`}
                                        display="none"
                                        onChange={(e) => handleFileChange(worksheet.id, e)}
                                    />
                                    <label htmlFor={`file-${worksheet.id}`}>
                                        <Button
                                            as="span"
                                            size="sm"
                                            variant="outline"
                                            colorScheme="blue"
                                            cursor="pointer"
                                            leftIcon={<AddIcon w={3} h={3} />}
                                            fontWeight="normal"
                                        >
                                            파일 업로드
                                        </Button>
                                    </label>
                                </Box>
                            )}

                            <IconButton
                                aria-label="Remove worksheet"
                                icon={<SmallCloseIcon />}
                                size="sm"
                                variant="ghost"
                                color="gray.400"
                                onClick={() => removeWorksheet(worksheet.id)}
                            />
                        </Flex>

                        {/* Day Distribution Grid */}
                        <HStack spacing={2} wrap="wrap">
                            {sortedGlobalDays.map((day) => {
                                const isSelected = worksheet.selectedDays.includes(day.value);
                                return (
                                    <Button
                                        key={day.value}
                                        size="sm"
                                        onClick={() => toggleWorksheetDay(worksheet.id, day.value)}
                                        w="40px"
                                        h="40px"
                                        borderRadius="md"
                                        p={0}
                                        variant="unstyled"
                                        bg={isSelected ? '#53A8FE' : 'gray.50'}
                                        color={isSelected ? 'white' : 'gray.500'}
                                        border="1px solid"
                                        borderColor={isSelected ? '#53A8FE' : 'gray.200'}
                                        _hover={{
                                            bg: isSelected ? '#4293E3' : 'gray.100',
                                        }}
                                        fontWeight="medium"
                                        fontSize="sm"
                                    >
                                        {day.label}
                                    </Button>
                                );
                            })}
                        </HStack>
                    </Box>
                ))}

                {/* Add Worksheet Button */}
                <Button
                    onClick={addWorksheet}
                    variant="outline"
                    colorScheme="blue"
                    w="full"
                    h="50px"
                    borderStyle="dashed"
                    borderColor="#53A8FE"
                    color="#53A8FE"
                    leftIcon={<AddIcon />}
                    _hover={{ bg: 'blue.50' }}
                >
                    학습지 추가
                </Button>
            </VStack>
        </Box>
    );
};
