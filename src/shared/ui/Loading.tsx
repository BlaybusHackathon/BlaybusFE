import { Center, Spinner } from '@chakra-ui/react';

export const Loading = () => (
  <Center h="100vh">
    <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" emptyColor="gray.200" />
  </Center>
);