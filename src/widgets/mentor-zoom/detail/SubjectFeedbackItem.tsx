import { Box, Flex, Textarea } from '@chakra-ui/react';

export type SubjectType = 'korean' | 'english' | 'math';

interface Props {
    subject: SubjectType;
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}

const SUBJECT_CONFIG = {
    korean: { label: '국어', color: '#53A8FE' },
    english: { label: '영어', color: '#4ED4A9' },
    math: { label: '수학', color: '#A16AFF' },
};

export const SubjectFeedbackItem = ({ subject, value, onChange, readOnly = false }: Props) => {
    const config = SUBJECT_CONFIG[subject];

    return (
        <Box mb={6}>
            <Flex align="center" mb={3}>
                <Box
                    bg={config.color}
                    color="white"
                    fontSize="16px"
                    fontWeight="600"
                    px="15px"
                    py="6px"
                    borderRadius="15px"
                    minW="50px"
                    textAlign="center"
                >
                    {config.label}
                </Box>
            </Flex>
            <Textarea
                value={value}
                onChange={(e) => !readOnly && onChange(e.target.value)}
                isReadOnly={readOnly}
                placeholder={readOnly ? "" : `${config.label} 과목의 줌 미팅 피드백을 작성해주세요.`}
                minH="100px"
                bg={readOnly ? "white" : "#F9F9FB"}
                border={readOnly ? "1px solid" : "none"}
                borderColor={readOnly ? "#E2E4E8" : "transparent"}
                borderRadius="12px"
                p={6}
                fontSize="16px"
                color="#7E7E7E"
                _placeholder={{ color: '#9B9BA4' }}
                _focus={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: config.color,
                    boxShadow: 'none'
                }}
                sx={{
                    fieldSizing: 'content',
                    height: 'initial',
                }}
                resize="none"
                lineHeight="1.6"
            />
        </Box>
    );
};