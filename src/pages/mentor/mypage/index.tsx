import { Box, SimpleGrid, GridItem, Text } from '@chakra-ui/react';
import { StatCard } from './ui/StatCard';
import { MenteeList } from './ui/MenteeList'; // [New] 새로 만든 컴포넌트 import
import { RecentTaskList } from './ui/RecentTaskList';
import { CommentList } from './ui/CommentList';
import { 
  MOCK_STATS, 
  MOCK_MY_MENTEES, 
  MOCK_RECENT_TASKS, 
  MOCK_RECENT_COMMENTS 
} from './model/mockMyPageData';

const MentorMyPage = () => {
  return (
    <Box maxW="1200px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>마이페이지</Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={8}>
        <StatCard label="과제 미확인" count={MOCK_STATS.uncheckedTaskCount} />
        <StatCard label="피드백 대기" count={MOCK_STATS.pendingFeedbackCount} />
      </SimpleGrid>

      <Box mb={8}>
        <MenteeList mentees={MOCK_MY_MENTEES} />
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} pb={10}>
        <GridItem>
          <RecentTaskList tasks={MOCK_RECENT_TASKS} />
        </GridItem>
        <GridItem>
          <CommentList comments={MOCK_RECENT_COMMENTS} />
        </GridItem>
      </SimpleGrid>
    </Box>
  );
};

export default MentorMyPage;