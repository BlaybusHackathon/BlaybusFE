import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Pretendard, sans-serif',
    body: 'Pretendard, sans-serif',
  },
  breakpoints: {
    sm: '360px',
    md: '768px',
    lg: '1280px',
    xl: '1920px',
  },
  colors: {
    brand: {
      50: '#E3F2F9',
      100: '#C5E4F3',
      500: '#3182CE',
      900: '#1A365D',
    },
  },
});

export default theme;