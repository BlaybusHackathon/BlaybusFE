import { Box, Flex, Text } from '@chakra-ui/react';

export type SubjectType = 'KOREAN' | 'ENGLISH' | 'MATH' | 'OTHER';

export interface CalendarTask {
    id: string;
    title: string;
    subject: SubjectType;
    hasReview: boolean; // 보완점 여부
    isCompleted: boolean;
}

interface TaskItemProps {
    task: CalendarTask;
    onClick: (taskId: string) => void;
}

export const SUBJECT_LABELS: Record<SubjectType, string> = {
    KOREAN: '국어',
    ENGLISH: '영어',
    MATH: '수학',
    OTHER: '기타'
}

const SUBJECT_COLORS: Record<SubjectType, string> = {
    KOREAN: 'blue.400',
    ENGLISH: 'green.400',
    MATH: 'purple.400',
    OTHER: 'gray.400',
};

export const TaskItem = ({ task, onClick }: TaskItemProps) => {
    const bgColor = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS.OTHER;

    return (
        <Box
            bg={bgColor}
            color="white"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="md"
            cursor="pointer"
            onClick={(e) => {
                e.stopPropagation();
                onClick(task.id);
            }}
            mb={1}
            position="relative"
            _hover={{ opacity: 0.9 }}
            transition="opacity 0.2s"
        >
            <Flex justify="space-between" align="center">
                <Text noOfLines={1} fontWeight="medium">
                    {task.title}
                </Text>
                {task.hasReview && (
                    <Box
                        w="6px"
                        h="6px"
                        bg="pink.300"
                        borderRadius="full"
                        ml={1}
                    />
                )}
            </Flex>
        </Box>
    );
};
