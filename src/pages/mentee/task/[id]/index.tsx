import { useEffect, useMemo } from 'react';
import { Box, Button, Container, Flex, Text, VStack, Divider } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';

import { TaskDetailHeader } from '@/widgets/task-detail/TaskDetailHeader';
import { ImageSlider } from '@/widgets/task-detail/ImageSlider';
import { ResourceSlider, StudyMaterial } from '@/widgets/task-detail/ResourceSlider';
import { useAuthStore } from '@/shared/stores/authStore';
import { useTaskFeedbackStore } from '@/shared/stores/taskFeedbackStore';
import { feedbackApi } from '@/features/task-feedback/api/feedbackApi';
import { useTaskDetail } from '@/features/task/model/useTaskDetail';

const MenteeTaskDetailPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { loadFeedbacks, loadAnswers, resetUIState } = useTaskFeedbackStore();
  const { data, isLoading } = useTaskDetail(taskId);
  const DEBUG_FEEDBACK = import.meta.env.DEV;

  const submissionImages = useMemo(() => {
    const images = data?.submission?.images ?? [];
    const imageIds = data?.submission?.imageIds ?? [];
    return images.map((url, idx) => ({
      id: imageIds[idx] ?? `img-${idx}`,
      imageUrl: url,
    }));
  }, [data?.submission?.images, data?.submission?.imageIds]);

  const studyMaterials: StudyMaterial[] = [];
  if (data?.weakness?.file) {
    studyMaterials.push({
      id: 'weakness-file',
      title: data.weakness.file.title,
      url: data.weakness.file.url,
      label: data.weakness.title,
    });
  }
  if (data?.taskFile) {
    studyMaterials.push({
      id: 'task-file',
      title: data.taskFile.title,
      url: data.taskFile.url,
      label: 'Task File',
    });
  }

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
  ]);

  const handleBackToList = () => navigate(-1);

  if (isLoading) return <Box p={10}>Loading...</Box>;
  if (!user) return <Box p={10}>Login required.</Box>;
  if (!data) return <Box p={10}>Task not found.</Box>;

  return (
    <Container maxW="container.lg" py={6} minH="100vh">
      <VStack spacing={{ base: 0, md: 8 }} align="stretch" maxW="1000px" mx="auto">
        <Box>
          <TaskDetailHeader
            subject={data.subject}
            date={data.taskDate}
            isMentorChecked={data.isMentorChecked}
            title={data.title}
            supplement={data.weakness?.title}
          />
        </Box>
        <Divider display={{ base: 'none', md: 'flex' }} />

        {data.submission?.isFeedbackReceived ? (
          <>
            <Box>
              <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="bold" color="#333333" mb={6}>
                Feedback on Submission
              </Text>
              <ImageSlider
                images={submissionImages}
                taskId={data.id}
                currentUserId={user.id}
                userRole="MENTEE"
              />
            </Box>
            <Box>
              <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="bold" mb={4} color="#333333">
                My Memo
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
                Task Materials
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
                  No study materials registered.
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
                {data.submission ? 'Edit Submission' : 'Submit Task'}
              </Button>
            </Flex>
          </>
        )}

        <Flex justify="center" pt={8} pb={10}>
          <Button size="lg" w="200px" h="52px" onClick={handleBackToList}>
            Back to List
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
};

export default MenteeTaskDetailPage;
