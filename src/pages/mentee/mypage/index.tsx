import { Box, Container, Heading } from '@chakra-ui/react';
import { useAuthStore } from '@/shared/stores/authStore';
import { MenteeProfileSection } from '@/widgets/mentee-profile/ui/MenteeProfileSection';
import { MenteeProfileData } from '@/widgets/mentee-profile/model/types';

const MenteeMyPage = () => {
  const { user } = useAuthStore();

  const mockProfileData: MenteeProfileData = {
    id: user?.id || 'mentee-1',
    name: user?.name || '홍길동',
    school: '서울고등학교',
    grade: '2학년',
    profileImgUrl: user?.profileImgUrl,
    stats: {
      todaySubmitted: 142,
      totalPlanners: 28,
      todayRemaining: 3,
      todayFeedbackComments: 12,
    },
    achievement: {
      korean: 85,
      english: 92,
      math: 78,
    },
  };

  return (
    <Box minH="100vh" bg="gray.50" py={10}>
      <Container maxW="container.xl">
        <Heading size="lg" mb={8} color="gray.800">
          마이페이지
        </Heading>

        {/* 공용 프로필 위젯 사용 */}
        <MenteeProfileSection profile={mockProfileData} userRole='MENTEE'/>

      </Container>
    </Box>
  );
};

export default MenteeMyPage;