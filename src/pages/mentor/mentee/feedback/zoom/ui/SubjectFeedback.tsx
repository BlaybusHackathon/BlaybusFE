import { VStack, Text, Box, Badge, Textarea } from '@chakra-ui/react';

interface SingleSubjectFeedbackProps {
    subject: string;
    value: string;
    bg: string;
    onChange: (value: string) => void;
}

const SingleSubjectFeedback = ({ subject, value, bg, onChange }: SingleSubjectFeedbackProps) => {
    return (
        <Box p={6} borderRadius="lg">
            <Badge color={'white'}bg={bg} mb={3} px={4} py={1} borderRadius="full">
                {subject}
            </Badge>
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`${subject} 과목에 대한 피드백을 입력해주세요.`}
                bg="#F9F9FB"
                border="none"
                minH="100px"
                resize="none"
                _focus={{ border: '1px solid', borderColor: `${bg}.400` }}
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
                    bg="#53A8FE"
                    onChange={(val) => onChange('korean', val)}
                />
                <SingleSubjectFeedback
                    subject="영어"
                    value={subjects.english}
                    bg="#4ED4A9"
                    onChange={(val) => onChange('english', val)}
                />
                <SingleSubjectFeedback
                    subject="수학"
                    value={subjects.math}
                    bg="#A16AFF"
                    onChange={(val) => onChange('math', val)}
                />
            </VStack>
        </VStack>
    );
};
