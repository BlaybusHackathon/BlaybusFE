import { Box, Container, Divider } from '@chakra-ui/react';
import { PlannerHeader } from '@/widgets/planner/PlannerHeader';
import { TaskList } from '@/widgets/planner/TaskList';
// import { StudyTimeWidget } from '@/widgets/planner/StudyTimeWidget';
import { LogoutButton } from '@/features/auth';

const MenteePlannerPage = () => {
  return (
    <Container maxW="md" p={0} minH="100vh" bg="gray.50">
      <PlannerHeader />
      
      <Box px={4} py={2}>
        <TaskList />
        
        <Divider my={6} />
        
        <Box textAlign="center" py={4}>
          <LogoutButton />
        </Box>
      </Box>
    </Container>
  );
};

export default MenteePlannerPage;