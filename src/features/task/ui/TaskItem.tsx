import { HStack, Checkbox, Text, IconButton, Badge, Box } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { Task } from '@/entities/task/types';
import { SUBJECT_LABELS } from '@/shared/constants/subjects';
import { TaskTimer } from '@/features/timer'; 

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onClick: () => void;
}

export const TaskItem = ({ task, onToggle, onDelete, onClick }: TaskItemProps) => {
  return (
    <HStack
      w="full"
      bg={task.isFixed ? 'blue.50' : 'white'}
      p={3}
      borderRadius="lg"
      boxShadow="sm"
      justify="space-between"
      _hover={{ boxShadow: 'md' }}
      align="center"
    >
      <HStack spacing={3} flex={1} overflow="hidden">
        <Checkbox
          isChecked={task.isCompleted}
          onChange={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          size="lg"
          colorScheme="blue"
        />
        <Box onClick={onClick} flex={1} cursor="pointer" minW={0}>
          <HStack mb={1}>
            <Badge colorScheme={task.isFixed ? 'purple' : 'gray'} fontSize="0.6rem">
              {SUBJECT_LABELS[task.subject]}
            </Badge>
          </HStack>
          <Text
            fontWeight="medium"
            textDecoration={task.isCompleted ? 'line-through' : 'none'}
            color={task.isCompleted ? 'gray.400' : 'gray.800'}
            isTruncated
          >
            {task.title}
          </Text>
        </Box>
      </HStack>

      <HStack spacing={2} flexShrink={0}>
        <TaskTimer 
          taskId={task.id} 
          subject={task.subject}
          isDisabled={task.isCompleted} 
        />
        
        {!task.isFixed && (
          <IconButton
            aria-label="Delete task"
            icon={<CloseIcon />}
            size="xs"
            variant="ghost"
            colorScheme="red"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        )}
      </HStack>
    </HStack>
  );
};