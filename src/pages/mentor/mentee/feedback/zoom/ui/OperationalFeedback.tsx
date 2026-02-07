import { VStack, Text, Textarea } from '@chakra-ui/react';

interface OperationalFeedbackProps {
    value: string;
    onChange: (value: string) => void;
}

export const OperationalFeedback = ({ value, onChange }: OperationalFeedbackProps) => {
    return (
        <VStack align="start" spacing={4} w="full">
            <Text fontWeight="bold" fontSize="lg" color="gray.800">
                운영 피드백
            </Text>
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="스케줄 관리, 태도, 약속 이행 등 학습 외적인 피드백을 입력해주세요."
                minH="80px"
                bg="gray.50"
                borderRadius={'22'}
                border="none"
                resize="none"
                _focus={{ bg: 'white', border: '1px solid', borderColor: 'blue.400' }}
                p={6}
            />
        </VStack>
    );
};
