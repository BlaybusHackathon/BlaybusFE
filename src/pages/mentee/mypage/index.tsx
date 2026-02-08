import { Box, Container, Button } from '@chakra-ui/react';
import { MeetIcon } from '@/shared/ui/icons';
import { useAuthStore } from '@/shared/stores/authStore';
import { MenteeProfileSection } from '@/widgets/mentee-profile/ui/MenteeProfileSection';
import { MenteeProfileData } from '@/widgets/mentee-profile/model/types';
import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { menteeDashboardApi } from '@/features/mentee-dashboard/api/menteeDashboardApi';

const MenteeMyPage = () => {
  const { user } = useAuthStore();
  const { data: dashboard } = useApiQuery(() => menteeDashboardApi.getMy(), [user?.id]);

  const profileData: MenteeProfileData = dashboard ?? {
    id: user?.id ?? '',
    name: user?.name ?? '',
    school: '',
    grade: '',
    profileImgUrl: user?.profileImgUrl ?? null,
    stats: {
      todaySubmitted: 0,
      todayTasksCount: 0,
      todayRemaining: 0,
      todayFeedbackComments: 0,
    },
    achievement: {
      korean: 0,
      english: 0,
      math: 0,
    },
  };

  const CONSULTATION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfgdWIKLyMFdZdyLI9FaxO3ix1ZdLeKmta4TB-U0VwK1B6UCg/viewform";

  return (
    <Box minH="100vh" bg="gray.50" py={10} position="relative">
      <Container maxW="container.xl">
        <MenteeProfileSection profile={profileData} userRole='MENTEE'/>

        <Button
          as="a"
          href={CONSULTATION_URL}
          target="_blank"
          rel="noopener noreferrer" 
          leftIcon={<MeetIcon />}
          
          position="fixed"
          bottom={{ base: "80px", md: "40px" }} 
          right={{ base: "20px", md: "40px" }}
          zIndex={1000}
          
          colorScheme="blue"
          bg="#53A8FE"
          color="white"
          size="lg"
          height={{ base: "50px", md: "60px" }} 
          px={{ base: 6, md: 10 }}
          borderRadius="full" 
          boxShadow="0 4px 14px 0 rgba(0,0,0,0.25)" 
          flexShrink={0} 
          
          _hover={{
            bg: "#3B82F6",
            transform: "translateY(-4px)",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.3)",
          }}
          transition="all 0.2s"
        >
          상담 받아보기
        </Button>
      </Container>
    </Box>
  );
};

export default MenteeMyPage;