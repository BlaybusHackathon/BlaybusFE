import { Flex, Text, Checkbox, Box, Icon } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Task } from '@/entities/task/types';
import { Subject } from '@/shared/constants/subjects';
import { SUBJECT_COLORS } from '@/shared/constants/studyTime';

interface Props {
  task: Task;
  durationMinutes: number;
  onHover: (subject: Subject | null) => void;
}

const PinIcon = () => (
  <Icon viewBox="0 0 24 24" w="20px" h="20px" color="#373E56">
    <path
      fill="currentColor"
      d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z"
    />
  </Icon>
);

export const MentorTaskItem = ({ task, onHover }: Props) => {
  const navigate = useNavigate();
  const { menteeId } = useParams();

  const colors = SUBJECT_COLORS[task.subject];
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
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'md',
        borderColor: colors.border
      }}
      onMouseEnter={() => onHover(task.subject)}
      onMouseLeave={() => onHover(null)}
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

      {/* <Flex
        px={3}
        py={1}
        bg={colors.bg}
        borderRadius="full"
        flexShrink={0}
        mx={2}
      >
        <Text fontSize="xs" fontWeight="bold" color={colors.text}>
          {SUBJECT_LABELS[task.subject]}
        </Text>
      </Flex> */}

      {/* {durationMinutes > 0 && (
        <Text 
          fontSize="sm" 
          fontWeight="bold" 
          color="gray.500" 
          mr={4}
          flexShrink={0}
        >
          {formatMinutes(durationMinutes)}
        </Text>
      )} */}

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