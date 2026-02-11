import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  VStack,
  Divider,
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
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { FiMoreVertical } from 'react-icons/fi';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { TaskDetailHeader } from '@/widgets/task-detail/TaskDetailHeader';
import { ImageSlider } from '@/widgets/task-detail/ImageSlider';
import { ResourceSlider, StudyMaterial } from '@/widgets/task-detail/ResourceSlider';
import { useAuthStore } from '@/shared/stores/authStore';
import { useTaskFeedbackStore } from '@/shared/stores/taskFeedbackStore';
import { feedbackApi } from '@/features/task-feedback/api/feedbackApi';
import { useTaskDetail } from '@/features/task/model/useTaskDetail';
import type { Weakness } from '@/entities/weakness/types';
import { weaknessApi } from '@/features/weakness/api/weaknessApi';
import { SUBJECT_LABELS, Subject } from '@/shared/constants/subjects';
import { taskApi } from '@/features/task/api/taskApi';

const MenteeTaskDetailPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const toast = useToast();

  const { loadFeedbacks, loadAnswers, resetUIState, setActiveFeedback } = useTaskFeedbackStore();
  const { data, isLoading, setData } = useTaskDetail(taskId);
  const DEBUG_FEEDBACK = import.meta.env.DEV;
  const [searchParams] = useSearchParams();
  const focusFeedbackId = searchParams.get('feedbackId');
  const [focusImageId, setFocusImageId] = useState<string | null>(null);
  const [weaknessDetail, setWeaknessDetail] = useState<Weakness | null>(null);
  const editDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  const deleteCancelRef = useRef<HTMLButtonElement>(null);
  const [isEditSaving, setIsEditSaving] = useState(false);
  const [isDeleteSaving, setIsDeleteSaving] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSubject, setEditSubject] = useState<Subject>('OTHER');

  const submissionImages = useMemo(() => {
    const images = data?.submission?.images ?? [];
    const imageIds = data?.submission?.imageIds ?? [];
    return images.map((url, idx) => ({
      id: imageIds[idx] ?? `img-${idx}`,
      imageUrl: url,
    }));
  }, [data?.submission?.images, data?.submission?.imageIds]);

  const hasMandatoryFlag = data?.isMandatory !== undefined && data?.isMandatory !== null;
  const canEditOrDelete =
    Boolean(user) &&
    Boolean(data) &&
    (hasMandatoryFlag
      ? (user?.role === 'MENTOR' ? Boolean(data?.isMandatory) : !data?.isMandatory)
      : true);

  useEffect(() => {
    let active = true;
    const loadWeakness = async () => {
      if (!data?.weaknessId) {
        if (active) setWeaknessDetail(null);
        return;
      }
      try {
        const list =
          user?.role === 'MENTOR'
            ? (data.menteeId ? await weaknessApi.listByMentee(data.menteeId) : [])
            : await weaknessApi.listMine();
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
  }, [data?.weaknessId, data?.menteeId, user?.role]);

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

  useEffect(() => {
    resetUIState();

    if (DEBUG_FEEDBACK) {
      console.debug('[feedback-debug] effect start', {
        taskId,
        isFeedbackReceived: data?.submission?.isFeedbackReceived,
        submissionImages: submissionImages.map((img) => img.id),
      });
    }

    if (!data?.submission?.isFeedbackReceived || submissionImages.length === 0) {
      if (DEBUG_FEEDBACK) {
        console.debug('[feedback-debug] no feedback or images', {
          taskId,
          isFeedbackReceived: data?.submission?.isFeedbackReceived,
          submissionImages: submissionImages.map((img) => img.id),
        });
      }
      loadFeedbacks([]);
      loadAnswers([]);
      return;
    }

    let active = true;
    const run = async () => {
      const feedbackResults = await Promise.allSettled(
        submissionImages.map((img) => feedbackApi.getFeedbacksByImageId(img.id))
      );
      const feedbacks = feedbackResults.flatMap((result) =>
        result.status === 'fulfilled' ? result.value : []
      );

      if (DEBUG_FEEDBACK) {
        console.debug('[feedback-debug] fetched feedbacks', {
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
        console.debug('[feedback-debug] fetched answers', {
          count: answers.length,
        });
      }

      if (active) {
        if (DEBUG_FEEDBACK) {
          console.debug('[feedback-debug] load to store', {
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
        console.debug('[feedback-debug] effect cleanup');
      }
      active = false;
    };
  }, [
    taskId,
    data?.submission?.isFeedbackReceived,
    submissionImages,
    resetUIState,
    loadFeedbacks,
    loadAnswers,
    focusFeedbackId,
    setActiveFeedback,
  ]);

  const openEdit = () => {
    if (!data) return;
    setEditTitle(data.title ?? '');
    setEditSubject((data.subject ?? 'OTHER') as Subject);
    editDialog.onOpen();
  };

  const handleEditSave = async () => {
    if (!data?.id) return;
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
      await taskApi.updateTask(data.id, {
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
    if (!data?.id) return;
    setIsDeleteSaving(true);
    try {
      await taskApi.deleteTask(data.id);
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

    const handleBackToList = () => navigate(-1);

  if (isLoading) return <Box p={10}>로딩중...</Box>;
  if (!user) return <Box p={10}>로그인이 필요합니다.</Box>;
  if (!data) return <Box p={10}>과제가 없습니다..</Box>;

  return (
    <Container maxW="container.lg" py={6} minH="100vh">
      <VStack spacing={{ base: 0, md: 8 }} align="stretch" maxW="1000px" mx="auto">
        <Box>
          <TaskDetailHeader
            subject={data.subject}
            date={data.taskDate}
            isMentorChecked={data.isMentorChecked}
            title={data.title}
            isMandatory={data.isMandatory}
            supplement={data.weakness?.title}
            action={
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
            }
          />
        </Box>
        <Divider display={{ base: 'none', md: 'flex' }} />

        {data.submission?.isFeedbackReceived ? (
          <>
            <Box>
              <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="bold" color="#333333" mb={6}>
                학습 점검하기
              </Text>
              <ImageSlider
                images={submissionImages}
                taskId={data.id}
                currentUserId={user.id}
                userRole="MENTEE"
                focusImageId={focusImageId}
              />
            </Box>
            <Box>
              <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="bold" mb={4} color="#333333">
                남긴 메모
              </Text>
              <Box p={6} bg="#F9FAFB" borderRadius="12px">
                <Text color="#333333" fontSize="15px">
                  {data.submission?.memo}
                </Text>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box>
              <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="bold" color="#333333" mb={6}>
                학습자료
              </Text>

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

            <Flex mt={4} justify="flex-end">
              <Button
                p={6}
                size="sm"
                bg="#53A8FE"
                borderRadius="30"
                fontSize="md"
                color="white"
                rightIcon={<ChevronRightIcon boxSize={6} />}
                onClick={() => navigate(`/mentee/task/${taskId}/submit`)}
              >
                {data.submission ? '과제 수정하기' : '과제 제출하기'}
              </Button>
            </Flex>
          </>
        )}

        <Flex justify="center" pt={8} pb={10}>
          <Button size="lg" w="200px" h="52px" onClick={handleBackToList}>
            목록으로
          </Button>
        </Flex>
      </VStack>
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
            <Button colorScheme="blue" onClick={handleEditSave} isLoading={isEditSaving}>
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
      </AlertDialog>    </Container>
  );
};

export default MenteeTaskDetailPage;








