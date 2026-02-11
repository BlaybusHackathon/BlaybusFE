import { useState } from 'react';
import { Box, Text, Flex, Button, Textarea } from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { ModifyIcon } from '@/shared/ui/icons';


interface Props {
  feedback: string | null;
  onSave: (feedback: string) => void;
}

export const MentorFeedbackCard = ({ feedback, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');

  const startEditing = () => {
    setValue(feedback || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(feedback || '');
    setIsEditing(false);
  };

  return (
    <Box
      bg={{base:"none",md:"white"}}
      borderRadius="22px"
      position="relative"
    >
      <Flex justify="space-between" align="center" mb={4} gap={3}>
        <Text fontSize="20px" fontWeight="700" color="#373E56">
          멘토 피드백
        </Text>

        {!isEditing && (
          <Button
            variant="ghost"
            colorScheme="#373E56"
            color={"#9B9BA4"}
            leftIcon={<ModifyIcon />}
            onClick={startEditing}
            fontSize="18px"
          >
            수정
          </Button>
        )}
      </Flex>

      {isEditing ? (
        <Box h={'fit-content'}>
          <Textarea
            as={TextareaAutosize}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="오늘 하루에 대한 피드백을 남겨주세요."
            minH="150px"
            bg="#F9F9FB"
            border="none"
            borderColor="transparent"
            borderRadius="22"
            p={6}
            fontSize="16px"
            color="#7E7E7E"
            _placeholder={{ color: '#9B9BA4' }}
            _focus={{
              bg: 'white',
              border: '1px solid',
              borderColor: '#53A8FE',
              boxShadow: 'none'
            }}
            resize="none"
            mb={4}
            lineHeight="1.6"
            cursor="text"
          />
          <Flex justify="flex-end" gap={2}>
            <Button
              size="md"
              variant="ghost"
              onClick={handleCancel}
              leftIcon={<CloseIcon w={3} h={3} />}
            >
              취소
            </Button>
            <Button
              size="md"
              bg="#53A8FE"
              color="white"
              onClick={handleSave}
              leftIcon={<CheckIcon w={3} h={3} />}
            >
              저장
            </Button>
          </Flex>
        </Box>
      ) : (
        <Box onClick={startEditing} cursor="pointer">
          <Textarea
            as={TextareaAutosize}
            value={feedback ?? ''}
            placeholder="피드백을 등록해주세요."
            isReadOnly
            minH="150px"
            bg="#F9F9FB"
            borderColor="#F9F9FB"
            borderRadius="22"
            p={6}
            fontSize="16px"
            color="#7E7E7E"
            _placeholder={{ color: '#9B9BA4' }}
            _focus={{
              bg: 'white',
              border: '1px solid',
              borderColor: '#53A8FE',
              boxShadow: 'none'
            }}
            resize="none"
            lineHeight="1.6"
            cursor="pointer"
          />
        </Box>
      )}
    </Box>
  );
};
