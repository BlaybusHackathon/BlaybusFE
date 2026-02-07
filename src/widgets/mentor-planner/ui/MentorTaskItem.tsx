import { Flex, Text, Checkbox, Box } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Task } from '@/entities/task/types';
import { SUBJECT_COLORS } from '@/shared/constants/studyTime';
import { Subject } from '@/shared/constants/subjects';
import { PinIcon } from '@/shared/ui/icons';


interface Props {
  task: Task;
  durationMinutes: number;
  onHover: (subject: Subject | null) => void;
}

export const MentorTaskItem = ({ task, onHover }: Props) => { 
  const navigate = useNavigate();
  const { menteeId } = useParams();

  const colors = SUBJECT_COLORS[task.subject] || { border: 'gray.200' };
  const hasWeakness = task.weaknessId !== null;
  const isCompleted = task.status === 'COMPLETED';

  return (
    <Flex
      bg="white"
      p="24px 32px"
      borderRadius="22px"
      boxShadow="3px 4px 4px 0 rgba(57, 83, 177, 0.08)"
      align="center"
      mb={1}
      cursor="pointer"
      transition="all 0.2s"
      
      onMouseEnter={() => onHover(task.subject)}
      onMouseLeave={() => onHover(null)}
      
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'md',
        borderColor: colors.border
      }}
      onClick={() => navigate(`/mentor/mentee/${menteeId}/task/${task.id}`)}
    >
      {task.isMandatory && (
        <Box mr={3} flexShrink={0}>
          <PinIcon />
        </Box>
      )}

      <Text
        flex={1}
        fontSize="16px"
        fontWeight="500"
        color="#373E56"
        noOfLines={1}
      >
        {task.title}
      </Text>

      {hasWeakness && (
        <Box
          w="8px"
          h="8px"
          borderRadius="full"
          bg="pink.400"
          mx={3}
          flexShrink={0}
        />
      )}

      <Checkbox
        isChecked={isCompleted}
        colorScheme="blue"
        size="lg"
        isReadOnly
        pointerEvents="none"
        flexShrink={0}
        iconColor="white"
        sx={{
          '.chakra-checkbox__control': {
            borderRadius: 'full',
            borderWidth: '1px',
            borderColor: 'gray.300',
            _checked: {
              borderColor: 'blue.400',
              bg: 'blue.400',
              _hover: {
                borderColor: 'blue.400',
                bg: 'blue.400',
              }
            }
          }
        }}
      />
    </Flex>
  );
};