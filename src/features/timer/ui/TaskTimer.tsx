import { IconButton, HStack, Text } from '@chakra-ui/react';
import { useTaskTimer } from '../model/useTaskTimer';
import { formatDuration } from '@/shared/lib/date';
import { Subject, SUBJECT_COLORS } from '@/shared/constants/subjects';

interface TaskTimerProps {
  taskId: string;
  isDisabled?: boolean;     
  isTimerEnabled?: boolean; 
  subject?: Subject;
}

export const TaskTimer = ({ 
  taskId, 
  isDisabled, 
  isTimerEnabled = true, 
  subject = 'OTHER' 
}: TaskTimerProps) => {
  const { isRunning, toggle, duration } = useTaskTimer(taskId);
  const subjectColor = SUBJECT_COLORS[subject] || 'gray';

  const isButtonDisabled = isDisabled || !isTimerEnabled;

  return (
    <HStack spacing={2} alignItems={'center'}>
      <IconButton
        aria-label={isRunning ? 'Pause' : 'Start'}
        size={{ base: 'xs', md: 'sm' }}
        boxSize={{ base: '28px', md: '32px' }}
        minW={{ base: '28px', md: '32px' }}
        p={0}
        borderRadius={'full'}
        isDisabled={isButtonDisabled}
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        
        color={subjectColor}
        bg={isRunning ? `${subjectColor}60` : `${subjectColor}40`}
        
        _hover={{
          bg: isRunning ? `${subjectColor}80` : `${subjectColor}70`,
          transform: 'scale(1.05)', 
        }}
        _active={{
          bg: isRunning ? `${subjectColor}99` : `${subjectColor}60`,
        }}
        
        icon={
          <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="bold" lineHeight="1">
            {isRunning ? 'II' : '▶'}
          </Text>
        }
      />
      
      <Text 
        fontSize="md" 
        fontWeight="medium" 
        minW="60px"
        textAlign="center"
        letterSpacing="widest"
        color={isRunning ? subjectColor : '#373E56'}
      >
        {formatDuration(duration)}
      </Text>
    </HStack>
  );
};
