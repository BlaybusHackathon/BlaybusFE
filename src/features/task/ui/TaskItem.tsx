import { HStack, Checkbox, Text, Badge, Box, VStack } from '@chakra-ui/react';
import { Task } from '@/entities/task/types';
import { SUBJECT_LABELS, SUBJECT_COLORS } from '@/shared/constants/subjects';
import { TaskTimer } from '@/features/timer/ui/TaskTimer';
import { PinOutlinedIcon } from '@/shared/ui/icons';

interface TaskItemProps {
  task: Task;
  onDelete: () => void;
  onClick: () => void; 
  isTimerEnabled: boolean;
  isEditable: boolean;
}

export const TaskItem = ({ 
  task, 
  onDelete, 
  onClick,
  isTimerEnabled,
  isEditable
}: TaskItemProps) => {
  void onDelete;
  void isEditable;
  const isCompleted = Boolean(task.submitted) || task.status === 'DONE';
  
  const subjectColor = SUBJECT_COLORS[task.subject] || 'gray';
  
  return (
    <HStack
      onClick={onClick} 
      w="full"
      p={5}
      borderRadius="lg"
      boxShadow="sm"
      justify="space-between"
      _hover={{ boxShadow: 'md' }}
      align="center"
      bg="white"
      cursor="pointer"
    >
      <VStack justify="flex-start" align="stretch" spacing={4} flex={1} minW={0}>
        <HStack spacing={1} flex={1} overflow="hidden">
          {task.isMandatory && (
            <Box mr={1} flexShrink={0}>
              <PinOutlinedIcon 
                style={{ color: isCompleted ? '#A6A6A6' : '#373E56' }} 
              />
            </Box>
          )}
          <Box flex={1} minW={0}>
            <Text
              fontWeight="semibold"
              color={isCompleted ? '#A6A6A6' : '#373E56'}
              isTruncated
            >
              {task.title}
            </Text>
          </Box>
        </HStack>
        <HStack>
          <TaskTimer 
            taskId={task.id} 
            subject={task.subject}
            isDisabled={isCompleted} 
            isTimerEnabled={isTimerEnabled} 
          />
        </HStack>
      </VStack>

      <HStack spacing={2} flexShrink={0}>
        <HStack spacing={6} flex={1}>
          <Badge 
            bg={subjectColor} 
            color={'white'} 
            fontSize="0.6rem" 
            borderRadius={'full'} 
            px={2} 
            py={0.4}
            border="1px solid"
            borderColor={subjectColor}
          >
            {SUBJECT_LABELS[task.subject]}
          </Badge>

          <Box
            onClick={(e) => {
              e.stopPropagation();
            }}
            _hover={{ 
              transform: 'scale(1.1)', 
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Checkbox
              isChecked={isCompleted}
              isReadOnly
              tabIndex={-1}
              size="md"
              sx={{
                '[data-checked]': {
                  borderColor: `${subjectColor} !important`,
                  background: `${subjectColor} !important`,
                },
                '.chakra-checkbox__control': {
                  borderRadius: 'full',
                  width: '24px',
                  height: '24px',
                  borderWidth: '2px',
                  _hover: {
                    bg: 'subjectColor'
                  },
                  _checked: {
                    bg: `${subjectColor} !important`,
                    _hover: {
                      bg: `${subjectColor} !important`,
                    }
                  }
                },
                '.chakra-checkbox__control svg': {
                    fontSize: '0.8em',
                }
              }}
            />
          </Box>
        </HStack>
      </HStack>
    </HStack>
  );
};
