import { 
    Box, 
    Button, 
    Container, 
    Flex, 
    Text, 
    VStack, 
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import { ImageSlider, TaskDetailHeader } from '@/widgets/task-detail';
import { MOCK_TASK_DETAIL_DATA } from '@/features/task-detail/model/mockTaskDetail';
import { useAuthStore } from '@/shared/stores/authStore';

const MenteeTaskDetailPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const { user } = useAuthStore();
    const data = MOCK_TASK_DETAIL_DATA;

    const formattedImages = data.submissionImages.map((url, idx) => ({
        id: `img-${idx}`,
        imageUrl: url
    }));

    const handleBackToList = () => {
        navigate(-1); 
    };

    if (!user) return null;

    return (
        <Container maxW="container.lg" py={12} bg="white" minH="100vh">
            <VStack spacing={10} align="stretch" maxW="1000px" mx="auto">
                
                <Box>
                    <TaskDetailHeader
                        subject={data.subject}
                        date={data.date}
                        isMentorChecked={data.isMentorChecked}
                        title={data.title}
                        supplement={data.description ? data.description.replace('보완점: ', '') : ''} 
                    />
                </Box>

                <Box>
                    <Flex justify="space-between" align="center" mb={6}>
                        <Text fontSize="18px" fontWeight="bold" color="#333333">
                            도착한 피드백 확인하기
                        </Text>
                    </Flex>
                    
                    <ImageSlider 
                        images={formattedImages} 
                        taskId={id || 'temp-task-id'}
                        currentUserId={user.id} 
                        
                        userRole={"MENTEE"}   
                    />
                </Box>

                <Box>
                    <Text fontSize="16px" fontWeight="bold" mb={4} color="#333333">나의 메모</Text>
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

                <Flex justify="center" pt={8} pb={10}>
                    <Button
                        size="lg"
                        w="200px"
                        h="52px"
                        colorScheme="gray"
                        bg="gray.100"
                        color="gray.700"
                        _hover={{ bg: 'gray.200' }}
                        onClick={handleBackToList}
                    >
                        목록으로
                    </Button>
                </Flex>

            </VStack>
        </Container>
    );
};

export default MenteeTaskDetailPage;
