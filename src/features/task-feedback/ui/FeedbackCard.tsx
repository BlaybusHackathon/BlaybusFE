import { useState } from 'react';
import type { SVGProps } from 'react';
import { Box, Flex, Text, IconButton, Image, Input, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { CommentIcon, CommentAvartarIcon } from '@/shared/ui/icons';
import { motion } from 'framer-motion';
import { FeedbackWithAuthor, AnswerWithAuthor } from '../model/types';
import { formatRelativeTime, parseEmphasis, getFeedbackPositionStyles } from '../model/feedbackUtils';
import { AnswerItem } from './AnswerItem';
import { FeedbackInputForm } from './FeedbackInputForm';
import { UserRole } from '@/shared/constants/enums';

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
  
  // [추가] 모바일 뷰 여부 (Drawer 내부 렌더링용)
  isMobileView?: boolean;
}

const MotionBox = motion(Box);

const MoreIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="5" cy="12" r="2" fill="currentColor"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <circle cx="19" cy="12" r="2" fill="currentColor"/>
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
  isMobileView = false // 기본값 false
}: FeedbackCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');

  const isMentor = userRole === "MENTOR";
  const isAuthor = feedback.mentorId === currentUserId;

  const { positionStyles, transformOrigin, marginStyles } = getFeedbackPositionStyles(feedback.xPos, feedback.yPos);

  // [스타일 분기]
  const containerStyles = isMobileView ? {
      position: 'static' as const,
      width: '100%',
      maxWidth: '100%',
      boxShadow: 'none',
      border: 'none',
      borderRadius: '0', // Drawer가 이미 둥글어서
      margin: 0,
  } : {
      ...positionStyles,
      ...marginStyles,
      position: 'absolute' as const,
      width: '320px',
      maxW: '90vw',
      borderRadius: '12px',
      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
  };

  if (isEditing) {
    return (
      <Box 
        position={isMobileView ? 'static' : 'absolute'} 
        zIndex={200} 
        w={isMobileView ? '100%' : undefined}
        onClick={(e) => e.stopPropagation()}
        style={isMobileView ? {} : { ...positionStyles, ...marginStyles }}
      >
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
      layoutId={isMobileView ? undefined : `feedback-${feedback.id}`} 
      zIndex={200}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      style={containerStyles}
      p={4}
      bg="white"
      overflow="hidden"

      // 애니메이션: 모바일은 Drawer가 처리하므로 끔
      initial={isMobileView ? undefined : { opacity: 0, scale: 0.8 }}
      animate={isMobileView ? undefined : { opacity: 1, scale: 1 }}
      exit={isMobileView ? undefined : { opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      transformOrigin={transformOrigin}
    >
      {/* Header */}
      <Flex w={'fit-content'} justify="space-between" align="center" p={3} borderBottom="1px solid" borderColor="gray.50" bg="white">
        <Flex gap={2} align="center">
          <CommentAvartarIcon size={34} color='#53A8FE'/>
          <Text fontWeight="medium" fontSize={{base:"sm", md:"xl"}} color="#394250">{feedback.authorName}</Text>
          <Text fontSize={{base:"xs",md:"lg"}} color="#A29E9A">{formatRelativeTime(feedback.createdAt)}</Text>
        </Flex>
        
        <Flex gap={1}>
          {isMentor && isAuthor && (
            <Menu isLazy>
              <MenuButton as={IconButton} icon={<MoreIcon />} size="xs" variant="ghost" aria-label="Options" color="gray.400" _hover={{ bg: 'gray.50', color: 'gray.600' }} />
              <MenuList minW="100px" fontSize="sm">
                <MenuItem onClick={() => setIsEditing(true)}>수정</MenuItem>
                <MenuItem color="red.500" onClick={onDeleteFeedback}>삭제</MenuItem>
              </MenuList>
            </Menu>
          )}
          <IconButton icon={<CloseIcon boxSize={2.5} color="gray.400" />} size="xs" variant="ghost" aria-label="Close" onClick={onClose} _hover={{ bg: 'gray.50', color: 'gray.600' }} />
        </Flex>
      </Flex>

      {/* Body */}
      <Box p={4} maxH={isMobileView ? "60vh" : "300px"} overflowY="auto">
        <Text 
          fontSize={{base:"xs", md:"md"}} 
          lineHeight="1.3"
          color="#394250"
          mb={feedback.imageUrl ? 3 : 0}
          sx={{
            'strong': { color: 'blue.600', fontWeight: '800', bg: 'blue.50', px: 1, borderRadius: '2px' }
          }}
          dangerouslySetInnerHTML={{ __html: parseEmphasis(feedback.content) }} 
        />
        {feedback.imageUrl && (
          <Image src={feedback.imageUrl} alt="Feedback Attachment" borderRadius="lg" maxH="200px" objectFit="cover" w="full" border="1px solid" borderColor="gray.100" />
        )}
      </Box>

      {/* Footer (Comments) */}
      <Box p={3}>
        <Box overflowY="auto" mb={3} css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
           {answers.map(ans => (
             <AnswerItem key={ans.id} answer={ans} currentUserId={currentUserId} onEdit={onUpdateAnswer} onDelete={onDeleteAnswer} />
           ))}
        </Box>
        <Flex gap={2} p={1} align="center">
          <CommentAvartarIcon 
              size={34} 
              color={isMentor ? '#53A8FE' : '#AAD4FF'}
            />
          <Flex
            position="absolute" 
            w="full" 
            minH={{ md: "112px" }} 
            bg="#F9F9FB"
            p={3} 
            borderRadius="6"
          >
            <Input 
              variant="unstyled" 
              placeholder="댓글 달기..." 
              value={newAnswer} 
              onChange={(e) => setNewAnswer(e.target.value)} 
              fontSize="sm" 
              px={3} 
              h="32px" 
              flex={1} 
            />
            <IconButton 
              position="absolute"      // ← Flex 안에서 다시 absolute
              bottom={3}              // Flex 패딩만큼
              right={3}               // Flex 패딩만큼
              aria-label="Send" 
              icon={<CommentIcon />} 
              size="sm" 
              colorScheme="blue" 
              isRound 
              isDisabled={!newAnswer.trim()}
              onClick={() => { 
                onAddAnswer(newAnswer); 
                setNewAnswer(''); 
              }}
            />
          </Flex>
        </Flex>
      </Box>
    </MotionBox>
  );
};
