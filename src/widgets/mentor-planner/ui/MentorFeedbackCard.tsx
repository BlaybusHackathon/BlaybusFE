import { useState, useEffect } from 'react';
import { Box, Text, Flex, Button, Textarea } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { ModifyIcon } from '@/shared/ui/icons';
import TextareaAutosize from 'react-textarea-autosize';


interface Props {
  feedback: string | null;
  onSave: (feedback: string) => void;
}

export const MentorFeedbackCard = ({ feedback, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(feedback || '');
  }, [feedback]);

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
      bg="white"
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
            onClick={() => setIsEditing(true)}
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
            borderRadius="22px"
            minH={'8.3125rem'}
            bg="#F9F9FB"
            p={4}
            resize="none" 
            mb={4}
            fontSize="18px"
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
        <Box
          bg="#F9F9FB"
          p="32px 34px"
          borderRadius="22px"
          cursor="pointer"
          onClick={() => setIsEditing(true)}
          transition="background 0.2s"
          _hover={{ bg: feedback ? "gray.50" : "gray.100" }}
        >
          {feedback ? (
            <Text fontSize="18px" color="#373E56" whiteSpace="pre-wrap" lineHeight="1.7">
              {feedback}
            </Text>
          ) : (
            <Flex justify="center" align="center" h="full" minH="60px">
              <Text fontSize="18px" color="#373E56" py={2}>
                피드백을 등록해주세요.
              </Text>
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};