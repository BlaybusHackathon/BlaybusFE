import { Box, Button, Flex, Heading, Input, Text, VStack, useToast } from '@chakra-ui/react';
import { SubjectSection } from './SubjectSection';
import { WeaknessSelectBox } from './WeaknessSelectBox';
import { DaySelector } from './DaySelector';
import { LearningMaterialSection } from './LearningMaterialSection';
import { useScheduleCreateStore } from '../model/store';
import { useNavigate, useParams } from 'react-router-dom';
import { getWeekDateRange } from '../model/dateOptions';
import { taskApi } from '@/features/task/api/taskApi';
import { studyContentApi } from '@/features/study-content/api/studyContentApi';


export const ScheduleCreateForm = () => {
    const {
        title, setTitle,
        subject, selectedWeek, selectedDays,
        selectedWeaknessId,
        worksheets
    } = useScheduleCreateStore();
    const navigate = useNavigate();
    const { menteeId } = useParams();

    const toast = useToast();


    const handleSave = async () => {
        // Validation
        if (!title.trim()) {
            toast({ title: "Please enter a title.", status: "warning", duration: 2000, isClosable: true });
            return;
        }

        if (selectedDays.length === 0) {
            toast({ title: "Please select at least one day.", status: "warning", duration: 2000, isClosable: true });
            return;
        }

        if (!subject) {
            return;
        }

        const today = new Date();
        const { weekNumber, startDate, endDate } = getWeekDateRange(
            today.getFullYear(),
            today.getMonth() + 1,
            selectedWeek
        );

        const toBackendDay = (day: string) => {
            const map: Record<string, string> = {
                MONDAY: 'MON',
                TUESDAY: 'TUE',
                WEDNESDAY: 'WED',
                THURSDAY: 'THU',
                FRIDAY: 'FRI',
                SATURDAY: 'SAT',
                SUNDAY: 'SUN',
            };
            return map[day] ?? day;
        };

        const dayContentMap: Record<string, string | number | null> = {};
        const dayContents: Array<{ day: string; contentId?: string | number | null }> = [];

        for (const ws of worksheets) {
            if (ws.selectedDays.length === 0) {
                continue;
            }

            let worksheetContentId: string | number | null = null;
            const rawFile = ws.file?.rawFile;
            if (rawFile) {
                try {
                    const uploaded = await studyContentApi.upload(rawFile, {
                        title: ws.file?.name ?? rawFile.name,
                        subject,
                    });
                    worksheetContentId = uploaded?.id ?? null;
                } catch (error) {
                    console.error('Failed to upload study content', error);
                }
            }

            ws.selectedDays.forEach((day) => {
                if (dayContentMap[day] !== undefined) return;
                dayContentMap[day] = worksheetContentId;
            });
        }

        const daysOfWeek = selectedDays.map(toBackendDay);
        selectedDays.forEach((day) => {
            dayContents.push({
                day: toBackendDay(day),
                contentId: dayContentMap[day] ?? null,
            });
        });

        // Dispatch Actions
        if (!menteeId) {
            return;
        }
        try {
            await taskApi.createMentorTask(menteeId, {
                subject,
                weekNumber,
                startDate,
                endDate,
                daysOfWeek,
                title,
                weaknessId: selectedWeaknessId,
                dayContents,
            });
        } catch (error) {
            console.error('Failed to create tasks', error);
            return;
        }

        console.log("Tasks Created");

        toast({
            title: "Tasks created.",
            description: `${dayContents.length} tasks created.`, 
            duration: 2000,
            isClosable: true,
        });

        // Navigate back
        // setTimeout(() => navigate(-1), 1000);
    };

    return (
        <Flex direction="column" w="full" h="full" p={8}>
            <Heading size="lg" mb={4}>일정 만들기</Heading>
            <Text color="gray.500" mb={8}>학생의 학습 성향에 맞는 과제를 설정해주세요.</Text>

            <Box flex={1} bg="white" borderRadius="lg" p={0}>
                <VStack spacing={8} align="stretch">
                    {/* Top Row: Subject and Global Days */}
                    <Flex gap={10} align="flex-start">
                        <Box flex={1}>
                            <SubjectSection />
                        </Box>
                        <Box flex={1}>
                            <DaySelector />
                        </Box>
                    </Flex>

                    {/* Title Row - Left Column Only */}
                    <Flex gap={10}>
                        <Box flex={1}>
                            <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={3}>제목</Text>
                            <Input
                                placeholder="제목을 입력해주세요."
                                size="lg"
                                fontSize="md"
                                bg="white"
                                borderColor="blue.200"
                                borderRadius="lg"
                                focusBorderColor="blue.400"
                                _placeholder={{ color: 'gray.400' }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Box>
                        <Box flex={1} /> {/* Spacer for connection */}
                    </Flex>

                    {/* Weakness Row - Left Column Only */}
                    <Flex gap={10}>
                        <Box flex={1}>
                            <WeaknessSelectBox />
                        </Box>
                        <Box flex={1} /> {/* Spacer for connection */}
                    </Flex>

                    {/* Worksheets Section - Handles its own split */}
                    <LearningMaterialSection />

                    <Flex justify="flex-end" gap={3} mt={4}>
                        <Button
                            size="lg"
                            variant="outline"
                            colorScheme="gray"
                            onClick={() => navigate(-1)}
                            px={8}
                            h="50px"
                            bg="white"
                        >
                            Cancel
                        </Button>
                        <Button
                            size="lg"
                            colorScheme="blue"
                            bg="#53A8FE"
                            color="white"
                            px={8}
                            h="50px"
                            _hover={{ bg: 'blue.400' }}
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </Flex>
                </VStack>
            </Box>
        </Flex>
    );
};
