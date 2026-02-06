import { IconButton } from '@chakra-ui/react';
import { useTaskTimer } from '../model/useTaskTimer';

interface Props {
  taskId: string;
  isDisabled?: boolean;
}

export const TaskTimer = ({ taskId, isDisabled = false }: Props) => {
  const { isRunning, toggle } = useTaskTimer(taskId);

  return (
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
      icon={<span>{isRunning ? 'II' : '▶'}</span>}
    />
  );
};