import { useEffect } from 'react';
import { 
    Box, Button, Container, Flex, Text, VStack, Divider 
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';

import { TaskDetailHeader } from '@/widgets/task-detail/TaskDetailHeader';
import { ImageSlider } from '@/widgets/task-detail/ImageSlider';
import { ResourceSlider, StudyMaterial } from '@/widgets/task-detail/ResourceSlider';
import { useAuthStore } from '@/shared/stores/authStore';
import { useTaskFeedbackStore } from '@/shared/stores/taskFeedbackStore';
import { 
    getTaskDetailById, 
    getFeedbacksAndAnswersByImageIds 
} from '@/shared/mocks/totalMockData';

const MenteeTaskDetailPage = () => {
    const { taskId } = useParams(); 
    const navigate = useNavigate();
    const { user } = useAuthStore();
    
    const { loadFeedbacks, loadAnswers, resetUIState } = useTaskFeedbackStore();
    const data = getTaskDetailById(taskId);
    
    const submissionImages = data?.submission?.images.map((url, idx) => ({
        id: `img-${idx}`, imageUrl: url
    })) || [];

    const studyMaterials: StudyMaterial[] = [];
    if (data?.weakness?.file) {
        studyMaterials.push({
            id: 'weakness-file',
            title: data.weakness.file.title,
            url: data.weakness.file.url,
            label: `${data.weakness.title}`
        });
    }
    if (data?.taskFile) {
        studyMaterials.push({
            id: 'task-file',
            title: data.taskFile.title,
            url: data.taskFile.url,
            label: '과제 첨부 파일'
        });
    }

    useEffect(() => {
        if (data?.submission?.isFeedbackReceived && submissionImages.length > 0) {
            const imageIds = submissionImages.map(img => img.id);
            const { feedbacks, answers } = getFeedbacksAndAnswersByImageIds(imageIds);
            resetUIState();
            loadFeedbacks(feedbacks);
            loadAnswers(answers);
        }
    }, [taskId, data]);

    const handleBackToList = () => navigate(-1);

    if (!user || !data) return null;

    return (
        <Container maxW="container.lg" py={6} minH="100vh">
            <VStack spacing={{base:0, md:8}} align="stretch" maxW="1000px" mx="auto">
                <Box>
                    <TaskDetailHeader
                        subject={data.subject}
                        date={data.taskDate}
                        isMentorChecked={data.isMentorChecked}
                        title={data.title}
                        supplement={data.weakness?.title} 
                    />
                </Box>
                <Divider display={{base:'none', md:'flex'}}/>

                {data.submission?.isFeedbackReceived ? (
                    <>
                        <Box>
                            <Text fontSize={{base:'md', md:'2xl'}} fontWeight="bold" color="#333333" mb={6}>도착한 피드백 확인하기</Text>
                            <ImageSlider 
                                images={submissionImages}
                                taskId={data.id}
                                currentUserId={user.id}
                                userRole="MENTEE"
                            />
                        </Box>
                        <Box>
                            <Text fontSize={{base:'md', md:'2xl'}} fontWeight="bold" mb={4} color="#333333">나의 메모</Text>
                            <Box p={6} bg="#F9FAFB" borderRadius="12px">
                                <Text color="#333333" fontSize="15px">{data.submission?.memo}</Text>
                            </Box>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box>
                            <Text fontSize={{base:'md', md:'2xl'}} fontWeight="bold" color="#333333" mb={6}>학습 자료</Text>
                            
                            {studyMaterials.length > 0 ? (
                                <VStack spacing={8} align="stretch">
                                    {studyMaterials.map((material) => (
                                        <Box key={material.id}>
                                            <ResourceSlider materials={[material]} />
                                        </Box>
                                    ))}
                                </VStack>
                            ) : (
                                <Box py={10} textAlign="center" bg="gray.50" borderRadius="xl" color="gray.500">등록된 학습 자료가 없습니다.</Box>
                            )}
                        </Box>

                        <Flex mt={4} justify={'flex-end'}>
                            <Button 
                                p={6} size="sm" bg='#53A8FE' borderRadius="30" fontSize="md"
                                color={'white'}
                                rightIcon={<ChevronRightIcon boxSize={6}/>}
                                onClick={() => navigate(`/mentee/task/${taskId}/submit`)}
                            >
                                {data.submission ? '과제 수정하기' : '과제 제출하기'}
                            </Button>
                        </Flex>
                    </>
                )}

                <Flex justify="center" pt={8} pb={10}>
                    <Button size="lg" w="200px" h="52px" onClick={handleBackToList}>목록으로</Button>
                </Flex>
            </VStack>
        </Container>
    );
};

export default MenteeTaskDetailPage;