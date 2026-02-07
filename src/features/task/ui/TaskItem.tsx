import { HStack, Checkbox, Text, IconButton, Badge, Box, VStack } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { Task } from '@/entities/task/types';
import { SUBJECT_LABELS, SUBJECT_COLORS } from '@/shared/constants/subjects';
import { TaskTimer } from '@/features/timer/ui/TaskTimer';
import { PinOutlinedIcon } from '@/shared/ui/icons';

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
  
  const subjectColor = SUBJECT_COLORS[task.subject] || 'gray';
  
  return (
    <HStack
      onClick={onClick} 
      w="full"
      p={2}
      px={6}
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
          {isTimerEnabled && (
            <TaskTimer 
              taskId={task.id} 
              subject={task.subject}
              isDisabled={isCompleted} 
            />
          )}
        </HStack>
      </VStack>

      <HStack spacing={2} flexShrink={0}>
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
        <HStack spacing={6} flex={1}>
          <Badge 
            bg={subjectColor} 
            color={'white'} 
            fontSize="0.6rem" 
            borderRadius={'full'} 
            px={3} 
            py={1}
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
              onChange={() => {
                onToggle();
              }}
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
                  borderColor: 'gray.300',
                  borderWidth: '2px',
                  _hover: {
                    borderColor: subjectColor, 
                    bg: 'gray.50'
                  },
                  _checked: {
                    borderColor: `${subjectColor} !important`,
                    bg: `${subjectColor} !important`,
                    _hover: {
                      borderColor: `${subjectColor} !important`,
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