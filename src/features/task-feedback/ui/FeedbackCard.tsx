import { useState } from 'react';
import type { SVGProps } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Image,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { FeedbackWithAuthor, AnswerWithAuthor } from '../model/types';
import { formatRelativeTime, parseEmphasis } from '../model/feedbackUtils';
import { AnswerItem } from './AnswerItem';
import { FeedbackInputForm } from './FeedbackInputForm';
import { UserRole } from '@/shared/constants/enums';
import { CommentAvartarIcon, CommentWriteIcon } from '@/shared/ui/icons';

interface FeedbackCardProps {
  feedback: FeedbackWithAuthor;
  answers: AnswerWithAuthor[];
  currentUserId: string;
  userRole: UserRole;
  onClose: () => void;
  onUpdateFeedback: (content: string, payload: { imageUrl: string | null; file?: File | null }) => void;
  onDeleteFeedback: () => void;
  onAddAnswer: (comment: string) => void;
  onUpdateAnswer: (id: string, comment: string) => void;
  onDeleteAnswer: (id: string) => void;
  transformOrigin?: string;
}

const MotionBox = motion(Box);

const MoreIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="5" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="19" cy="12" r="2" fill="currentColor" />
  </svg>
);

export const FeedbackCard = ({
  feedback,
  answers,
  currentUserId,
  userRole,
  onClose,
  onUpdateFeedback,
  onDeleteFeedback,
  onAddAnswer,
  onUpdateAnswer,
  onDeleteAnswer,
  transformOrigin,
}: FeedbackCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');

  const isMentor = userRole === 'MENTOR';
  const isAuthor = feedback.mentorId === currentUserId;
  const canSubmitAnswer = Boolean(newAnswer.trim());
  const submitAnswer = () => {
    if (!canSubmitAnswer) return;
    onAddAnswer(newAnswer.trim());
    setNewAnswer('');
  };

  const containerProps = {
    w: '320px',
    maxW: '90vw',
    borderRadius: '16px',
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.12)',
    bg: 'white',
    overflow: 'hidden',
  } as const;

  if (isEditing) {
    return (
      <Box zIndex={200} onClick={(e) => e.stopPropagation()}>
        <FeedbackInputForm
          initialContent={feedback.content}
          initialImageUrl={feedback.imageUrl}
          allowFile={false}
          onSave={(c, payload) => {
            onUpdateFeedback(c, payload);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </Box>
    );
  }

  return (
    <MotionBox
      layoutId={`feedback-${feedback.id}`}
      zIndex={200}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      transformOrigin={transformOrigin}
      {...containerProps}
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        px={4}
        py={3}
        borderBottom="1px solid"
        borderColor="gray.100"
        bg="white"
      >
        <Text fontWeight="bold" fontSize="sm" color="gray.700">
          댓글
        </Text>
        <IconButton
          icon={<CloseIcon boxSize={2.5} color="gray.400" />}
          size="xs"
          variant="ghost"
          aria-label="Close"
          onClick={onClose}
          _hover={{ bg: 'gray.50', color: 'gray.600' }}
        />
      </Flex>
      {/* Body */}
      <Box px={4} pt={3} pb={2}>
        <Flex gap={3} align="flex-start">
          <Box mt="2px">
            <CommentAvartarIcon size={34} color="#53A8FE" />
          </Box>
          <Box flex={1}>
            <Flex justify="space-between" align="center">
              <Flex gap={2} align="center">
                <Text fontWeight="bold" fontSize="sm" color="#394250">
                  {feedback.authorName}
                </Text>
                <Text fontSize="xs" color="#A29E9A">
                  {formatRelativeTime(feedback.createdAt)}
                </Text>
              </Flex>
              {isMentor && isAuthor && (
                <Menu isLazy>
                  <MenuButton
                    as={IconButton}
                    icon={<MoreIcon />}
                    size="xs"
                    variant="ghost"
                    aria-label="Options"
                    color="gray.400"
                    _hover={{ color: 'gray.600', bg: 'transparent' }}
                  />
                  <MenuList minW="100px" fontSize="sm">
                    <MenuItem onClick={() => setIsEditing(true)}>수정</MenuItem>
                    <MenuItem onClick={onDeleteFeedback}>삭제</MenuItem>
                  </MenuList>
                </Menu>
              )}
            </Flex>
            <Text
              mt={2}
              fontSize="sm"
              lineHeight="1.6"
              color="#394250"
              sx={{
                strong: { color: 'blue.600', fontWeight: '800', bg: 'blue.50', px: 1, borderRadius: '2px' },
              }}
              dangerouslySetInnerHTML={{ __html: parseEmphasis(feedback.content) }}
            />
            {feedback.imageUrl && (
              <Image
                mt={3}
                src={feedback.imageUrl}
                alt="Feedback Attachment"
                borderRadius="lg"
                maxH="200px"
                objectFit="cover"
                w="full"
                border="1px solid"
                borderColor="gray.100"
              />
            )}
          </Box>
        </Flex>
      </Box>

      {/* Footer (Comments) */}
      <Box px={4} pb={2} maxH="180px" overflowY="auto" css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
        {answers.map((ans) => (
          <AnswerItem
            key={ans.id}
            answer={ans}
            currentUserId={currentUserId}
            onEdit={onUpdateAnswer}
            onDelete={onDeleteAnswer}
          />
        ))}
      </Box>
      <Box px={4} pb={4} pt={2}>
        <Flex gap={3} align="flex-start">
          <Box mt={1}>
            <CommentAvartarIcon size={34} color="#53A8FE" />
          </Box>
          <Box position="relative" flex={1}>
            <Textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="댓글 입력"
              resize="none"
              bg="#F7F8FA"
              borderRadius="16px"
              fontSize="sm"
              lineHeight="1.5"
              minH="80px"
              pb={{ base: 3, md: '36px' }}
              _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px #90CDF4' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submitAnswer();
                }
              }}
            />
            <IconButton
              aria-label="Send"
              icon={<CommentWriteIcon size={32} />}
              variant="ghost"
              h="32px"
              w="32px"
              minW="32px"
              p={0}
              isDisabled={!canSubmitAnswer}
              position="absolute"
              right="10px"
              bottom="10px"
              display={{ base: 'none', md: 'inline-flex' }}
              onClick={submitAnswer}
              _hover={{ bg: 'transparent' }}
              _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
            />
            <Flex justify="flex-end" mt={2} display={{ base: 'flex', md: 'none' }}>
              <IconButton
                aria-label="Send"
                icon={<CommentWriteIcon size={32} />}
                variant="ghost"
                h="32px"
                w="32px"
                minW="32px"
                p={0}
                isDisabled={!canSubmitAnswer}
                onClick={submitAnswer}
                _hover={{ bg: 'transparent' }}
                _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
              />
            </Flex>
          </Box>
        </Flex>
      </Box>
    </MotionBox>
  );
};




