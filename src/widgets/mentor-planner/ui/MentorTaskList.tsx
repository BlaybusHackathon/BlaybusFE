import { VStack, Text, Box, Flex } from '@chakra-ui/react';
import { Task } from '@/entities/task/types';
import { TaskLog } from '@/entities/task-log/types';
import { Subject } from '@/shared/constants/subjects';
import { getTaskDurationMinutes } from '@/features/study-time';
import { MentorTaskItem } from './MentorTaskItem';

interface Props {
  tasks: Task[];
  logs: TaskLog[];
  onHoverSubject: (subject: Subject | null) => void;
}

export const MentorTaskList = ({ tasks, logs, onHoverSubject }: Props) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isMandatory !== b.isMandatory) return a.isMandatory ? -1 : 1;
    if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
    if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
    return 0;
  });

  return (
    <Box
      h="full"
      overflowY="auto"
      pr={2}
      css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: '#EDF2F7', borderRadius: '4px' },
      }}
    >
      <Text
        fontSize="20px"
        fontWeight="700"
        fontFamily="Pretendard"
        color="#373E56"
        mb={6}
      >
        과제란
      </Text>
      {sortedTasks.length === 0 ? (
        <Flex h="200px" justify="center" align="center" direction="column" color="gray.400">
          <Text fontSize="md">등록된 과제가 없습니다.</Text>
        </Flex>
      ) : (
        <VStack spacing={3} align="stretch" pb={4}>
          {sortedTasks.map((task) => (
            <MentorTaskItem
              key={task.id}
              task={task}
              durationMinutes={getTaskDurationMinutes(logs)}
              onHover={onHoverSubject}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
};