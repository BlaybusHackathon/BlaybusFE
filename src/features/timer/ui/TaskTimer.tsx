import { HStack, Text, IconButton } from '@chakra-ui/react';
import { useTaskTimer } from '../model/useTaskTimer';
import { Subject } from '@/shared/constants/subjects';

interface Props {
  taskId: string;
  subject: Subject;
  isDisabled?: boolean;
}

export const TaskTimer = ({ taskId, subject, isDisabled = false }: Props) => {
  const { displayTime, isRunning, toggle } = useTaskTimer(taskId, subject);

  return (
    <HStack spacing={2}>
      <Text 
        fontFamily="mono" 
        fontSize="sm" 
        color={isRunning ? 'blue.600' : 'gray.500'}
        fontWeight={isRunning ? 'bold' : 'normal'}
        minW="60px"
      >
        {displayTime}
      </Text>
      <IconButton
        aria-label={isRunning ? 'Pause' : 'Start'}
        size="xs"
        colorScheme={isRunning ? 'orange' : 'blue'}
        variant={isRunning ? 'solid' : 'outline'}
        isDisabled={isDisabled}
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        icon={<span>{isRunning ? '||' : '▶'}</span>}
      />
    </HStack>
  );
};