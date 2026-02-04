import { VStack, Text, SimpleGrid, Box, Badge, Textarea } from '@chakra-ui/react';

interface SingleSubjectFeedbackProps {
    subject: string;
    value: string;
    colorScheme: string;
    onChange: (value: string) => void;
}

const SingleSubjectFeedback = ({ subject, value, colorScheme, onChange }: SingleSubjectFeedbackProps) => {
    return (
        <Box bg="gray.50" p={6} borderRadius="lg">
            <Badge colorScheme={colorScheme} mb={3} px={3} py={1} borderRadius="full">
                {subject}
            </Badge>
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`${subject} 과목에 대한 피드백을 입력해주세요.`}
                bg="white"
                border="none"
                minH="100px"
                resize="none"
                _focus={{ border: '1px solid', borderColor: `${colorScheme}.400` }}
            />
        </Box>
    );
};

interface SubjectFeedbackProps {
    subjects: {
        korean: string;
        english: string;
        math: string;
    };
    onChange: (subject: 'korean' | 'english' | 'math', value: string) => void;
}

export const SubjectFeedback = ({ subjects, onChange }: SubjectFeedbackProps) => {
    return (
        <VStack align="start" spacing={4} w="full">
            <Text fontWeight="bold" fontSize="lg" color="gray.800">
                줌 미팅 피드백 작성
            </Text>
            <VStack spacing={4} w="full" align="stretch">
                <SingleSubjectFeedback
                    subject="국어"
                    value={subjects.korean}
                    colorScheme="blue"
                    onChange={(val) => onChange('korean', val)}
                />
                <SingleSubjectFeedback
                    subject="영어"
                    value={subjects.english}
                    colorScheme="green"
                    onChange={(val) => onChange('english', val)}
                />
                <SingleSubjectFeedback
                    subject="수학"
                    value={subjects.math}
                    colorScheme="purple"
                    onChange={(val) => onChange('math', val)}
                />
            </VStack>
        </VStack>
    );
};
