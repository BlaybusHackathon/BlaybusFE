import { Input as ChakraInput, InputProps, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface Props extends InputProps {
  label?: string;
  errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, errorMessage, ...props }, ref) => {
    return (
      <FormControl isInvalid={!!errorMessage}>
        {label && <FormLabel>{label}</FormLabel>}
        <ChakraInput ref={ref} {...props} />
        {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Input.displayName = 'Input';