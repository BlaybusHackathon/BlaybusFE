import { HStack, Checkbox, Text, IconButton, Badge, Box, Icon, VStack } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { Task } from '@/entities/task/types';
import { SUBJECT_LABELS, SUBJECT_COLORS } from '@/shared/constants/subjects';
import { TaskTimer } from '@/features/timer/ui/TaskTimer';

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
  
  // 과목 색상 (Hex Code)
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
        <HStack spacing={3} flex={1} overflow="hidden">
          {task.isMandatory && (
            <Box mr={3} flexShrink={0}>
              <Icon viewBox="0 0 24 24" w="20px" h="20px" color="#373E56">
                <path
                  fill="currentColor"
                  d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z"
                />
              </Icon>
            </Box>
          )}
          <Box flex={1} minW={0}>
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
        <HStack>
          {isTimerEnabled && !isCompleted && (
            <TaskTimer 
              taskId={task.id} 
              subject={task.subject}
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

          <Checkbox
            isChecked={isCompleted}
            onChange={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            size="md"
            // [수정] 스타일 구조 유지 + 색상만 동적 할당
            sx={{
              '& > input:checked + span': {
                borderRadius: 'full',
                width: '24px',
                height: '24px',
                backgroundColor: `${subjectColor} !important`, // 체크 시 배경색
                borderColor: `${subjectColor} !important`,     // 체크 시 테두리색
              },
              '& > input + span': {
                borderRadius: 'full',
                width: '24px',
                height: '24px',
                bgColor: 'gray.300', // 체크 해제 시 배경색 (기본 유지)
              }
            }}
          />
        </HStack>
      </HStack>
    </HStack>
  );
};