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
  isTimerEnabled: boolean;
  isEditable: boolean;
}

export const TaskItem = ({ 
  task, 
  onToggle, 
  onDelete, 
  onClick,
  isTimerEnabled,
  isEditable
}: TaskItemProps) => {
  const isCompleted = task.status === 'COMPLETED';
  const canDelete = isEditable && !task.isMandatory;
  
  return (
    <HStack
      w="full"
      bg={task.isMandatory ? 'blue.50' : 'white'}
      p={3}
      borderRadius="lg"
      boxShadow="sm"
      justify="space-between"
      _hover={{ boxShadow: 'md' }}
      align="center"
    >
      <HStack spacing={3} flex={1} overflow="hidden">
        <Checkbox
          isChecked={isCompleted}
          onChange={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          size="lg"
          colorScheme="blue"
        />
        <Box onClick={onClick} flex={1} cursor="pointer" minW={0}>
          <HStack mb={1}>
            <Badge colorScheme={task.isMandatory ? 'purple' : 'gray'} fontSize="0.6rem">
              {SUBJECT_LABELS[task.subject]}
            </Badge>
          </HStack>
          <Text
            fontWeight="medium"
            textDecoration={isCompleted ? 'line-through' : 'none'}
            color={isCompleted ? 'gray.400' : 'gray.800'}
            isTruncated
          >
            {task.title}
          </Text>
        </Box>
      </HStack>

      <HStack spacing={2} flexShrink={0}>
        {isTimerEnabled && (
          <TaskTimer 
            taskId={task.id} 
            isDisabled={isCompleted} 
          />
        )}
        
        {canDelete && (
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