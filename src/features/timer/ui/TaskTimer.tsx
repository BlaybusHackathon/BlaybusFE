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
        pl={0.9}
        borderRadius={'full'}
        isDisabled={isDisabled}
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        
        color={subjectColor}
        bg={isRunning ? `${subjectColor}4D` : `${subjectColor}1A`}
        borderWidth="1px"
        borderColor={"none"}
        
        _hover={{
          bg: isRunning ? `${subjectColor}80` : `${subjectColor}40`,
          transform: 'scale(1.05)', 
        }}
        _active={{
          bg: isRunning ? `${subjectColor}99` : `${subjectColor}60`,
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