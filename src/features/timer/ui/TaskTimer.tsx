import { IconButton, HStack, Text } from '@chakra-ui/react';
import { useTaskTimer } from '../model/useTaskTimer';
import { formatDuration } from '@/shared/lib/date';
import { Subject, SUBJECT_COLORS } from '@/shared/constants/subjects';

interface TaskTimerProps {
  taskId: string;
  isDisabled?: boolean;
  subject?: Subject;
}

export const TaskTimer = ({ taskId, isDisabled, subject = 'OTHER' }: TaskTimerProps) => {
  const { isRunning, toggle, duration } = useTaskTimer(taskId);

  const subjectColor = SUBJECT_COLORS[subject] || 'gray';

  return (
    <HStack spacing={2}>
      <IconButton
        aria-label={isRunning ? 'Pause' : 'Start'}
        size="xs"
        pb={0.9}
        pl={0.9}
        borderRadius={'full'}
        variant={isRunning ? 'solid' : 'outline'}
        isDisabled={isDisabled}
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        bg={isRunning ? subjectColor : 'transparent'}
        borderColor={subjectColor}
        borderWidth="1px"
        color={isRunning ? 'white' : subjectColor}
        _hover={{
          bg: isRunning ? subjectColor : `${subjectColor}1A`, 
          opacity: isRunning ? 0.9 : 1,
        }}
        _active={{
          bg: isRunning ? subjectColor : `${subjectColor}33`,
        }}
        icon={<span>{isRunning ? 'II' : '▶'}</span>}
      />
      
      <Text 
        fontSize="sm" 
        fontWeight="bold" 
        fontFamily="monospace"
        minW="60px"
        textAlign="center"
        color={isRunning ? subjectColor : 'gray.500'}
      >
        {formatDuration(duration)}
      </Text>
    </HStack>
  );
};