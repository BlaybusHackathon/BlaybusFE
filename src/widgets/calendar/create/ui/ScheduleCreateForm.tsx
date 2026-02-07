import { Box, Button, Flex, Heading, Input, Text, VStack } from '@chakra-ui/react';
import { SubjectSection } from './SubjectSection';
import { WeaknessSelectBox } from './WeaknessSelectBox';
import { DaySelector } from './DaySelector';
import { LearningMaterialSection } from './LearningMaterialSection';
import { useScheduleCreateStore } from '../model/store';
import { useNavigate } from 'react-router-dom';

export const ScheduleCreateForm = () => {
    const { title, setTitle } = useScheduleCreateStore();
    const navigate = useNavigate();

    return (
        <Flex direction="column" w="full" h="full" p={8}>
            <Heading size="lg" mb={4}>일정 만들기</Heading>
            <Text color="gray.500" mb={8}>학생의 학습 성향에 맞는 과제를 설정해주세요.</Text>

            <Box flex={1} bg="white" borderRadius="lg" p={0}>
                <VStack spacing={8} align="stretch">
                    {/* Top Row: Subject and Days */}
                    <Flex gap={10} wrap="wrap">
                        <Box flex={1}>
                            <SubjectSection />
                        </Box>
                        <Box flex={1}>
                            <DaySelector />
                        </Box>
                    </Flex>

                    <Box>
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

                    <WeaknessSelectBox />

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
                        >
                            저장
                        </Button>
                    </Flex>
                </VStack>
            </Box>
        </Flex>
    );
};
