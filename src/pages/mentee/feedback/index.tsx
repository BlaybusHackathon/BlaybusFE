import { Box, Container, Divider } from '@chakra-ui/react';
import { YesterdaySection } from './ui/YesterdaySection';
import { HistorySection } from './ui/HistorySection';

const MenteeFeedbackPage = () => {
  return (
    <Box minH="100vh" py={8}>
      <Container maxW="container.md">
        
        <YesterdaySection />

        <Divider my={10} borderColor="gray.200" />

        <HistorySection />

      </Container>
    </Box>
  );
};

export default MenteeFeedbackPage;