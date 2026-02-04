import { Box, Button, Container, Flex, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ImageSlider } from './ui/ImageSlider';
import { TaskDetailHeader } from './ui/TaskDetailHeader';
import { MOCK_TASK_DETAIL_DATA } from './mockTaskDetail';


const MentorTaskDetailPage = () => {
    // const { menteeId, taskId } = useParams();
    const navigate = useNavigate();

    // In a real app, fetch data based on menteeId and taskId
    const data = MOCK_TASK_DETAIL_DATA;

    return (
        <Container maxW="container.lg" py={12} bg="white" minH="100vh">
            <VStack spacing={10} align="stretch" maxW="1000px" mx="auto">
                {/* Header Section */}
                <Box>
                    <TaskDetailHeader
                        subject={data.subject}
                        date={data.date}
                        isMentorChecked={data.isMentorChecked}
                        title={data.title}
                        supplement={data.description.replace('보완점: ', '')} // Adjust data if needed
                    />
                </Box>


                {/* Submission Viewer Section */}
                <Box>
                    <Text fontSize="18px" fontWeight="bold" mb={6} color="#333333">학습 점검하기</Text>
                    <ImageSlider images={data.submissionImages} />
                </Box>

                {/* Mentee Comment Section */}
                <Box>
                    <Text fontSize="16px" fontWeight="bold" mb={4} color="#333333">남긴 메모</Text>
                    <Box
                        p={6}
                        bg="#F9FAFB"
                        borderRadius="12px"
                        minH="100px"
                    >
                        <Text color="#333333" fontSize="15px" lineHeight="1.6">
                            {data.menteeComment}
                        </Text>
                    </Box>
                </Box>

                {/* Footer Buttons */}
                <Flex justify="flex-end" gap={3} pt={8} pb={10}>
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        h="48px"
                        px={8}
                        borderColor="#E5E7EB"
                        color="#666666"
                        bg="white"
                        _hover={{ bg: 'gray.50' }}
                    >
                        취소
                    </Button>
                    <Button
                        colorScheme="blue"
                        bg="#3B82F6"
                        h="48px"
                        px={8}
                        _hover={{ bg: 'blue.600' }}
                    >
                        저장
                    </Button>
                </Flex>

            </VStack>
        </Container>
    );
};

export default MentorTaskDetailPage;
