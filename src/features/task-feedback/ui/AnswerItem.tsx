import { Box, Flex, Text, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import type { SVGProps } from 'react';
import { AnswerWithAuthor } from '../model/types';
import { formatRelativeTime } from '../model/feedbackUtils';
import { CommentAvartarIcon, ModifyIcon, DeleteIcon } from '@/shared/ui/icons';

interface AnswerItemProps {
  answer: AnswerWithAuthor;
  currentUserId: string;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

const MoreIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="5" cy="12" r="2" fill="currentColor"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <circle cx="19" cy="12" r="2" fill="currentColor"/>
  </svg>
);

export const AnswerItem = ({ answer, currentUserId, onEdit, onDelete }: AnswerItemProps) => {
  const isAuthor = Boolean(answer.userId) && answer.userId === currentUserId;
  const isMentor = answer.authorRole === "MENTOR";

  return (
    <Box mb={3}>
      <Flex justify="space-between" align="flex-start">
        <Flex gap={2} align="center" mb={1}>
          <CommentAvartarIcon size={30} color='#AAD4FF'/>
          <Text fontWeight="medium" fontSize={{base:"sm", md:"xl"}} color="#394250">
            {answer.authorName}
            {isMentor && <Text as="span" fontSize="10px" ml={1}>(멘토)</Text>}
          </Text>
          <Text fontSize={{base:"xs",md:"lg"}} color="#A29E9A">· {formatRelativeTime(answer.createdAt)}</Text>
        </Flex>

        {isAuthor && (
          <Menu isLazy>
            <MenuButton 
              as={IconButton} 
              icon={<MoreIcon />} 
              size="xs" 
              variant="ghost" 
              aria-label="Options"
              h="20px"
              minW="20px"
              color="gray.400"
              _hover={{ color: 'gray.600', bg: 'transparent' }}
            />
            <MenuList minW="80px" fontSize={{base:"xs", md:"md"}}>
              <MenuItem onClick={() => {
                const newText = prompt('댓글 수정', answer.comment);
                if (newText) onEdit(answer.id, newText);
              }}>수정 <ModifyIcon color='#394250'/></MenuItem>
              <MenuItem color="#394250" onClick={() => onDelete(answer.id)}>삭제 <DeleteIcon/></MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
      <Flex w={'full'} pl={10} mb={8}>
        <Text fontSize={{base:"xs", md:"md"}} color="#394250" whiteSpace="pre-wrap" lineHeight="1.3">{answer.comment}</Text>
      </Flex>    
    </Box>
  );
};
