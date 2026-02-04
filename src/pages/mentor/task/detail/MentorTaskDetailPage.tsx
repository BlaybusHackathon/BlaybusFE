import { Box, Button, Container, Flex, Text, VStack } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageSlider } from './ui/ImageSlider';
import { TaskDetailHeader } from './ui/TaskDetailHeader';
import { MOCK_TASK_DETAIL_DATA } from './mockTaskDetail';


const MentorTaskDetailPage = () => {
    const { menteeId, taskId } = useParams();
    const navigate = useNavigate();

    // In a real app, fetch data based on menteeId and taskId
    // const { data } = useQuery(...)
    console.log('Task Detail:', menteeId, taskId);

    const data = MOCK_TASK_DETAIL_DATA;

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
