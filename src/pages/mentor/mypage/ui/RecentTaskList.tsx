import { Box, Text, VStack, Badge, Flex, Avatar, Icon } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { RecentSubmittedTask } from '../model/types';
import { useNavigate } from 'react-router-dom';

interface Props {
  tasks: RecentSubmittedTask[];
}

const SUBJECT_COLOR: Record<string, string> = {
  KOREAN: 'blue',
  MATH: 'purple',
  ENGLISH: 'green',
  OTHER: 'gray',
};

const SUBJECT_LABEL: Record<string, string> = {
  KOREAN: '국어',
  MATH: '수학',
  ENGLISH: '영어',
  OTHER: '기타',
};

export const RecentTaskList = ({ tasks }: Props) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4}>최근 제출된 과제</Text>
      
      <VStack spacing={3} align="stretch">
        {tasks.map((task) => (
          <Flex
            key={task.id}
            bg="white"
            p={4}
            borderRadius="3xl"
            border="1px solid"
            borderColor="gray.100"
            align="center"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'sm' }}
            onClick={() => navigate(`/mentor/mentee/${task.menteeId}/task/${task.id}`)}
          >
            <VStack spacing={1} mr={5} minW="50px">
              <Avatar size="sm" name={task.menteeName} src={undefined} bg="gray.200" />
              <Text fontSize="xs" color="gray.500">{task.menteeName}</Text>
            </VStack>

            <Text fontSize="md" fontWeight="bold" color="gray.700" flex={1} isTruncated>
              {task.title}
            </Text>

            <Flex align="center" ml={2}>
              <Badge
                colorScheme={SUBJECT_COLOR[task.subject] || 'gray'}
                variant="solid"
                borderRadius="full" 
                px={4}
                py={1}
                fontSize="sm"
                fontWeight="bold"
              >
                {SUBJECT_LABEL[task.subject] || task.subject}
              </Badge>
              <Icon as={ChevronRightIcon} color="gray.400" w={6} h={6} ml={3} />
            </Flex>
          </Flex>
        ))}
        
        {tasks.length === 0 && (
          <Text color="gray.400" fontSize="sm" textAlign="center" py={4}>
            제출된 과제가 없습니다.
          </Text>
        )}
      </VStack>
    </Box>
  );
};