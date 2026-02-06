import { Box, SimpleGrid, GridItem, Text, Divider } from '@chakra-ui/react';
import { StatCard } from '../../../widgets/mentor/ui/StatCard';
import { MenteeList } from '../../../widgets/mentor/ui/MenteeList'; // [New] 새로 만든 컴포넌트 import
import { RecentTaskList } from '../../../widgets/mentor/ui/RecentTaskList';
import { CommentList } from '../../../widgets/mentor/ui/CommentList';
import {
  MOCK_STATS,
  MOCK_MY_MENTEES,
  MOCK_RECENT_TASKS,
  MOCK_RECENT_COMMENTS
} from './model/mockMyPageData';

export default function MentorMyPage() {
  return (
    <Box maxW="1051px" mx="auto">
      <Text fontSize="36px" fontWeight="700" mb="40px">마이페이지</Text>

      <Box mb="30px">
        <Box display="inline-flex" alignItems="center" gap="50px">
          <StatCard label="과제 미확인" count={MOCK_STATS.uncheckedTaskCount} />
          <StatCard label="피드백 대기" count={MOCK_STATS.pendingFeedbackCount} />
        </Box>
      </Box>

      <Box>
        <MenteeList mentees={MOCK_MY_MENTEES} />
      </Box>

      <Divider h="3px" mt="50px" mb="50px" bg="#F4F4F4" />


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