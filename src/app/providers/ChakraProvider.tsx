import { ChakraProvider as Provider } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import theme from '../styles/theme';
import { globalStyles } from '../styles/global';

interface Props {
  children: React.ReactNode;
}

export const ChakraProvider = ({ children }: Props) => {
  return (
    <Provider theme={theme}>
      <Global styles={globalStyles} />
      {children}
    </Provider>
  );
};