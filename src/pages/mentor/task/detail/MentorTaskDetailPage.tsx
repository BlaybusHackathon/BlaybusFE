import { Box, Button, Container, Flex, Text, VStack } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageSlider } from './ImageSlider';
import { TaskDetailHeader } from './TaskDetailHeader';

// Mock Data - 나중에 API로 대체
const MOCK_TASK_DATA = {
    taskId: '1',
    subject: '영어',
    date: '2026.02.05',
    isMentorChecked: true,
    title: '영어 단어 20개',
    description: '보완점: 단어암기',
    submissionImages: [
        '/Users/yangjunsig/.gemini/antigravity/brain/efa4cad9-4ea3-4ff4-a858-0de0dbc3dbbe/uploaded_image_1770189841464.png',
        // 'https://via.placeholder.com/600x800?text=Submission+2', 
        // 'https://via.placeholder.com/600x800?text=Submission+3',
    ],
    menteeComment: '틀린 단어는 체크해두었고, 다음 복습 때 예문이랑 같이 다시 외울 예정입니다.',
};


const MentorTaskDetailPage = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { menteeId, taskId } = useParams();
    const navigate = useNavigate();

    // In a real app, fetch data based on menteeId and taskId
    // const { data } = useQuery(...)
    const data = MOCK_TASK_DATA;

    return (
        <Container maxW="container.lg" py={8} bg="white" minH="100vh">
            <VStack spacing={8} align="stretch">
                {/* Header Section */}
                <Box>
                    <TaskDetailHeader
                        subject={data.subject}
                        date={data.date}
                        isMentorChecked={data.isMentorChecked}
                        title={data.title}
                    />

                    <Flex mb={6} gap={4}>
                        <Text fontWeight="bold" minW="60px" color="gray.600">보완점</Text>
                        <Text>{data.description}</Text>
                    </Flex>
                </Box>


                {/* Submission Viewer Section */}
                <Box>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>학습 점검하기</Text>
                    <ImageSlider images={data.submissionImages} />
                </Box>

                {/* Mentee Comment Section */}
                <Box bg="gray.50" p={6} borderRadius="lg">
                    <Text fontWeight="bold" mb={3}>남긴 메모</Text>
                    <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
                        <Text whiteSpace="pre-wrap" fontSize="sm">{data.menteeComment}</Text>
                    </Box>
                </Box>

                {/* Actions (Placeholder for now) */}
                <Flex justify="flex-end" gap={3} pt={4}>
                    <Button variant="outline" onClick={() => navigate(-1)}>취소</Button>
                    <Button colorScheme="blue">저장</Button>
                </Flex>

            </VStack>
        </Container>
    );
};

export default MentorTaskDetailPage;
