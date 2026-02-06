import { Box, Text, Flex } from '@chakra-ui/react';

interface Props {
  memo: string | null;
}

export const MenteeCommentCard = ({ memo }: Props) => {
  return (
    <Box
      bg="white"
      borderRadius="22px"
    >
      <Flex align="center" mb={4} gap={3}>
        <Text fontSize="20px" fontWeight="700" color="#373E56">
          코멘트
        </Text>
      </Flex>

      <Box
        bg="#F9F9FB"
        p="32px 34px"
        borderRadius="22px"
      >
        {memo ? (
          <Text fontSize="18px" color="#373E56">
            {memo}
          </Text>
        ) : (
          <Text fontSize="18px" color="#373E56" textAlign="center" py={2}>
            작성된 코멘트가 없습니다.
          </Text>
        )}
      </Box>
    </Box>
  );
};