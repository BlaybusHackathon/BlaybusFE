import { useEffect } from 'react';
import { 
    Box, Button, Container, VStack, Textarea, 
    Input, Flex, Text, useToast
} from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';
import { AddIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuthStore } from '@/shared/stores/authStore';
import { useTaskSubmission } from '@/features/task-submission/model/useTaskSubmission';
import { submissionApi } from '@/features/task-submission/api/submissionApi';
import { TaskDetailHeader } from '@/widgets/task-detail/TaskDetailHeader';
import { ImageSlider, SubmissionImageData } from '@/widgets/task-detail/ImageSlider';
import { useTaskDetail } from '@/features/task/model/useTaskDetail';

const MenteeTaskSubmissionPage = () => {
    const { taskId } = useParams(); 
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const toast = useToast();

    const { data: taskData, isLoading } = useTaskDetail(taskId);

    const { 
        memo, setMemo, images, setImages,
        handleAddImages, handleRemoveImage, handleSubmit,
        isSubmitting
    } = useTaskSubmission(taskId || '', taskData?.submission?.memo || '');

    useEffect(() => {
        if (taskData?.submission && taskData.submission.images.length > 0) {
            const initialImages = taskData.submission.images.map((url, idx) => ({
                id: `existing-${idx}`,
                file: new File([], "existing_image"),
                previewUrl: url,
                isExisting: true
            }));
            
            setImages(initialImages);
        }
    }, [taskData, setImages]);

    const handleDeleteImage = async (imageId: string) => {
        const target = images.find((img) => img.id === imageId);
        if (target?.isExisting && taskData?.submission?.id) {
            try {
                await submissionApi.deleteSubmission(taskData.submission.id);
                setImages([]);
                setMemo('');
            } catch (e) {
                console.error('Failed to delete submission:', e);
            }
            return;
        }
        handleRemoveImage(imageId);
    };

    const onAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (images.length + e.target.files.length > 20) {
                toast({
                    title: '이미지 초과',
                    description: '최대 20장까지만 업로드 가능합니다.',
                    status: 'warning',
                    isClosable: true,
                });
                return;
            }
            handleAddImages(e);
        }
    };

    const onComplete = async () => {
        try {
            await handleSubmit();
        toast({ title: '제출이 완료되었습니다.', status: 'success' });
            navigate(-1);
        } catch {
            toast({ title: '제출에 실패하였습니다.', status: 'error' });
        }
    };

    if (isLoading) return <Box p={10}>로딩중..</Box>;
    if (!user) return <Box p={10}>로그인이 필요합니다.</Box>;
    if (!taskData) return <Box p={10}>과제 정보가 없습니다.</Box>;

    const sliderImages: SubmissionImageData[] = images.map(img => ({
        id: img.id,
        imageUrl: img.previewUrl
    }));

    return (
        <Container maxW="container.lg" py={6} minH="100vh">
            <VStack align="stretch" maxW="1000px" mx="auto">
                
                <TaskDetailHeader
                    title={taskData.title}
                    subject={taskData.subject}
                    date={taskData.taskDate}
                    isMentorChecked={taskData.isMentorChecked}
                    isMandatory={taskData.isMandatory}
                    supplement={taskData.weakness?.title}
                />

                <Box>
                    <Flex justify="space-between" align="center" mb={4}>
                        <Text fontSize="lg" fontWeight="bold">
                            업로드<Text as="span" fontSize="md" fontWeight="normal" color="gray.500" ml={2}></Text>
                        </Text>
                        
                        {images.length < 20 && (
                            <Box as="label" cursor="pointer">
                                <Input type="file" accept="image/*" display="none" multiple onChange={onAddImages} />
                                <Button as="span" size="sm" leftIcon={<AddIcon />} bg={'none'}>
                                </Button>
                            </Box>
                        )}
                    </Flex>

                    <Box w="full">
                        {sliderImages.length > 0 ? (
                            <ImageSlider 
                                images={sliderImages}
                                taskId={taskId || ''}
                                currentUserId={user.id}
                                userRole={user.role}
                                onDelete={handleDeleteImage}
                            />
                        ) : (
                            <Box 
                                as="label"
                                w="full" py={6} bg="white" borderRadius="xl" shadow={'sm'}
                                display="flex" flexDirection="column" alignItems="center" justifyContent="center"
                                cursor="pointer" _hover={{ bg: 'blue.50' }}
                            >
                                <Input type="file" accept="image/*" display="none" multiple onChange={onAddImages} />
                                <AddIcon boxSize={{base:4, md:6}} color="gray.400" />
                            </Box>
                        )}
                    </Box>
                </Box>

                <Box>
                    <Text fontSize="lg" fontWeight="bold" mb={{base:2, md:4}}>메모</Text>
                    <Textarea 
                        as={TextareaAutosize}
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="과제를 하면서 어려웠던 점이나 멘토님께 하고 싶은 말을 적어주세요."
                        minH="150px"
                        p={5}
                        bg="#fff"
                        border="none"
                        borderRadius="xl"
                        resize="none"
                        focusBorderColor="blue.400"
                        fontSize="16px"
                        _placeholder={{ color: 'gray.400' }}
                    />
                </Box>

                <Flex align='center' justify='flex-end' gap={4} pt={4} pb={10}>
                    <Button 
                        size="sm" variant="outline" py={6} px={8} fontSize="lg" borderRadius="xl"
                        onClick={() => navigate(-1)}
                        color={'#9B9BA4'}
                    >
                        취소
                    </Button>
                    <Button 
                        size="sm" colorScheme="blue" py={6} px={8} fontSize="lg" borderRadius="xl"
                        onClick={onComplete}
                        isDisabled={images.length === 0 || isSubmitting}
                        bg={"#53A8FE"}
                        boxShadow="0 4px 14px 0 rgba(0,118,255,0.3)"
                    >
                        {taskData.submission ? '수정' : '제출'}
                    </Button>
                </Flex>

            </VStack>
        </Container>
    );
};

export default MenteeTaskSubmissionPage;
