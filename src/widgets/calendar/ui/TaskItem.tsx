import { Box, Text } from '@chakra-ui/react';

export type SubjectType = 'KOREAN' | 'ENGLISH' | 'MATH' | 'OTHER';

export interface CalendarTask {
    id: string;
    title: string;
    subject: SubjectType;
    hasReview: boolean;
    isCompleted: boolean;
}

interface TaskItemProps {
    task: CalendarTask;
    onClick: (taskId: string) => void;
}

const SUBJECT_COLORS: Record<SubjectType, string> = {
    KOREAN: '#53A8FE',
    ENGLISH: '#35CE9D',
    MATH: '#A16AFF',
    OTHER: '#A0A5B1',
};

export const TaskItem = ({ task, onClick }: TaskItemProps) => {
    const bgColor = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS.OTHER;

    return (
        <Box
            bg={bgColor}
            color="white"
            fontSize={{ base: '10px', md: 'xs' }}
            px={{ base: 2, md: 3 }}
            py={{ base: 0.5, md: 1 }}
            borderRadius="full"
            cursor="pointer"
            onClick={(e) => {
                e.stopPropagation();
                onClick(task.id);
            }}
            mb={0.5}
            _hover={{ opacity: 0.9 }}
            transition="opacity 0.2s"
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            minH="22px"
        >
            <Text noOfLines={1} fontWeight="medium" flex="1">
                {task.title}
            </Text>
            {task.hasReview && (
                <Box
                    ml={1}
                    w={{ base: '6px', md: '8px' }}
                    h={{ base: '6px', md: '8px' }}
                    bg="#FF99CC"
                    borderRadius="full"
                    flexShrink={0}
                    title="보완점 있음"
                />
            )}
        </Box>
    );
};