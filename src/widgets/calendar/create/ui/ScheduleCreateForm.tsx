import { Box, Button, Flex, Heading, Input, Text, VStack, useToast } from '@chakra-ui/react';
import { SubjectSection } from './SubjectSection';
import { WeaknessSelectBox } from './WeaknessSelectBox';
import { DaySelector } from './DaySelector';
import { LearningMaterialSection } from './LearningMaterialSection';
import { useScheduleCreateStore } from '../model/store';
import { useNavigate } from 'react-router-dom';

// New Imports for Task Creation
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { Task } from '@/entities/task/types';
import { addDays, startOfWeek, addWeeks, format } from 'date-fns';
import { getAdjustedDate } from '@/shared/lib/date'; // Assuming this exists or use new Date()

// Helper to calculate date from "1주차" + "MONDAY"
const calculateDate = (weekLabel: string, dayValue: string): string => {
    const today = new Date();
    // Assuming '1주차' is the current week of Today.
    // '2주차' is next week, etc.
    const weekIndex = parseInt(weekLabel.replace('주차', '')) - 1;

    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
    const targetWeekStart = addWeeks(startOfCurrentWeek, weekIndex);

    const dayMap: { [key: string]: number } = {
        'MONDAY': 0, 'TUESDAY': 1, 'WEDNESDAY': 2, 'THURSDAY': 3,
        'FRIDAY': 4, 'SATURDAY': 5, 'SUNDAY': 6
    };

    const dayOffset = dayMap[dayValue] || 0;
    const targetDate = addDays(targetWeekStart, dayOffset);

    return format(targetDate, 'yyyy-MM-dd');
};

export const ScheduleCreateForm = () => {
    const {
        title, setTitle,
        subject, selectedWeek, selectedDays,
        selectedWeaknessId,
        worksheets
    } = useScheduleCreateStore();
    const navigate = useNavigate();

    const toast = useToast();

    // Access Planner Store
    const addTask = usePlannerStore((state) => state.addTask);

    const handleSave = () => {
        // Validation
        if (!title.trim()) {
            toast({ title: "제목을 입력해주세요.", status: "warning", duration: 2000, isClosable: true });
            return;
        }

        if (selectedDays.length === 0) {
            toast({ title: "요일을 선택해주세요.", status: "warning", duration: 2000, isClosable: true });
            return;
        }

        const tasksToCreate: Task[] = [];
        const daysCoveredWithWorksheets = new Set<string>();

        // 1. Create Tasks for Worksheets
        worksheets.forEach((ws) => {
            ws.selectedDays.forEach((day) => {
                if (!subject) return;

                const taskDate = calculateDate(selectedWeek, day);
                const newTask: Task = {
                    id: crypto.randomUUID(),
                    subject: subject,
                    title: `${title} - ${ws.file?.name || '학습지'}`, // Append file name to title
                    status: 'PENDING',
                    taskDate: taskDate,
                    recurringGroupId: null,
                    isMentorChecked: false,
                    isMandatory: true,
                    contentId: ws.id, // Link to worksheet
                    weaknessId: selectedWeaknessId,
                    menteeId: 'mentee1', // Mock Mentee
                };

                tasksToCreate.push(newTask);
                daysCoveredWithWorksheets.add(day);
            });
        });

        // 2. Create Tasks for Global Days NOT covered by any worksheet
        selectedDays.forEach((day) => {
            if (!daysCoveredWithWorksheets.has(day)) {
                if (!subject) return;

                const taskDate = calculateDate(selectedWeek, day);
                const newTask: Task = {
                    id: crypto.randomUUID(),
                    subject: subject,
                    title: title,
                    status: 'PENDING',
                    taskDate: taskDate,
                    recurringGroupId: null,
                    isMentorChecked: false,
                    isMandatory: true,
                    contentId: null,
                    weaknessId: selectedWeaknessId,
                    menteeId: 'mentee1',
                };
                tasksToCreate.push(newTask);
            }
        });

        // Dispatch Actions
        tasksToCreate.forEach(task => addTask(task));

        console.log("Tasks Created:", tasksToCreate);

        toast({
            title: "일정이 저장되었습니다.",
            description: `${tasksToCreate.length}개의 과제가 생성되었습니다.`,
            status: "success",
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
                                placeholder="제목을 입력하세요 (예: 독서 2지문 (2))"
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
                            취소
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
                            저장
                        </Button>
                    </Flex>
                </VStack>
            </Box>
        </Flex>
    );
};
