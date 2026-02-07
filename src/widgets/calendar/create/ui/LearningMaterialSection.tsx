import { Box, Button, Flex, Icon, Input, Text, VStack, useToast } from '@chakra-ui/react';
import React from 'react';
import { useScheduleCreateStore } from '../model/store';
import { DAYS } from '../model/mockData';
import { CheckCircleIcon, SmallCloseIcon, AttachmentIcon, AddIcon } from '@chakra-ui/icons';

export const LearningMaterialSection = () => {
    const { selectedDays, materialsByDay, setMaterialForDay } = useScheduleCreateStore();

    // Sort selected days to match the order in DAYS (e.g., Mon -> Sun)
    const sortedSelectedDays = DAYS.filter((day) => selectedDays.includes(day.value));

    const handleFileChange = (dayValue: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setMaterialForDay(dayValue, {
                fullPath: '', // In a real scenario, this would be a URL
                name: file.name,
                size: file.size,
            });
        }
    };

    const handleRemoveFile = (dayValue: string) => {
        setMaterialForDay(dayValue, null);
    };

    if (sortedSelectedDays.length === 0) {
        return null;
    }

    return (
        <Box animation="fadeIn 0.3s">
            <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={3}>학습지</Text>
            <VStack spacing={3} align="stretch">
                {sortedSelectedDays.map((day) => {
                    const material = materialsByDay[day.value];

                    return (
                        <Box key={day.value}>
                            {material ? (
                                <Flex
                                    align="center"
                                    justify="space-between"
                                    px={4}
                                    py={3}
                                    bg="white"
                                    border="1px solid"
                                    borderColor="#53A8FE"
                                    borderRadius="lg"
                                    height="50px"
                                >
                                    <Text color="gray.900" isTruncated fontSize="md">{material.name}</Text>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleRemoveFile(day.value)}
                                        minW="auto"
                                        p={1}
                                        color="gray.400"
                                    >
                                        <Icon as={SmallCloseIcon} w={5} h={5} />
                                    </Button>
                                </Flex>
                            ) : (
                                <Box position="relative" width="full">
                                    <Input
                                        type="file"
                                        id={`file-${day.value}`}
                                        display="none"
                                        onChange={(e) => handleFileChange(day.value, e)}
                                    />
                                    <label htmlFor={`file-${day.value}`} style={{ width: '100%' }}>
                                        <Flex
                                            align="center"
                                            justify="center"
                                            w="full"
                                            height="50px"
                                            bg="white"
                                            border="1px solid"
                                            borderColor="#53A8FE"
                                            borderRadius="lg"
                                            color="#53A8FE"
                                            cursor="pointer"
                                            transition="all 0.2s"
                                            _hover={{ bg: 'blue.50' }}
                                        >
                                            <Icon as={AddIcon} w={3} h={3} mr={2} />
                                            <Text fontSize="md" fontWeight="medium">{day.label}요일 학습지 추가</Text>
                                        </Flex>
                                    </label>
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </VStack>
        </Box>
    );
};
