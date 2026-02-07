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
                fullPath: '', // In a real scenario, this would be a URL
                name: file.name,
                size: file.size,
            });
        }
    };

    if (sortedGlobalDays.length === 0) {
        return null; // Or show empty state if desired, but requirement implies hidden if no days
    }

    return (
        <Box animation="fadeIn 0.3s">
            <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={3}>학습지</Text>

            <VStack spacing={3} align="stretch">
                {worksheets.map((worksheet) => (
                    <Flex key={worksheet.id} align="center" gap={4}>
                        {/* File Input/Display Box */}
                        <Box
                            flex={1}
                            h="50px"
                            border="1px solid"
                            borderColor={worksheet.file ? '#53A8FE' : 'gray.200'}
                            borderRadius="lg"
                            bg="white"
                            px={4}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            transition="all 0.2s"
                            _hover={{ borderColor: worksheet.file ? '#53A8FE' : 'gray.300' }}
                        >
                            {worksheet.file ? (
                                <>
                                    <Text fontSize="md" fontWeight="medium" color="gray.900" isTruncated>
                                        {worksheet.file.name}
                                    </Text>
                                    <IconButton
                                        aria-label="Remove file"
                                        icon={<SmallCloseIcon />}
                                        size="sm"
                                        variant="ghost"
                                        color="gray.400"
                                        onClick={() => removeWorksheet(worksheet.id)}
                                        _hover={{ bg: 'transparent', color: 'red.500' }}
                                    />
                                </>
                            ) : (
                                <Box position="relative" w="full" h="full">
                                    <Input
                                        type="file"
                                        id={`file-${worksheet.id}`}
                                        display="none"
                                        onChange={(e) => handleFileChange(worksheet.id, e)}
                                    />
                                    <label
                                        htmlFor={`file-${worksheet.id}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Text color="gray.400" fontSize="md">파일을 선택해주세요</Text>
                                        <Box flex={1} />
                                        <Icon as={SmallCloseIcon} w={5} h={5} color="gray.300"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeWorksheet(worksheet.id);
                                            }}
                                        />
                                    </label>
                                </Box>
                            )}
                        </Box>

                        {/* Day Distribution Buttons - Side by Side */}
                        <HStack spacing={2}>
                            {sortedGlobalDays.map((day) => {
                                const isSelected = worksheet.selectedDays.includes(day.value);
                                return (
                                    <Button
                                        key={day.value}
                                        onClick={() => toggleWorksheetDay(worksheet.id, day.value)}
                                        w="40px" // Square shape
                                        h="40px" // Square shape
                                        borderRadius="md" // Slightly rounded
                                        p={0}
                                        variant="unstyled"
                                        bg={isSelected ? '#53A8FE' : 'white'}
                                        color={isSelected ? 'white' : 'gray.400'} // Gray text when unselected
                                        border="1px solid"
                                        borderColor={isSelected ? '#53A8FE' : 'gray.200'}
                                        fontSize="sm"
                                        fontWeight="normal"
                                        _hover={{
                                            bg: isSelected ? '#4293E3' : 'gray.50',
                                            borderColor: isSelected ? '#4293E3' : 'gray.300'
                                        }}
                                    >
                                        {day.label}
                                    </Button>
                                );
                            })}
                        </HStack>
                    </Flex>
                ))}

            </VStack>
        </Box>
    );
};
