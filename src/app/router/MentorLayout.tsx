import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { MentorHeader, MentorSidebar } from '@/widgets/mentor-layout';

export const MentorLayout = () => {
  return (
    <Box minH="100vh" bg="gray.50">
      <MentorHeader />
      <MentorSidebar />
      
      <Box
        as="main"
        ml="240px"     
        mt="60px"       
        px={8}          
        py={6}         
        minH="calc(100vh - 60px)"
      >
        <Outlet />
      </Box>
    </Box>
  );
};