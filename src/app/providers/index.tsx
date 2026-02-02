import { ChakraProvider } from './ChakraProvider';
import { RouterProvider } from './RouterProvider';

export const AppProviders = () => {
  return (
    <ChakraProvider>
      <RouterProvider />
    </ChakraProvider>
  );
};