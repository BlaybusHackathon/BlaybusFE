import { 
    Box, 
    Button, 
    Container, 
    Flex, 
    Text, 
    VStack, 
    useDisclosure, 
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import { useRef, useState } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_TASK_DETAIL_DATA } from './mockTaskDetail';
import { useAuthStore } from '@/shared/stores/authStore';
import { ImageSlider, TaskDetailHeader } from '@/widgets/task-detail';

const MentorTaskDetailPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const toast = useToast(); 

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    const [isSaving, setIsSaving] = useState(false);

    const data = MOCK_TASK_DETAIL_DATA;

    const formattedImages = data.submissionImages.map((url, idx) => ({
        id: `img-${idx}`,
        imageUrl: url
    }));

    const handleExit = () => {
        onClose();
        navigate(-1);
    };

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast({
                title: "저장되었습니다.",
                description: "피드백이 성공적으로 반영되었습니다.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top", 
            });
            
        } catch (error) {
            console.error("Save failed:", error);
            toast({
                title: "저장 실패",
                description: "잠시 후 다시 시도해주세요.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

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
                        supplement={data.description ? data.description.replace('보완점: ', '') : ''} 
                    />
                </Box>

                {/* Submission Viewer Section */}
                <Box>
                    <Text fontSize="18px" fontWeight="bold" mb={6} color="#333333">학습 점검하기</Text>
                    <ImageSlider 
                        images={formattedImages} 
                        taskId={id || 'temp-task-id'}
                        currentUserId={user.id} 
                        userRole={user.role}   
                    />
                </Box>

                {/* Mentee Comment Section */}
                <Box pt={16}>
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
                        onClick={onOpen}
                        h="48px"
                        px={8}
                        borderColor="#E5E7EB"
                        color="#666666"
                        bg="white"
                        _hover={{ bg: 'gray.50' }}
                        isDisabled={isSaving}
                    >
                        취소
                    </Button>
                    <Button
                        colorScheme="blue"
                        bg="#3B82F6"
                        h="48px"
                        px={8}
                        _hover={{ bg: 'blue.600' }}
                        onClick={handleSave} 
                        isLoading={isSaving} 
                        loadingText="저장 중"
                    >
                        저장
                    </Button>
                </Flex>

            </VStack>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered 
            >
                <AlertDialogOverlay>
                    <AlertDialogContent borderRadius="12px">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            페이지를 나가시겠습니까?
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            작성 중인 내용은 저장되지 않습니다.<br />
                            정말 나가시겠습니까?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                취소
                            </Button>
                            <Button colorScheme="red" onClick={handleExit} ml={3}>
                                나가기
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Container>
    );
};

export default MentorTaskDetailPage;