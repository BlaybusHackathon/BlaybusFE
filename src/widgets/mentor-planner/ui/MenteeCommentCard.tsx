import { Box, Text, Flex } from '@chakra-ui/react';

interface Props {
  memo: string | null;
}

export const MenteeCommentCard = ({ memo }: Props) => {
  return (
    <Box 
      bg="white" 
      p={5} 
      borderRadius="2xl" 
    >
      <Flex align="center" mb={3} gap={2}>
        <Text fontSize="md" fontWeight="bold" color="gray.700">
          코멘트
        </Text>
      </Flex>

      <Box 
        bg="#F9F9FB" 
        p={4} 
        borderRadius="xl" 
        minH="80px"
      >
        {memo ? (
          <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap" lineHeight="1.6">
            {memo}
          </Text>
        ) : (
          <Text fontSize="sm" color="gray.400" textAlign="center" py={2}>
            작성된 코멘트가 없습니다.
          </Text>
        )}
      </Box>
    </Box>
  );
};