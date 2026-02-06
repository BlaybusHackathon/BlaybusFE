import { Flex } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

interface Props {
  onClick: () => void;
}

export const AddWeaknessButton = ({ onClick }: Props) => {
  return (
    <Flex
      bg="#F9F9FB"
      borderRadius="22px"
      align="center"
      justify="center"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        bg: 'gray.100',
      }}
      color="#A0A5B1"
      onClick={onClick}
      h="72px"
    >
      <AddIcon w={4} h={4} />
    </Flex>
  );
};