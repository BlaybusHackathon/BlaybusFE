// src/pages/mentee/task/submit/index.tsx
import { 
    Box, Button, Container, VStack, Textarea, 
    Input, Flex, Text
} from '@chakra-ui/react';
import { DownloadIcon, AddIcon } from '@chakra-ui/icons'; // CloseIcon 제거 (Slider 내부로 이동됨)
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { useTaskSubmission } from '@/features/task-submission/model/useTaskSubmission';
import { MOCK_WEAKNESSES } from '@/features/weakness/model/mockWeaknessData';
import { TaskDetailHeader } from '@/widgets/task-detail/TaskDetailHeader';

// [New] ImageSlider 및 데이터 타입 가져오기
import { ImageSlider, SubmissionImageData } from '@/widgets/task-detail/ImageSlider';

const MenteeTaskSubmissionPage = () => {
    const { taskId } = useParams(); 
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { tasks } = usePlannerStore(); 

    const task = tasks.find(t => t.id === taskId);
    const weakness = MOCK_WEAKNESSES.find(w => w.id === task?.weaknessId);

    const { 
        memo, setMemo, images, 
        handleAddImages, handleRemoveImage, handleSubmit 
    } = useTaskSubmission(taskId || '', '');

    if (!user) return <Box p={10} textAlign="center">로그인이 필요합니다.</Box>;
    if (!task) return <Box p={10} textAlign="center">과제 정보를 찾을 수 없습니다. (ID: {taskId})</Box>;

    const onComplete = () => {
        handleSubmit();
        navigate(-1);
    };

    // [변환] 로컬 이미지 상태(previewUrl)를 ImageSlider 포맷(imageUrl)으로 매핑
    const sliderImages: SubmissionImageData[] = images.map(img => ({
        id: img.id,
        imageUrl: img.previewUrl
    }));

    return (
        <Container maxW="container.lg" py={12} bg="white" minH="100vh">
            <VStack spacing={10} align="stretch" maxW="1000px" mx="auto">
                
                {/* 1. 헤더 */}
                <TaskDetailHeader
                    title={task.title}
                    subject={task.subject}
                    date={task.taskDate}
                    isMentorChecked={task.isMentorChecked}
                    supplement={weakness?.title}
                    action={weakness?.fileUrl && (
                        <Button 
                            as="a" 
                            href={weakness.fileUrl} 
                            download 
                            leftIcon={<DownloadIcon />} 
                            size="sm" 
                            colorScheme="gray" 
                            variant="outline"
                            _hover={{ bg: 'gray.100' }}
                        >
                            학습지 다운로드
                        </Button>
                    )}
                />

                {/* 2. 보완점 미리보기 */}
                {weakness?.fileUrl && (
                    <Box>
                         <Text fontSize="lg" fontWeight="bold" mb={4}>학습지 미리보기</Text>
                        <Box 
                            w="100%" 
                            h="500px" 
                            bg="gray.50" 
                            borderRadius="xl" 
                            overflow="hidden"
                            border="1px solid"
                            borderColor="gray.200"
                        >
                            <iframe 
                                src={weakness.fileUrl} 
                                width="100%" 
                                height="100%" 
                                title="Task Preview"
                                style={{ border: 'none' }}
                            /> 
                        </Box>
                    </Box>
                )}

                {/* 3. 과제 인증샷 업로드 (ImageSlider 재사용) */}
                <Box>
                    <Flex justify="space-between" align="center" mb={4}>
                        <Text fontSize="lg" fontWeight="bold">과제 인증샷 올리기</Text>
                        
                        {/* 사진 추가 버튼 (슬라이더 밖 상단에 배치) */}
                        <Box as="label" cursor="pointer">
                            <Input 
                                type="file" 
                                accept="image/*" 
                                display="none" 
                                multiple 
                                onChange={handleAddImages}
                            />
                            <Button 
                                as="span" 
                                size="sm" 
                                leftIcon={<AddIcon />} 
                                colorScheme="blue" 
                                variant="outline"
                            >
                                사진 추가
                            </Button>
                        </Box>
                    </Flex>

                    {/* [핵심] 재사용된 ImageSlider */}
                    <Box w="full">
                        {sliderImages.length > 0 ? (
                            <ImageSlider 
                                images={sliderImages}
                                taskId={taskId || ''}
                                currentUserId={user.id}
                                userRole={user.role}
                                onDelete={handleRemoveImage} // 삭제 함수 전달 -> 제출 모드 활성화
                            />
                        ) : (
                            // 이미지가 없을 때의 Empty State (클릭하여 업로드 유도)
                            <Box 
                                as="label"
                                w="full" 
                                h="400px" 
                                bg="gray.50" 
                                borderRadius="xl" 
                                border="2px dashed" 
                                borderColor="gray.300"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                cursor="pointer"
                                _hover={{ borderColor: 'blue.400', bg: 'blue.50' }}
                            >
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    display="none" 
                                    multiple 
                                    onChange={handleAddImages}
                                />
                                <AddIcon boxSize={8} color="gray.400" mb={4} />
                                <Text color="gray.500" fontSize="lg" fontWeight="medium">
                                    여기를 눌러 과제 사진을 업로드하세요
                                </Text>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* 4. 메모 작성 */}
                <Box>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>나의 메모</Text>
                    <Textarea 
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="과제를 하면서 어려웠던 점이나 멘토님께 하고 싶은 말을 적어주세요."
                        minH="150px"
                        p={4}
                        bg="gray.50"
                        border="none"
                        borderRadius="xl"
                        resize="none"
                        focusBorderColor="blue.400"
                        _placeholder={{ color: 'gray.400' }}
                    />
                </Box>

                {/* 5. 제출 버튼 */}
                <Flex justify="center" pt={4} pb={10}>
                    <Button 
                        size="lg" 
                        colorScheme="blue" 
                        w="full" 
                        maxW="300px"
                        h="56px"
                        fontSize="lg"
                        borderRadius="xl"
                        onClick={onComplete}
                        isDisabled={images.length === 0}
                    >
                        과제 제출완료
                    </Button>
                </Flex>

            </VStack>
        </Container>
    );
};

export default MenteeTaskSubmissionPage;