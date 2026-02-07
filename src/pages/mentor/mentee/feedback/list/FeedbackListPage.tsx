import { Box, Heading, Container } from '@chakra-ui/react';
import { FeedbackListWidget } from '@/widgets/feedback/list/FeedbackListWidget';

const FeedbackListPage = () => {
    return (
        <Container maxW="container.xl" pt={10} pb={20}>
            <Heading size="lg" mb={8} color="#373E56">
                피드백
            </Heading>
            <Box>
                <FeedbackListWidget />
            </Box>
        </Container>
    );
};

export default FeedbackListPage;
