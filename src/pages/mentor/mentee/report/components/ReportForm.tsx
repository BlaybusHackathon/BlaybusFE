import { VStack, Text, Textarea } from '@chakra-ui/react';

interface ReportFormProps {
    data: {
        totalReview: string;
        wellDone: string;
        improvements: string;
    };
    onChange: (field: string, value: string) => void;
}

export const ReportForm = ({ data, onChange }: ReportFormProps) => {
    return (
        <VStack spacing={8} align="stretch">
            <VStack align="start" spacing={2}>
                <Text fontWeight="bold" fontSize="lg" color="gray.700">
                    멘토 총평
                </Text>
                <Textarea
                    value={data.totalReview}
                    onChange={(e) => onChange('totalReview', e.target.value)}
                    placeholder="한 주간의 전반적인 학습 태도 및 성취도를 평가해주세요."
                    minH="150px"
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: 'white', border: '1px solid', borderColor: 'blue.400' }}
                    p={6}
                    fontSize="md"
                    lineHeight="1.6"
                />
            </VStack>

            <VStack align="start" spacing={2}>
                <Text fontWeight="bold" fontSize="lg" color="gray.700">
                    이번 주 잘한 점
                </Text>
                <Textarea
                    value={data.wellDone}
                    onChange={(e) => onChange('wellDone', e.target.value)}
                    placeholder="칭찬할 만한 성과나 행동을 적어주세요."
                    minH="100px"
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: 'white', border: '1px solid', borderColor: 'blue.400' }}
                    p={6}
                />
            </VStack>

            <VStack align="start" spacing={2}>
                <Text fontWeight="bold" fontSize="lg" color="gray.700">
                    다음 주 보완할 점
                </Text>
                <Textarea
                    value={data.improvements}
                    onChange={(e) => onChange('improvements', e.target.value)}
                    placeholder="개선이 필요한 부분 및 구체적인 가이드를 적어주세요."
                    minH="100px"
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: 'white', border: '1px solid', borderColor: 'blue.400' }}
                    p={6}
                />
            </VStack>
        </VStack>
    );
};
