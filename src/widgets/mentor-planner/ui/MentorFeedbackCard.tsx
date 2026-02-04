import { useState, useEffect } from 'react';
import { Box, Text, Flex, Button, Textarea } from '@chakra-ui/react';
import { EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

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
      p={{ base: 4, md: 6 }} 
      borderRadius="3xl" 
      position="relative"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="md" fontWeight="bold" color="gray.700">
          멘토 피드백
        </Text>

        {!isEditing && (
          <Button 
            size="sm" 
            variant="ghost" 
            colorScheme="gray" 
            leftIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
            fontSize="sm"
          >
            수정
          </Button>
        )}
      </Flex>

      {isEditing ? (
        <Box>
          <Textarea 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="오늘 하루에 대한 피드백을 남겨주세요."
            size="md"
            borderRadius="xl"
            minH="120px"
            bg="white"
            mb={4}
            focusBorderColor="blue.500"
            p={4}
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
              colorScheme="blue" 
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
          p={6} 
          borderRadius="2xl" 
          minH="100px"
          cursor="pointer"
          onClick={() => setIsEditing(true)}
          transition="background 0.2s"
          _hover={{ bg: feedback ? "gray.50" : "gray.100" }}
        >
          {feedback ? (
            <Text fontSize="md" color="gray.800" whiteSpace="pre-wrap" lineHeight="1.7">
              {feedback}
            </Text>
          ) : (
            <Flex justify="center" align="center" h="full" minH="60px">
                <Text fontSize="md" color="gray.400" py={2}>
                피드백을 등록해주세요.
                </Text>
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};