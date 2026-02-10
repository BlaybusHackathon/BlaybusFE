import { Box, SimpleGrid, GridItem, Text, Divider, Flex, Spinner } from '@chakra-ui/react';
import { StatCard } from '../../../widgets/mentor/ui/StatCard';
import { MenteeList } from '../../../widgets/mentor/ui/MenteeList';
import { RecentTaskList } from '../../../widgets/mentor/ui/RecentTaskList';
import { CommentList } from '../../../widgets/mentor/ui/CommentList';
import { useMentorDashboard } from '@/features/mentor-dashboard/model/useMentorDashboard';

export default function MentorMyPage() {
  const { data, isLoading, error } = useMentorDashboard();

  if (isLoading) {
    return (
      <Flex align="center" justify="center" py={20} color="gray.400">
        <Spinner size="sm" mr={2} />
        불러오는 중입니다.
      </Flex>
    );
  }

  if (error || !data) {
    return (
      <Flex align="center" justify="center" py={20} color="red.400">
        멘토 대시보드를 불러오지 못했습니다.
      </Flex>
    );
  }

  return (
    <Box maxW="1051px" mx="auto" px={{ base: 4, md: 6 }} py={{ base: 6, md: 0 }}>
      <Text fontSize="36px" fontWeight="700" mb={{ base: 6, md: '40px' }}>마이페이지</Text>

      <Box mb={{ base: 6, md: '30px' }}>
        <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'stretch', md: 'center' }} gap={{ base: 4, md: '50px' }}>
          <StatCard label="과제 미확인" count={data.stats.uncheckedTaskCount} />
          <StatCard label="피드백 대기" count={data.stats.pendingFeedbackCount} />
        </Flex>
      </Box>

      <Box>
        <MenteeList mentees={data.mentees} />
      </Box>

      <Divider h="3px" mt={{ base: 8, md: '50px' }} mb={{ base: 8, md: '50px' }} bg="#F4F4F4" />

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 4, md: 6 }} pb={{ base: 8, md: 10 }}>
        <GridItem>
          <RecentTaskList tasks={data.recentTasks} />
        </GridItem>
        <GridItem>
          <CommentList comments={data.recentComments} />
        </GridItem>
      </SimpleGrid>
    </Box>
  );
};
