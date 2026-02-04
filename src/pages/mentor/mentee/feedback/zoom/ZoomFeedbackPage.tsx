import { useEffect, useState } from 'react';
import { Box, Heading, Button, useToast, Container, Text, Flex } from '@chakra-ui/react';
import { FeedbackMemo } from './ui/FeedbackMemo';
import { SubjectFeedback } from './ui/SubjectFeedback';
import { OperationalFeedback } from './ui/OperationalFeedback';
import { MOCK_ZOOM_FEEDBACK_DATA, ZoomFeedbackData } from './mockZoomFeedbackData';

const ZoomFeedbackPage = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ZoomFeedbackData>({
        memo: '',
        subjects: { korean: '', english: '', math: '' },
        operation: '',
    });

    // Mock Fetch
    useEffect(() => {
        // Simulate fetching data
        // In a real app, this would use a useEffect with a dependency on the date or ID
        // For now, we just load mock data to simulate "Edit Mode"
        // To simulate "Create Mode", simply comment out the set call inside
        const loadData = async () => {
            setLoading(true);
            setTimeout(() => {
                // Uncomment to simulate existing data
                // setData(MOCK_ZOOM_FEEDBACK_DATA);
                setLoading(false);
            }, 500);
        };
        loadData();
    }, []);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            console.log('Saved Data:', data);
            toast({
                title: "저장되었습니다.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            setLoading(false);
        }, 800);
    };

    const handleSubjectChange = (subject: 'korean' | 'english' | 'math', value: string) => {
        setData((prev) => ({
            ...prev,
            subjects: { ...prev.subjects, [subject]: value },
        }));
    };

    return (
        <Container maxW="container.lg" py={10}>
            <Flex justifyContent="space-between" alignItems="center" mb={12}>
                <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.500">어서오세요, 멘토님!</Text>
                    <Heading as="h1" size="lg" color="gray.800">
                        줌 미팅 피드백
                    </Heading>
                </VStack>
            </Flex>

            <Box mb={10}>
                <FeedbackMemo value={data.memo} onChange={(val) => setData({ ...data, memo: val })} />
            </Box>

            <Box mb={10}>
                <SubjectFeedback subjects={data.subjects} onChange={handleSubjectChange} />
            </Box>

            <Box mb={24}>
                <OperationalFeedback value={data.operation} onChange={(val) => setData({ ...data, operation: val })} />
            </Box>

            {/* Fixed Bottom Button */}
            <Box position="fixed" bottom={0} left={0} right={0} p={4} bg="white" borderTop="1px solid" borderColor="gray.200" zIndex={10}>
                <Container maxW="container.lg" display="flex" justifyContent="flex-end" gap={4}>
                    <Button variant="outline" size="lg" minW="100px">취소</Button>
                    <Button colorScheme="blue" size="lg" minW="100px" onClick={handleSave} isLoading={loading}>
                        저장
                    </Button>
                </Container>
            </Box>
        </Container>
    );
};
import { VStack } from '@chakra-ui/react'; // Missing import fix

export default ZoomFeedbackPage;
