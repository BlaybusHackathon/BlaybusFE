import { 
    Box, 
    Button, 
    Container, 
    Flex, 
    Text, 
    VStack, 
    useDisclosure, 
    useToast,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalContent,
    ModalOverlay,
    Input,
    Select,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { format, parse } from 'date-fns';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FiMoreVertical } from 'react-icons/fi';
import { useAuthStore } from '@/shared/stores/authStore';
import { useTaskFeedbackStore } from '@/shared/stores/taskFeedbackStore';
import { ImageSlider, TaskDetailHeader } from '@/widgets/task-detail';
import { ResourceSlider, StudyMaterial } from '@/widgets/task-detail/ResourceSlider';
import { Subject } from '@/widgets/task-detail/TaskDetailHeader';
import { useTaskDetail } from '@/features/task/model/useTaskDetail';
import { taskApi } from '@/features/task/api/taskApi';
import { feedbackApi } from '@/features/task-feedback/api/feedbackApi';
import type { Weakness } from '@/entities/weakness/types';
import { weaknessApi } from '@/features/weakness/api/weaknessApi';
import { SUBJECT_LABELS } from '@/shared/constants/subjects';

const formatTaskDate = (value?: string) => {
    if (!value) return '';
    const datePart = value.split('T')[0];
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(datePart)
        ? parse(datePart, 'yyyy-MM-dd', new Date())
        : new Date(value);
    return format(parsed, 'yyyy\ub144 M\uc6d4 d\uc77c');
};


const MentorTaskDetailPage = () => {
    const { taskId } = useParams<{ taskId: string }>(); 
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { loadFeedbacks, loadAnswers, resetUIState, setActiveFeedback } = useTaskFeedbackStore();
    const DEBUG_FEEDBACK = import.meta.env.DEV;
    const [searchParams] = useSearchParams();
    const focusFeedbackId = searchParams.get('feedbackId');
    const [focusImageId, setFocusImageId] = useState<string | null>(null);
    const [weaknessDetail, setWeaknessDetail] = useState<Weakness | null>(null);
    const toast = useToast(); 

    const exitDialog = useDisclosure();
    const editDialog = useDisclosure();
    const deleteDialog = useDisclosure();
    const exitCancelRef = useRef<HTMLButtonElement>(null);
    const deleteCancelRef = useRef<HTMLButtonElement>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isEditSaving, setIsEditSaving] = useState(false);
    const [isDeleteSaving, setIsDeleteSaving] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editSubject, setEditSubject] = useState<Subject>('OTHER');
    const { data, setData } = useTaskDetail(taskId);
    const effectiveTaskId = taskId ?? data?.id;

    const formattedImages = useMemo(() => {
        const submissionImages = data?.submission?.images ?? [];
        const submissionImageIds = data?.submission?.imageIds ?? [];
        return submissionImages.map((url, idx) => ({
            id: submissionImageIds[idx] ?? `img-${idx}`,
            imageUrl: url
        }));
    }, [data?.submission?.images, data?.submission?.imageIds]);
    const hasSubmission = Boolean(data?.submission);
    const submissionStatus = hasSubmission ? '제출됨' : '미제출';
    const hasMandatoryFlag = data?.isMandatory !== undefined && data?.isMandatory !== null;
    const userRole = user?.role;
    const canEditOrDelete =
        Boolean(user) &&
        Boolean(data) &&
        (hasMandatoryFlag
            ? (userRole === 'MENTOR' ? Boolean(data?.isMandatory) : !data?.isMandatory)
            : true);

    useEffect(() => {
        let active = true;
        const loadWeakness = async () => {
            if (!data?.weaknessId) {
                if (active) setWeaknessDetail(null);
                return;
            }
            try {
                const list = data.menteeId
                    ? await weaknessApi.listByMentee(data.menteeId)
                    : [];
                const found = list.find((item) => item.id === String(data.weaknessId));
                if (active) setWeaknessDetail(found ?? null);
            } catch {
                if (active) setWeaknessDetail(null);
            }
        };
        loadWeakness();
        return () => {
            active = false;
        };
    }, [data?.weaknessId, data?.menteeId]);

    const studyMaterials: StudyMaterial[] = useMemo(() => {
        const materials: StudyMaterial[] = [];
        const addMaterial = (material?: StudyMaterial | null) => {
            if (!material?.url) return;
            if (materials.some((item) => item.url === material.url)) return;
            materials.push(material);
        };

        const weaknessFile =
            data?.weakness?.file ??
            (weaknessDetail?.fileUrl
                ? {
                    title: weaknessDetail.fileName ?? weaknessDetail.title,
                    url: weaknessDetail.fileUrl,
                }
                : null);

        if (weaknessFile) {
            addMaterial({
                id: 'weakness-file',
                title: weaknessFile.title,
                url: weaknessFile.url,
                label: data?.weakness?.title ?? weaknessDetail?.title ?? '보완점',
            });
        }

        if (data?.taskFile) {
            addMaterial({
                id: 'task-file',
                title: data.taskFile.title,
                url: data.taskFile.url,
                label: 'Task File',
            });
        }

        return materials;
    }, [
        data?.taskFile,
        data?.weakness?.file,
        data?.weakness?.title,
        weaknessDetail?.fileUrl,
        weaknessDetail?.fileName,
        weaknessDetail?.title,
    ]);

    const taskDateLabel = formatTaskDate(data?.taskDate);

    useEffect(() => {
        resetUIState();

        if (DEBUG_FEEDBACK) {
            console.debug('[feedback-debug] mentor effect start', {
                taskId,
                isFeedbackReceived: data?.submission?.isFeedbackReceived,
                submissionImages: formattedImages.map((img) => img.id),
            });
        }

        if (!data?.submission?.isFeedbackReceived || formattedImages.length === 0) {
            if (DEBUG_FEEDBACK) {
                console.debug('[feedback-debug] mentor no feedback or images', {
                    taskId,
                    isFeedbackReceived: data?.submission?.isFeedbackReceived,
                    submissionImages: formattedImages.map((img) => img.id),
                });
            }
            loadFeedbacks([]);
            loadAnswers([]);
            return;
        }

        let active = true;
        const run = async () => {
            const feedbackResults = await Promise.allSettled(
                formattedImages.map((img) => feedbackApi.getFeedbacksByImageId(img.id))
            );
            const feedbacks = feedbackResults.flatMap((result) =>
                result.status === 'fulfilled' ? result.value : []
            );

            if (DEBUG_FEEDBACK) {
                console.debug('[feedback-debug] mentor fetched feedbacks', {
                    count: feedbacks.length,
                    ids: feedbacks.map((f) => f.id),
                });
            }

            const answerResults = await Promise.allSettled(
                feedbacks.map((fb) => feedbackApi.getComments(fb.id))
            );
            const answers = answerResults.flatMap((result) =>
                result.status === 'fulfilled' ? result.value : []
            );

            if (DEBUG_FEEDBACK) {
                console.debug('[feedback-debug] mentor fetched answers', {
                    count: answers.length,
                });
            }

            if (active) {
                if (DEBUG_FEEDBACK) {
                    console.debug('[feedback-debug] mentor load to store', {
                        feedbackCount: feedbacks.length,
                        answerCount: answers.length,
                    });
                }
                loadFeedbacks(feedbacks);
                loadAnswers(answers);
                if (focusFeedbackId) {
                    const target = feedbacks.find((fb) => fb.id === focusFeedbackId);
                    if (target) {
                        setFocusImageId(target.imageId);
                        setActiveFeedback(target.id);
                    }
                }
            }
        };

        run();
        return () => {
            if (DEBUG_FEEDBACK) {
                console.debug('[feedback-debug] mentor effect cleanup');
            }
            active = false;
        };
    }, [
        taskId,
        data?.submission?.isFeedbackReceived,
        formattedImages,
        resetUIState,
        loadFeedbacks,
        loadAnswers,
        focusFeedbackId,
        setActiveFeedback,
        DEBUG_FEEDBACK,
    ]);

    const handleExit = () => {
        exitDialog.onClose();
        navigate(-1);
    };

    const handleBackToList = () => {
        navigate(-1);
    };

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);

        try {
            if (!effectiveTaskId) return;
            await taskApi.confirmMentorTask(effectiveTaskId);
            setData((prev) => (prev ? { ...prev, isMentorChecked: true } : prev));

            toast({
                title: "Saved.",
                description: "Feedback confirmation saved.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top", 
            });
            
        } catch (error) {
            console.error("Save failed:", error);
            toast({
                title: "Save failed",
                description: "Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const openEdit = () => {
        if (!data) return;
        setEditTitle(data.title ?? '');
        setEditSubject((data.subject ?? 'OTHER') as Subject);
        editDialog.onOpen();
    };

    const handleEditSave = async () => {
        if (!effectiveTaskId) return;
        if (!editTitle.trim()) {
            toast({
                title: '제목을 입력해주세요.',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }
        setIsEditSaving(true);
        try {
            await taskApi.updateTask(effectiveTaskId, {
                title: editTitle.trim(),
                subject: editSubject,
            });
            setData((prev) =>
                prev ? { ...prev, title: editTitle.trim(), subject: editSubject } : prev
            );
            toast({
                title: '과제가 수정되었습니다.',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            editDialog.onClose();
        } catch {
            toast({
                title: '수정에 실패했습니다.',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        } finally {
            setIsEditSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!effectiveTaskId) return;
        setIsDeleteSaving(true);
        try {
            await taskApi.deleteTask(effectiveTaskId);
            toast({
                title: '과제가 삭제되었습니다.',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            deleteDialog.onClose();
            navigate(-1);
        } catch {
            toast({
                title: '삭제에 실패했습니다.',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        } finally {
            setIsDeleteSaving(false);
        }
    };

    if (!user) return null;

    return (
        <Container maxW="container.lg" py={12} bg="white" minH="100vh">
            <VStack spacing={10} align="stretch" maxW="1000px" mx="auto">
                {/* Header Section */}
                <Box>
                    <TaskDetailHeader
                        subject={(data?.subject ?? 'OTHER') as Subject}
                        date={taskDateLabel}
                        isMentorChecked={Boolean(data?.isMentorChecked)}
                        title={data?.title ?? ''}
                        isMandatory={data?.isMandatory}
                        supplement={data?.description ?? ''} 
                        statusLabel="제출 상태"
                        statusText={submissionStatus}
                        action={data ? (
                            <Menu>
                                <MenuButton
                                    as={IconButton}
                                    aria-label="Task options"
                                    icon={<FiMoreVertical />}
                                    variant="ghost"
                                    size="sm"
                                />
                                <MenuList>
                                    <MenuItem
                                        onClick={() => {
                                            if (!canEditOrDelete) {
                                                toast({
                                                    title: '권한이 없습니다.',
                                                    status: 'warning',
                                                    duration: 2000,
                                                    isClosable: true,
                                                });
                                                return;
                                            }
                                            openEdit();
                                        }}
                                    >
                                        수정
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            if (!canEditOrDelete) {
                                                toast({
                                                    title: '권한이 없습니다.',
                                                    status: 'warning',
                                                    duration: 2000,
                                                    isClosable: true,
                                                });
                                                return;
                                            }
                                            deleteDialog.onOpen();
                                        }}
                                    >
                                        삭제
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        ) : null}
                    />
                </Box>

                {hasSubmission ? (
                    <>
                        {/* Submission Viewer Section */}
                        <Box>
                            <Text fontSize="18px" fontWeight="bold" mb={6} color="#333333">학습 점검하기</Text>
                            <ImageSlider 
                                images={formattedImages} 
                                taskId={effectiveTaskId || 'temp-task-id'}
                                currentUserId={user.id} 
                                userRole={user.role}   
                                focusImageId={focusImageId}
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
                                    {data?.submission?.memo ?? ''}
                                </Text>
                            </Box>
                        </Box>

                        {/* Footer Buttons */}
                        <Flex justify="flex-end" gap={3} pt={8} pb={10}>
                            <Button
                                variant="outline"
                                onClick={exitDialog.onOpen}
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
                                loadingText="저장중..."
                            >
                                저장
                            </Button>
                        </Flex>
                    </>
                ) : (
                    <>
                        <Box>
                            <Text fontSize="18px" fontWeight="bold" mb={6} color="#333333">학습자료</Text>

                            {studyMaterials.length > 0 ? (
                                <VStack spacing={8} align="stretch">
                                    {studyMaterials.map((material) => (
                                        <Box key={material.id}>
                                            <ResourceSlider materials={[material]} />
                                        </Box>
                                    ))}
                                </VStack>
                            ) : (
                                <Box py={10} textAlign="center" bg="gray.50" borderRadius="xl" color="gray.500">
                                    등록된 학습 자료가 없습니다.
                                </Box>
                            )}
                        </Box>

                        <Flex justify="center" pt={8} pb={10}>
                            <Button size="lg" w="200px" h="52px" onClick={handleBackToList}>
                                목록으로
                            </Button>
                        </Flex>
                    </>
                )}

            </VStack>

            <AlertDialog
                isOpen={exitDialog.isOpen}
                leastDestructiveRef={exitCancelRef}
                onClose={exitDialog.onClose}
                isCentered 
            >
                <AlertDialogOverlay>
                    <AlertDialogContent borderRadius="12px">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            페이지에 남겠습니까?
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            수정 사항이 저장되지 않습니다.<br />
                            정말 나가겠습니까?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={exitCancelRef} onClick={exitDialog.onClose}>
                                취소
                            </Button>
                            <Button colorScheme="red" onClick={handleExit} ml={3}>
                                나가기
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <Modal isOpen={editDialog.isOpen} onClose={editDialog.onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>과제 수정</ModalHeader>
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            <Box>
                                <Text mb={2} fontSize="sm" color="gray.600">
                                    제목
                                </Text>
                                <Input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="제목을 입력해주세요."
                                />
                            </Box>
                            <Box>
                                <Text mb={2} fontSize="sm" color="gray.600">
                                    과목
                                </Text>
                                <Select
                                    value={editSubject}
                                    onChange={(e) => setEditSubject(e.target.value as Subject)}
                                >
                                    {Object.entries(SUBJECT_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </Select>
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter gap={3}>
                        <Button variant="ghost" onClick={editDialog.onClose}>
                            취소
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleEditSave}
                            isLoading={isEditSaving}
                        >
                            저장
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <AlertDialog
                isOpen={deleteDialog.isOpen}
                leastDestructiveRef={deleteCancelRef}
                onClose={deleteDialog.onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent borderRadius="12px">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            과제를 삭제할까요?
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            삭제한 과제는 복구할 수 없습니다.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={deleteCancelRef} onClick={deleteDialog.onClose}>
                                취소
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDelete}
                                ml={3}
                                isLoading={isDeleteSaving}
                            >
                                삭제
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Container>
    );
};

export default MentorTaskDetailPage;










