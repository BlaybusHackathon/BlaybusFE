import { Box, Container, Divider } from '@chakra-ui/react';
import { YesterdaySection } from './ui/YesterdaySection';
import { HistorySection } from './ui/HistorySection';
import { ZoomFeedbackList } from '@/widgets/mentor-zoom/ui/ZoomFeedbackList'; // [추가]
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';

const MenteeFeedbackPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleZoomItemClick = (feedbackId: string) => {
    navigate(`/mentee/feedback/zoom/${feedbackId}`);
  };

  return (
    <Box minH="100vh" py={8}>
      <Container maxW="container.md">
        
        <YesterdaySection />

        <Divider my={10} borderColor="gray.200" />

        <HistorySection />

        <Divider my={10} borderColor="gray.200" />

        <Box mb={6}>
            {user && (
                <ZoomFeedbackList 
                    menteeId={user.id} 
                    onItemClick={handleZoomItemClick} 
                />
            )}
        </Box>

      </Container>
    </Box>
  );
};

export default MenteeFeedbackPage;