import { VStack, Text, Textarea } from '@chakra-ui/react';

interface FeedbackMemoProps {
    value: string;
    onChange: (value: string) => void;
}

export const FeedbackMemo = ({ value, onChange }: FeedbackMemoProps) => {
    return (
        <VStack align="start" spacing={4} w="full">
            <Text fontWeight="bold" fontSize="lg" color="gray.800">
                메모장
            </Text>
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="미팅 중 발생한 특이사항이나 자유로운 기록을 남겨주세요."
                minH="120px"
                bg="gray.50"
                border="none"
                resize="none"
                _focus={{ bg: 'white', border: '1px solid', borderColor: 'blue.400' }}
                p={6}
            />
        </VStack>
    );
};
