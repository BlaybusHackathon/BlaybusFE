import { Box, Flex, Text} from '@chakra-ui/react';

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
            fontSize={{ base: '10px', md: 'xs' }} 
            px={{ base: 1, md: 2 }}
            py={{ base: 0.5, md: 1 }}
            borderRadius="md"
            cursor="pointer"
            onClick={(e) => {
                e.stopPropagation();
                onClick(task.id);
            }}
            mb={0.5}
            _hover={{ opacity: 0.9 }}
            transition="opacity 0.2s"
            overflow="hidden"
        >
            <Flex justify="space-between" align="center">
                <Text noOfLines={1} fontWeight="medium">
                    {task.title}
                </Text>
                {task.hasReview && (
                    <Box 
                        ml={1} 
                        w={{ base: '4px', md: '6px' }} 
                        h={{ base: '4px', md: '6px' }} 
                        bg="pink.300" 
                        borderRadius="full" 
                        flexShrink={0} 
                        title="보완점 있음"
                    />
                )}
            </Flex>
        </Box>
    );
};