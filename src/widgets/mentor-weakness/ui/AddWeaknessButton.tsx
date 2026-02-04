import { Flex, Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

interface Props {
  onClick: () => void;
}

export const AddWeaknessButton = ({ onClick }: Props) => {
  return (
    <Flex
      bg="white"
      border="1px dashed"
      borderColor="gray.300"
      p={5}
      borderRadius="2xl"
      align="center"
      justify="center"
      cursor="pointer"
      transition="all 0.2s"
      gap={2}
      _hover={{ 
        borderColor: 'blue.400', 
        bg: 'blue.50',
        color: 'blue.500'
      }}
      color="gray.400"
      onClick={onClick}
      h="72px" 
    >
      <AddIcon w={3} h={3} />
      <Text fontSize="sm" fontWeight="bold">보완점 추가하기</Text>
    </Flex>
  );
};