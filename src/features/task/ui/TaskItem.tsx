import { HStack, Checkbox, Text, IconButton, Badge } from '@chakra-ui/react';
import { Task } from '@/entities/task/types';
import { SUBJECT_LABELS } from '@/shared/constants/subjects';
import { CloseIcon } from '@chakra-ui/icons';

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
      cursor="pointer"
      _hover={{ boxShadow: 'md' }}
    >
      <HStack spacing={3} flex={1}>
        <Checkbox
          isChecked={task.isCompleted}
          onChange={onToggle}
          size="lg"
          colorScheme="blue"
        />
        <div onClick={onClick} style={{ flex: 1, cursor: 'pointer' }}>
          <HStack mb={1}>
            <Badge colorScheme={task.isFixed ? 'purple' : 'gray'} fontSize="0.7rem">
              {SUBJECT_LABELS[task.subject]}
            </Badge>
            {task.isFixed && <Badge colorScheme="blue">Mentor</Badge>}
          </HStack>
          <Text
            fontWeight="medium"
            textDecoration={task.isCompleted ? 'line-through' : 'none'}
            color={task.isCompleted ? 'gray.400' : 'gray.800'}
          >
            {task.title}
          </Text>
        </div>
      </HStack>

        {!task.isFixed && ( 
          <IconButton
            aria-label="Delete task"
            icon={<CloseIcon />}
            size="xs" // 사이즈 조절
            variant="ghost"
            colorScheme="red"
            onClick={(e) => {
            e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
            onDelete();
          }}
        />
      )}
    </HStack>
  );
};