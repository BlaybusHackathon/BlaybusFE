import { Box, Text, VStack, Flex, Avatar, Icon } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { RecentFeedbackComment } from '../../../pages/mentor/mypage/model/types';
import { useNavigate } from 'react-router-dom';
import { CommentAvartarIcon } from '@/shared/ui/icons';

interface Props {
  comments: RecentFeedbackComment[];
}

export const CommentList = ({ comments }: Props) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Text
        color="#373E56"
        fontFamily="Pretendard"
        fontSize="24px"
        fontStyle="normal"
        fontWeight="700"
        lineHeight="normal"
        mb="28px"
      >
        최근 받은 댓글
      </Text>

      <VStack spacing={3} align="stretch">
        {comments.map((comment) => (
          <Flex
            key={comment.id}
            bg="#F9F9FB"
            p="15px 32px"
            borderRadius="22px"
            border="1px solid"
            borderColor="#F9F9FB"
            align="center"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'sm' }}
            onClick={() => navigate(`/mentor/mentee/${comment.menteeId}/task/${comment.taskId}?feedbackId=${comment.feedbackId}`)}
          >
            <VStack spacing={1} mr={5} minW="50px">
            <Avatar 
                sx={{
                  w: { base: '32px', md: '32px' },
                  h: { base: '32px', md: '32px' }
                }}
                icon={<CommentAvartarIcon size="100%" color='#D9D9D9' />}
                bg="transparent"
              />
              <Text fontSize="xs" color="gray.500">{comment.menteeName}</Text>
            </VStack>

            <Text fontSize="md" fontWeight="bold" color="gray.700" flex={1} noOfLines={1}>
              {comment.content}
            </Text>

            <Icon as={ChevronRightIcon} color="gray.400" w={6} h={6} ml={3} />
          </Flex>
        ))}

        {comments.length === 0 && (
          <Text color="gray.400" fontSize="sm" textAlign="center" py={4}>
            받은 댓글이 없습니다.
          </Text>
        )}
      </VStack>
    </Box>
  );
};
